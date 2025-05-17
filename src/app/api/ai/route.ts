import { NextRequest, NextResponse } from 'next/server';
import { processWithGemini, GeminiResponse } from '@/lib/gemini';
import { Category, Task, Note, Goal, Event as AppEvent } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import NoteModel from '@/models/NoteModel';
import GoalModel from '@/models/GoalModel';
import EventModel from '@/models/EventModel';

// This should ideally come from a dynamic source or be more robustly managed
const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];


export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { command, currentCategory } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ message: 'Command is required and must be a string.' }, { status: 400 });
    }
    if (!currentCategory || typeof currentCategory !== 'string') {
      return NextResponse.json({ message: 'currentCategory is required and must be a string.' }, { status: 400 });
    }

    const geminiResult: GeminiResponse = await processWithGemini(command, currentCategory as Category, ["All Projects", ...baseAvailableCategories]);

    if (geminiResult.action === 'unknown' || geminiResult.error) {
      return NextResponse.json({ message: 'AI could not process the command.', details: geminiResult.payload.error || "Unknown error from AI.", originalCommand: command }, { status: 422 });
    }

    let createdItem: any = null;
    const payloadCategory = geminiResult.payload.category || currentCategory;
    const effectiveCategory = (payloadCategory === "All Projects" && baseAvailableCategories.length > 0) ? baseAvailableCategories[0] : payloadCategory;


    switch (geminiResult.action) {
      case 'addTask':
        if (!geminiResult.payload.text) return NextResponse.json({ message: 'Task text is missing from AI response.' }, { status: 422 });
        const newTaskData: Task = {
          id: uuidv4(),
          text: geminiResult.payload.text!,
          completed: false,
          dueDate: geminiResult.payload.dueDate as string | undefined,
          category: effectiveCategory,
        };
        createdItem = new TaskModel(newTaskData);
        await createdItem.save();
        break;
      
      case 'addNote':
        if (!geminiResult.payload.content) return NextResponse.json({ message: 'Note content is missing from AI response.' }, { status: 422 });
        const newNoteData: Note = {
          id: uuidv4(),
          title: geminiResult.payload.title as string | undefined,
          content: geminiResult.payload.content!,
          category: effectiveCategory,
          lastEdited: new Date().toISOString(),
        };
        createdItem = new NoteModel(newNoteData);
        await createdItem.save();
        break;

      case 'addGoal':
        if (!geminiResult.payload.name || geminiResult.payload.targetValue === undefined || !geminiResult.payload.unit) {
            return NextResponse.json({ message: 'Goal name, targetValue, or unit is missing from AI response.' }, { status: 422 });
        }
        const newGoalData: Goal = {
          id: uuidv4(),
          name: geminiResult.payload.name!,
          currentValue: (geminiResult.payload as Goal).currentValue || 0,
          targetValue: geminiResult.payload.targetValue!,
          unit: geminiResult.payload.unit!,
          category: effectiveCategory,
        };
        createdItem = new GoalModel(newGoalData);
        await createdItem.save();
        break;
        
      case 'addEvent':
        if (!geminiResult.payload.title || !geminiResult.payload.date) {
             return NextResponse.json({ message: 'Event title or date is missing from AI response.' }, { status: 422 });
        }
        const newEventData: AppEvent = {
            id: uuidv4(),
            title: geminiResult.payload.title!,
            date: geminiResult.payload.date!, // Should be ISO string from Gemini
            description: geminiResult.payload.description as string | undefined,
            category: effectiveCategory,
        };
        createdItem = new EventModel(newEventData);
        await createdItem.save();
        break;

      default:
        return NextResponse.json({ message: `Action '${geminiResult.action}' not supported or understood.`, originalCommand: command, aiResponse: geminiResult }, { status: 400 });
    }

    return NextResponse.json({ message: `${geminiResult.action} successful!`, item: createdItem, originalCommand: command, aiResponse: geminiResult.payload }, { status: 201 });

  } catch (error) {
    console.error('Error in AI command processing API:', error);
    return NextResponse.json({ message: 'Failed to process AI command.', error: (error as Error).message }, { status: 500 });
  }
}
