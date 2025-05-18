import { NextRequest, NextResponse } from 'next/server';
import { processWithGemini, GeminiProcessedResponse, AiOperation } from '@/lib/gemini';
import { Category, Task, Note, Goal, Event as AppEvent } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import NoteModel from '@/models/NoteModel';
import GoalModel from '@/models/GoalModel';
import EventModel from '@/models/EventModel';
import { getToken } from 'next-auth/jwt';

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized for AI command' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const { command, currentCategory } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ message: 'Command is required and must be a string.' }, { status: 400 });
    }
    if (!currentCategory || typeof currentCategory !== 'string') {
      return NextResponse.json({ message: 'currentCategory is required and must be a string.' }, { status: 400 });
    }

    const geminiResult: GeminiProcessedResponse = await processWithGemini(command, currentCategory as Category, ["All Projects", ...baseAvailableCategories]);

    if (geminiResult.overallError || geminiResult.operations.length === 0) {
      return NextResponse.json({ message: 'AI could not process the command.', details: geminiResult.overallError || "No operations returned from AI.", originalCommand: command }, { status: 422 });
    }

    let createdItemsInfo: { type: string; summary: string; success: boolean; error?: string }[] = [];
    let hasErrors = false;
    let aiMessageForCard: string | null = null;

    for (const operation of geminiResult.operations) {
      const payloadCategory = operation.payload.category || currentCategory;
      const effectiveCategory = (payloadCategory === "All Projects" && baseAvailableCategories.length > 0) ? baseAvailableCategories[0] : payloadCategory;
      let itemSummary = "";

      try {
        switch (operation.action) {
          case 'addTask':
            if (!operation.payload.text) throw new Error('Task text is missing.');
            itemSummary = operation.payload.text.substring(0, 30);
            const newTaskData: Task = {
              id: uuidv4(),
              userId: userId, // Assign userId
              text: operation.payload.text!,
              completed: false,
              dueDate: operation.payload.dueDate as string | undefined,
              category: effectiveCategory as Category,
              recurrenceRule: operation.payload.recurrenceRule,
              subTasks: operation.payload.subTasks?.map(st => ({...st, id: uuidv4(), completed: false})), // Add id and completed to subtasks
              createdAt: new Date().toISOString(),
            };
            const createdTask = new TaskModel(newTaskData);
            await createdTask.save();
            createdItemsInfo.push({ type: 'Task', summary: itemSummary, success: true });
            break;
          
          case 'addNote':
            if (!operation.payload.content) throw new Error('Note content is missing.');
            itemSummary = operation.payload.title || operation.payload.content.substring(0, 30);
            const newNoteData: Note = {
              id: uuidv4(),
              userId: userId, // Assign userId
              title: operation.payload.title as string | undefined,
              content: operation.payload.content!,
              category: effectiveCategory as Category,
              lastEdited: new Date().toISOString(),
            };
            const createdNote = new NoteModel(newNoteData);
            await createdNote.save();
            createdItemsInfo.push({ type: 'Note', summary: itemSummary, success: true });
            break;

          case 'addGoal':
            if (!operation.payload.name || operation.payload.targetValue === undefined || !operation.payload.unit) {
                throw new Error('Goal name, targetValue, or unit is missing.');
            }
            itemSummary = operation.payload.name.substring(0, 30);
            const newGoalData: Goal = {
              id: uuidv4(),
              userId: userId, // Assign userId
              name: operation.payload.name!,
              currentValue: (operation.payload as Goal).currentValue || 0,
              targetValue: operation.payload.targetValue!,
              unit: operation.payload.unit!,
              category: effectiveCategory as Category,
            };
            const createdGoal = new GoalModel(newGoalData);
            await createdGoal.save();
            createdItemsInfo.push({ type: 'Goal', summary: itemSummary, success: true });
            break;
            
          case 'addEvent':
            if (!operation.payload.title || !operation.payload.date) {
                 throw new Error('Event title or date is missing.');
            }
            itemSummary = operation.payload.title.substring(0, 30);
            const newEventData: AppEvent = {
                id: uuidv4(),
                userId: userId, // Assign userId
                title: operation.payload.title!,
                date: operation.payload.date!,
                description: operation.payload.description as string | undefined,
                category: effectiveCategory as Category,
                recurrenceRule: operation.payload.recurrenceRule,
            };
            const createdEvent = new EventModel(newEventData);
            await createdEvent.save();
            createdItemsInfo.push({ type: 'Event', summary: itemSummary, success: true });
            break;
          
          case 'clarification':
          case 'suggestion':
            if (operation.payload.message) {
              aiMessageForCard = operation.payload.message;
              if (geminiResult.operations.length === 1) {
                 createdItemsInfo.push({ type: operation.action, summary: operation.payload.message, success: true});
              }
            }
            break;

          case 'unknown':
            hasErrors = true;
            createdItemsInfo.push({ type: 'Unknown', summary: operation.payload.error || 'Could not process part of the command.', success: false, error: operation.payload.error });
            break;
          default:
            hasErrors = true;
            createdItemsInfo.push({ type: 'Unsupported', summary: `Action '${operation.action}' not supported.`, success: false, error: `Unsupported action: ${operation.action}`});
        }
      } catch (opError) {
        hasErrors = true;
        createdItemsInfo.push({ type: operation.action, summary: itemSummary || 'Failed operation', success: false, error: (opError as Error).message });
      }
    }

    let responseMessage = "";
    if (createdItemsInfo.length > 0) {
        const successes = createdItemsInfo.filter(item => item.success);
        const failures = createdItemsInfo.filter(item => !item.success);

        if (successes.length > 0) {
            responseMessage += successes.map(s => `${s.type} "${s.summary}..." created`).join('. ') + ". ";
        }
        if (failures.length > 0) {
            responseMessage += "Some operations failed: " + failures.map(f => `${f.type} (${f.error || 'Unknown error'})`).join('. ') + ".";
        }
    } else if (aiMessageForCard) {
        responseMessage = aiMessageForCard;
    }
     else if (!hasErrors) {
        responseMessage = "AI command processed, but no specific items were created or actions taken.";
    } else {
        responseMessage = "Could not fully process your command.";
    }
    
    if (responseMessage.trim() === "") {
        responseMessage = hasErrors ? "There were issues processing your command." : "Command received.";
    }

    return NextResponse.json({ 
        message: responseMessage.trim(), 
        details: createdItemsInfo, 
        originalCommand: command 
    }, { status: hasErrors && createdItemsInfo.filter(i=>i.success).length === 0 ? 422 : 200 });

  } catch (error) {
    console.error('Error in AI command processing API:', error);
    return NextResponse.json({ message: 'Failed to process AI command.', error: (error as Error).message }, { status: 500 });
  }
}

