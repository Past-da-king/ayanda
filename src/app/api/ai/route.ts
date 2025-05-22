import { NextRequest, NextResponse } from 'next/server';
import { processWithGemini, generateUserContextSummary, ProcessedGeminiOutput, InteractionMode } from '@/lib/gemini';
import { Category, Task, Note, Goal, Event as AppEvent } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import NoteModel from '@/models/NoteModel';
import GoalModel from '@/models/GoalModel';
import EventModel from '@/models/EventModel';
import UserModel from '@/models/UserModel';
import { getToken } from 'next-auth/jwt';
import type { Part, Content } from '@google/generative-ai';
import { ExecutedOperationInfo } from '@/components/dashboard/AiAssistantWidget'; // Ensure this path is correct

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];

async function findTaskByName(userId: string, taskName: string, category?: Category): Promise<Task | null> {
    const query: { userId: string; text: { $regex: string; $options: string }; category?: Category } = { userId, text: { $regex: `^${taskName}$`, $options: 'i' } };
    if (category && category !== "All Projects") {
        query.category = category;
    }
    // Remove .lean() to get a full Mongoose document with virtuals like 'id'
    // and to ensure timestamps are handled as expected by the 'Task' type if they differ.
    const taskDoc = await TaskModel.findOne(query);
    if (taskDoc) {
        // Manually construct the Task object to ensure type compliance,
        // especially for createdAt (Date to string) and id.
        return {
            id: taskDoc.id, // Mongoose virtual getter
            userId: taskDoc.userId,
            text: taskDoc.text,
            completed: taskDoc.completed,
            dueDate: taskDoc.dueDate,
            category: taskDoc.category,
            recurrenceRule: taskDoc.recurrenceRule,
            subTasks: taskDoc.subTasks?.map(st => ({ ...st })), // Assuming SubTask type matches
            createdAt: taskDoc.createdAt?.toISOString(),
        };
    }
    return null;
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
        chatHistory, 
        isEndingChatSession, 
        interactionMode 
    } = await request.json();

    if (!interactionMode || (interactionMode !== 'quickCommand' && interactionMode !== 'chatSession')) {
        return NextResponse.json({ message: 'Valid interactionMode is required.' }, { status: 400 });
    }

    // Relaxed validation: parts can be empty for initial chat greeting or session ending
    if (!isEndingChatSession && (!parts || (parts as Part[]).length === 0) && interactionMode === 'quickCommand') {
        return NextResponse.json({ message: 'Input parts are required for quick commands.' }, { status: 400 });
    }
    // currentCategory is needed if parts are present and not ending session
    if (!currentCategory && !isEndingChatSession && parts && (parts as Part[]).length > 0) {
        return NextResponse.json({ message: 'currentCategory is required when parts are provided.' }, { status: 400 });
    }


    const userProfile = await UserModel.findOne({ id: userId });
    const persistentUserContextSummary = userProfile?.userContextSummary || "";

    if (isEndingChatSession && chatHistory && Array.isArray(chatHistory)) {
        const sessionTranscript = chatHistory as Content[];
        const newSummary = (sessionTranscript.length > 0) 
            ? await generateUserContextSummary(sessionTranscript, persistentUserContextSummary)
            : persistentUserContextSummary; 

        if (userProfile) {
            if (newSummary !== undefined && newSummary !== persistentUserContextSummary) {
                userProfile.userContextSummary = newSummary; 
                if(persistentUserContextSummary && newSummary === "") {
                    userProfile.markModified('userContextSummary');
                }
                const MAX_CONTEXT_LENGTH = 10000; 
                if (userProfile.userContextSummary.length > MAX_CONTEXT_LENGTH) {
                    console.warn(`[AI API] User context summary for ${userId} exceeded ${MAX_CONTEXT_LENGTH} chars and was truncated.`);
                    userProfile.userContextSummary = userProfile.userContextSummary.slice(-MAX_CONTEXT_LENGTH);
                }
                
                try {
                    console.log(`[AI API] Attempting to save user context for user ${userId}. New summary length: ${newSummary.length}. Old summary length: ${persistentUserContextSummary.length}`);
                    await userProfile.save();
                    const updatedProfileCheck = await UserModel.findOne({ id: userId }).select('userContextSummary');
                    if (updatedProfileCheck) {
                        const dbSummary = updatedProfileCheck.userContextSummary || "";
                        console.log(`[AI API] Verification fetch - DB summary after save: "${dbSummary.substring(0, 100)}..."`);
                        if (dbSummary === newSummary) { console.log(`[AI API] SUCCESSFULLY SAVED new summary for user ${userId}.`); } 
                        else { console.error(`[AI API] DISCREPANCY: New summary NOT fully saved for user ${userId}. DB has: "${dbSummary.substring(0,100)}..." vs Proposed: "${newSummary.substring(0,100)}..."`); }
                    } else { console.error(`[AI API] Verification fetch FAILED for user ${userId} after save attempt.`); }
                    return NextResponse.json({ aiMessage: "Chat session concluded. User context updated.", operations: [] }, { status: 200 });
                } catch (saveError) {
                    console.error(`[AI API] Error saving user profile for user ${userId}:`, saveError);
                    return NextResponse.json({ aiMessage: "Chat session ended, but failed to save updated user context.", error: (saveError as Error).message, operations: [] }, { status: 500 });
                }
            } else {
                 console.log(`[AI API] User context for user ${userId} unchanged. No save needed.`);
                 return NextResponse.json({ aiMessage: "Chat session ended. User context remains unchanged.", operations: [] }, { status: 200 });
            }
        } else {
            console.error(`[AI API] User profile not found for ID ${userId} when trying to save context summary.`);
            return NextResponse.json({ aiMessage: "Chat session ended, but user profile not found to save context.", operations: [] }, { status: 404 });
        }
    }
    
    // If parts is empty here, it means it's an initial chat call (not ending session)
    const currentParts = (parts && (parts as Part[]).length > 0) ? parts as Part[] : [{text: ""}]; // Send empty text part if none, for initial greeting

    const geminiResult: ProcessedGeminiOutput = await processWithGemini(
        currentParts, 
        currentCategory as Category, // Should be valid if currentParts is not empty, or for initial chat
        ["All Projects", ...baseAvailableCategories],
        interactionMode as InteractionMode,
        persistentUserContextSummary,
        chatHistory as Content[] | undefined
    );

    if (geminiResult.overallError) {
      return NextResponse.json({ aiMessage: geminiResult.reply || geminiResult.overallError, operations: geminiResult.operations || [], error: geminiResult.overallError, executedOperationsLog: [] }, { status: 422 });
    }
    
    const executedOperationsInfo: ExecutedOperationInfo[] = [];
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
                    subTasks: (operation.payload.subTasks || []).map(st => ({ id: uuidv4(), text: st.text || '', completed: false })),
                    createdAt: new Date().toISOString(),
                    };
                    const createdTask = new TaskModel(newTaskData); await createdTask.save();
                    executedOperationsInfo.push({ type: 'Task Added', summary: itemSummary, success: true });
                    break;
                
                case 'updateTask':
                    let taskToUpdateId = operation.payload.taskIdToUpdate;
                    let taskInstance = null;
                    if (taskToUpdateId) { 
                        taskInstance = await TaskModel.findOne({ id: taskToUpdateId, userId: userId }); 
                    } else if (operation.payload.text) { 
                        const leanTask = await findTaskByName(userId, operation.payload.text, effectiveCategory as Category);
                        if (leanTask) {
                            taskToUpdateId = leanTask.id;
                            taskInstance = await TaskModel.findOne({ id: taskToUpdateId, userId: userId }); // Re-fetch non-lean
                        }
                    }

                    if (!taskInstance) throw new Error(`Task '${operation.payload.text || taskToUpdateId || 'Unknown'}' not found for update.`);
                    itemSummary = taskInstance.text.substring(0, 30);
                    let updated = false;
                    if (operation.payload.text !== undefined && operation.payload.text !== taskInstance.text) { taskInstance.text = operation.payload.text; updated = true; }
                    if (operation.payload.dueDate !== undefined) { taskInstance.dueDate = operation.payload.dueDate; updated = true; }
                    if (operation.payload.category !== undefined && operation.payload.category !== taskInstance.category) { taskInstance.category = operation.payload.category as Category; updated = true; }
                    if (operation.payload.completed !== undefined && operation.payload.completed !== taskInstance.completed) { taskInstance.completed = operation.payload.completed; updated = true; }
                    if (operation.payload.recurrenceRule !== undefined) { taskInstance.recurrenceRule = operation.payload.recurrenceRule; updated = true; }
                    
                    if (operation.payload.subTasksToAdd && operation.payload.subTasksToAdd.length > 0) {
                        const newSubTasksForExisting = operation.payload.subTasksToAdd.map(st => ({ id: uuidv4(), text: st.text || '', completed: st.completed || false }));
                        taskInstance.subTasks = [...(taskInstance.subTasks || []), ...newSubTasksForExisting];
                        updated = true;
                    }
                     if (operation.payload.subTasks !== undefined) { // This replaces all existing subtasks
                        taskInstance.subTasks = operation.payload.subTasks.map(st => ({ id: st.id || uuidv4(), text: st.text || '', completed: st.completed || false }));
                        updated = true;
                    }

                    if (updated) {
                        await taskInstance.save();
                    }
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
                    executedOperationsInfo.push({ type: 'Unknown Operation', summary: operation.error || 'Could not process.', success: false, error: operation.error });
                    break;
                }
            } catch (opError) {
                hasExecutionErrors = true;
                console.error(`Error executing AI operation ${operation.action}:`, opError);
                executedOperationsInfo.push({ type: operation.action, summary: itemSummary || 'Failed operation', success: false, error: (opError as Error).message });
            }
        }
    }
    
    let finalUserMessage = geminiResult.reply;
    if (executedOperationsInfo.some(op => op.success)) {
        const successfulOpsSummary = executedOperationsInfo.filter(op => op.success).map(op => `${op.type.replace(" Added", "")} '${op.summary.substring(0,20)}...'`).join(', ');
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
        operations: geminiResult.operations,
        executedOperationsLog: executedOperationsInfo,
        originalInputParts: geminiResult.originalInputParts
    }, { status: hasExecutionErrors && !executedOperationsInfo.some(i=>i.success && i.type !== 'Unknown Operation') ? 422 : 200 });

  } catch (error) {
    console.error('Error in AI command processing API:', error);
    return NextResponse.json({ aiMessage: 'Failed to process AI command.', error: (error as Error).message, operations:[], executedOperationsLog: [] }, { status: 500 });
  }
}
