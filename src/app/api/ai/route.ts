import { NextRequest, NextResponse } from 'next/server';
import { processWithGemini, generateUserContextSummary, ProcessedGeminiOutput, AiOperation, InteractionMode } from '@/lib/gemini';
import { Category, Task, Note, Goal, Event as AppEvent, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import NoteModel from '@/models/NoteModel';
import GoalModel from '@/models/GoalModel';
import EventModel from '@/models/EventModel';
import UserModel from '@/models/UserModel';
import { getToken } from 'next-auth/jwt';
import type { Part, Content } from '@google/generative-ai';

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];

async function findTaskByName(userId: string, taskName: string, category?: Category): Promise<Task | null> {
    const query: any = { userId, text: { $regex: `^${taskName}$`, $options: 'i' } };
    if (category && category !== "All Projects") {
        query.category = category;
    }
    return TaskModel.findOne(query).lean();
}


export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized for AI command' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const { 
        parts, 
        currentCategory, 
        chatHistory, // In-session chat history
        isEndingChatSession, // Flag to trigger summarization
        interactionMode // 'quickCommand' or 'chatSession'
    } = await request.json();

    if (!interactionMode || (interactionMode !== 'quickCommand' && interactionMode !== 'chatSession')) {
        return NextResponse.json({ message: 'Valid interactionMode is required.' }, { status: 400 });
    }

    if (!parts && !isEndingChatSession) {
      return NextResponse.json({ message: 'Input parts are required unless ending chat session.' }, { status: 400 });
    }
    if (!currentCategory && !isEndingChatSession && interactionMode !== 'chatSession') { 
        // currentCategory might be less critical for a chat session just ending if parts is also empty
        // but for active command/chat turns, it's usually needed.
         if(!parts || (parts as Part[]).length === 0) {
            // If ending session and no parts, category is not needed
         } else {
            return NextResponse.json({ message: 'currentCategory is required for active commands.' }, { status: 400 });
         }
    }


    const userProfile = await UserModel.findOne({ id: userId });
    const persistentUserContextSummary = userProfile?.userContextSummary || "";

    if (isEndingChatSession && chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
        const summary = await generateUserContextSummary(chatHistory as Content[]);
        if (summary && userProfile) {
            userProfile.userContextSummary = (persistentUserContextSummary ? persistentUserContextSummary + "\n\n" : "") + `Chat Session Summary (${new Date().toISOString()}):\n${summary}`;
            const MAX_CONTEXT_LENGTH = 5000; 
            if (userProfile.userContextSummary.length > MAX_CONTEXT_LENGTH) {
                userProfile.userContextSummary = userProfile.userContextSummary.slice(-MAX_CONTEXT_LENGTH);
            }
            await userProfile.save();
            return NextResponse.json({ aiMessage: "Chat session summarized and user context updated.", operations: [] }, { status: 200 });
        }
        return NextResponse.json({ aiMessage: "Chat session ended, no summary generated or user profile not found.", operations: [] }, { status: 200 });
    }
    
    if (!parts || !Array.isArray(parts) || parts.length === 0) {
         return NextResponse.json({ message: 'Input parts are required for active commands.' }, { status: 400 });
    }

    const geminiResult: ProcessedGeminiOutput = await processWithGemini(
        parts as Part[], 
        currentCategory as Category, 
        ["All Projects", ...baseAvailableCategories],
        interactionMode as InteractionMode,
        persistentUserContextSummary,
        chatHistory as Content[] | undefined
    );

    if (geminiResult.overallError) {
      return NextResponse.json({ aiMessage: geminiResult.reply || geminiResult.overallError, operations: geminiResult.operations || [], error: geminiResult.overallError }, { status: 422 });
    }
    
    let executedOperationsInfo: { type: string; summary: string; success: boolean; error?: string }[] = [];
    let hasExecutionErrors = false;
    
    if (geminiResult.operations && geminiResult.operations.length > 0) {
        for (const operation of geminiResult.operations) {
            let effectiveCategory = operation.payload.category || currentCategory;
            if ((effectiveCategory === "All Projects" || !baseAvailableCategories.includes(effectiveCategory as Category)) && baseAvailableCategories.length > 0) {
                effectiveCategory = baseAvailableCategories[0];
            } else if (!baseAvailableCategories.includes(effectiveCategory as Category)) {
                effectiveCategory = "Personal Life";
            }
            let itemSummary = "";

            try {
                switch (operation.action) {
                case 'addTask':
                    if (!operation.payload.text) throw new Error('Task text is missing.');
                    itemSummary = operation.payload.text.substring(0, 30);
                    const newTaskData: Task = {
                    id: uuidv4(), userId: userId, text: operation.payload.text!, completed: false,
                    dueDate: operation.payload.dueDate as string | undefined, category: effectiveCategory as Category,
                    recurrenceRule: operation.payload.recurrenceRule,
                    subTasks: (operation.payload.subTasks || []).map(st => ({ id: uuidv4(), text: st.text, completed: false })),
                    createdAt: new Date().toISOString(),
                    };
                    const createdTask = new TaskModel(newTaskData); await createdTask.save();
                    executedOperationsInfo.push({ type: 'Task Added', summary: itemSummary, success: true });
                    break;
                
                case 'updateTask':
                    let taskToUpdateId = operation.payload.taskIdToUpdate;
                    let taskInstance = null;
                    if (taskToUpdateId) { taskInstance = await TaskModel.findOne({ id: taskToUpdateId, userId: userId }); }
                    else if (operation.payload.text) { 
                        taskInstance = await findTaskByName(userId, operation.payload.text, effectiveCategory as Category);
                        if (taskInstance) taskToUpdateId = taskInstance.id; 
                    }
                    if (!taskInstance) throw new Error(`Task '${operation.payload.text || taskToUpdateId || 'Unknown'}' not found.`);
                    itemSummary = taskInstance.text.substring(0, 30);
                    let updated = false;
                    if (operation.payload.text && operation.payload.text !== taskInstance.text) { taskInstance.text = operation.payload.text; updated = true; }
                    // ... (other update fields for task)
                    if (updated) await taskInstance.save();
                    executedOperationsInfo.push({ type: 'Task Updated', summary: itemSummary, success: true, error: updated ? undefined : "No changes applied." });
                    break;

                case 'addNote':
                    if (!operation.payload.content) throw new Error('Note content is missing.');
                    itemSummary = operation.payload.title || operation.payload.content.substring(0, 30);
                    const newNoteData: Note = { id: uuidv4(), userId: userId, title: operation.payload.title as string | undefined, content: operation.payload.content!, category: effectiveCategory as Category, lastEdited: new Date().toISOString() };
                    const createdNote = new NoteModel(newNoteData); await createdNote.save();
                    executedOperationsInfo.push({ type: 'Note Added', summary: itemSummary, success: true });
                    break;

                case 'addGoal':
                    if (!operation.payload.name || operation.payload.targetValue === undefined || !operation.payload.unit) throw new Error('Goal name, targetValue, or unit is missing.');
                    itemSummary = operation.payload.name.substring(0, 30);
                    const newGoalData: Goal = { id: uuidv4(), userId: userId, name: operation.payload.name!, currentValue: (operation.payload as Goal).currentValue || 0, targetValue: operation.payload.targetValue!, unit: operation.payload.unit!, category: effectiveCategory as Category };
                    const createdGoal = new GoalModel(newGoalData); await createdGoal.save();
                    executedOperationsInfo.push({ type: 'Goal Added', summary: itemSummary, success: true });
                    break;
                    
                case 'addEvent':
                    if (!operation.payload.title || !operation.payload.date) throw new Error('Event title or date is missing.');
                    itemSummary = operation.payload.title.substring(0, 30);
                    const newEventData: AppEvent = { id: uuidv4(), userId: userId, title: operation.payload.title!, date: operation.payload.date!, description: operation.payload.description as string | undefined, category: effectiveCategory as Category, recurrenceRule: operation.payload.recurrenceRule };
                    const createdEvent = new EventModel(newEventData); await createdEvent.save();
                    executedOperationsInfo.push({ type: 'Event Added', summary: itemSummary, success: true });
                    break;
                
                case 'unknown':
                    hasExecutionErrors = true;
                    executedOperationsInfo.push({ type: 'Unknown Operation', summary: operation.payload.error || 'Could not process.', success: false, error: operation.payload.error });
                    break;
                // Clarification/Suggestion are handled by the main 'reply' from Gemini, not as DB ops.
                }
            } catch (opError) {
                hasExecutionErrors = true;
                console.error(`Error executing AI operation ${operation.action}:`, opError);
                executedOperationsInfo.push({ type: operation.action, summary: itemSummary || 'Failed operation', success: false, error: (opError as Error).message });
            }
        }
    }

    // Construct final user-facing message based on Gemini's reply and executed operations
    let finalUserMessage = geminiResult.reply;
    if (executedOperationsInfo.some(op => op.success)) {
        const successfulOpsSummary = executedOperationsInfo.filter(op => op.success).map(op => `${op.type} '${op.summary}'`).join(', ');
        if (finalUserMessage.slice(-1) !== '.' && finalUserMessage.slice(-1) !== '!' && finalUserMessage.slice(-1) !== '?') {
             finalUserMessage += ".";
        }
        finalUserMessage += ` I also processed these actions: ${successfulOpsSummary}.`;
    }
    if (hasExecutionErrors) {
        const failedOpsSummary = executedOperationsInfo.filter(op => !op.success).map(op => `${op.type} failed: ${op.error}`).join(', ');
        finalUserMessage += ` However, some actions failed: ${failedOpsSummary}.`;
    }
    
    return NextResponse.json({ 
        aiMessage: finalUserMessage.trim(), 
        operations: geminiResult.operations, // Send back the AI's intended operations for potential UI use or logging
        executedOperationsLog: executedOperationsInfo, // Log of what was actually attempted/done
        originalInputParts: geminiResult.originalInputParts
    }, { status: hasExecutionErrors && !executedOperationsInfo.some(i=>i.success) ? 422 : 200 });

  } catch (error) {
    console.error('Error in AI command processing API:', error);
    return NextResponse.json({ aiMessage: 'Failed to process AI command.', error: (error as Error).message, operations:[] }, { status: 500 });
  }
}
