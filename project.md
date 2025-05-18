
## src/lib/gemini.ts
```typescript
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig } from "@google/generative-ai";
import { Category, Task, Goal, Note, Event as AppEvent, RecurrenceRule, SubTask } from '@/types';
import { format, addDays, parseISO, isValid } from 'date-fns';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable inside .env.local');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

const generationConfig: GenerationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

function getTodaysDate() { return format(new Date(), 'yyyy-MM-dd'); }
function getTomorrowsDate() { return format(addDays(new Date(), 1), 'yyyy-MM-dd'); }

export interface AiOperation {
  action: "addTask" | "addNote" | "addGoal" | "addEvent" | "updateTask" | "unknown" | "clarification" | "suggestion";
  payload: Partial<Task & Note & Goal & AppEvent & { 
    taskIdToUpdate?: string; // For updateTask action
    text?: string; name?: string; title?: string; content?: string; // Basic fields
    targetValue?: number; unit?: string; // Goal specific
    date?: string; description?: string; // Event specific
    dueDate?: string; // Task specific
    category?: Category; 
    message?: string; // For clarification/suggestion
    recurrenceRule?: RecurrenceRule;
    subTasks?: { text: string }[]; // For creating tasks with subtasks
    subTasksToAdd?: { text: string }[]; // For adding subtasks to an existing task
    subTasksToRemove?: string[]; // IDs of subtasks to remove
    subTasksToUpdate?: { id: string; text?: string; completed?: boolean }[]; // For updating existing subtasks
  }>;
  error?: string;
}

export interface GeminiProcessedResponse {
  operations: AiOperation[];
  originalCommand: string;
  overallError?: string;
}

export async function processWithGemini(
    command: string, 
    currentCategory: Category, 
    availableCategories: Category[]
): Promise<GeminiProcessedResponse> {
  const today = getTodaysDate();
  const tomorrow = getTomorrowsDate();

  const prompt = `
    You are AYANDA, an AI assistant. Your primary goal is to accurately convert the user's specific command into a structured JSON object.
    Today's date is ${today}. Tomorrow's date is ${tomorrow}.

    The JSON object MUST have a field "operations" which is an ARRAY of objects. Each object in the array represents a distinct action to be taken.
    Each operation object must have "action" and "payload" fields.
    "action" can be: "addTask", "addNote", "addGoal", "addEvent", "updateTask", "clarification", "suggestion", or "unknown".
    "payload" contains details for that action. Your interpretation MUST be based on the user's command.

    Available categories for items are: ${availableCategories.join(", ")}.
    If the user specifies a category, use it. If not, and the command implies a category, try to infer it.
    If no category is specified or can be reasonably inferred for an item, use the current category: "${currentCategory}". If currentCategory is "All Projects", try to pick a more specific one from the available list for that item, or use the first available specific category if unsure (e.g., "Personal Life").

    Field details for "payload" based on "action":
    - "addTask":
      - "text": (string, required) Task description.
      - "dueDate": (string, optional, YYYY-MM-DD format) Infer date. This is the start date for recurring tasks.
      - "category": (string, required) Category.
      - "subTasks": (array of objects, optional) For creating subtasks with a NEW task. Each object: { "text": "subtask description" }.
      - "recurrenceRule": (object, optional) With "type" ('daily', 'weekly', 'monthly', 'yearly'), "interval" (number), and optional "daysOfWeek" (array of numbers 0-6 for weekly), "dayOfMonth" (number for monthly), "endDate" (YYYY-MM-DD), "count" (number).
    - "addNote":
      - "title": (string, optional) Note title.
      - "content": (string, required) Note content. Can include Markdown.
      - "category": (string, required) Category.
    - "addGoal":
      - "name": (string, required) Goal name.
      - "targetValue": (number, required) Target.
      - "unit": (string, required) Unit.
      - "currentValue": (number, defaults to 0) Current progress.
      - "category": (string, required) Category.
    - "addEvent":
      - "title": (string, required) Event title.
      - "date": (string, required, ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DDTHH:mm) Event start date & time. Default time to 12:00 PM if only date given. This is the start for recurring events.
      - "description": (string, optional) Description.
      - "category": (string, required) Category.
      - "recurrenceRule": (object, optional) Same structure as for tasks.
    - "updateTask":
      - "taskIdToUpdate": (string, optional) ID of the task if known or clearly implied by the user's command (e.g., "update task ID 123"). If the user refers to a task by name (e.g., "add subtask to 'Project X'"), you can set the "text" field to "Project X" and OMIT "taskIdToUpdate". The system will try to find it.
      - "text": (string, optional) New task description or the name of the task to find if taskIdToUpdate is not known.
      - "dueDate": (string, optional, YYYY-MM-DD format) New due date.
      - "category": (string, optional) New category.
      - "completed": (boolean, optional) New completion status.
      - "subTasksToAdd": (array of objects, optional) For ADDING subtasks to an EXISTING task. Each object: { "text": "subtask description" }.
      - "recurrenceRule": (object, optional) New or updated recurrence rule.
    - "clarification" or "suggestion":
      - "message": (string, required) Message to display.
    - "unknown":
      - "error": (string, optional) Brief explanation.
      - "message": (string, optional) General message.

    Infer recurrence from phrases like "every day", "weekly on Tuesdays", "monthly on the 15th", "every 2 weeks".
    For weekly recurrence, "daysOfWeek" should be an array of numbers (Sunday=0, Monday=1, ..., Saturday=6).
    
    Example 1 (New task with subtasks): User says "Create a task to organize my study notes with subtasks: review lecture 1, summarize chapter 2, create flashcards for key terms."
    JSON Output:
    {
      "operations": [
        { 
          "action": "addTask", 
          "payload": { 
            "text": "Organize my study notes", 
            "category": "Studies", 
            "subTasks": [ 
              { "text": "review lecture 1" }, 
              { "text": "summarize chapter 2" }, 
              { "text": "create flashcards for key terms" } 
            ] 
          } 
        }
      ]
    }

    Example 2 (Add subtasks to an existing task named 'Client Presentation'): User says "Add subtasks to 'Client Presentation': final run-through and check equipment."
    JSON Output:
    {
      "operations": [
        { 
          "action": "updateTask", 
          "payload": { 
            "text": "Client Presentation", // Task name to find
            "subTasksToAdd": [ 
              { "text": "final run-through" }, 
              { "text": "check equipment" } 
            ] 
          } 
        }
      ]
    }

    Example 3 (Simple task): User says "remind me to call John tomorrow at 2 PM about the project"
    JSON Output:
    {
        "operations": [
            {
                "action": "addEvent",
                "payload": {
                    "title": "Call John about the project",
                    "date": "${tomorrow}T14:00:00.000Z",
                    "category": "${currentCategory === "All Projects" ? "Personal Life" : currentCategory}"
                }
            }
        ]
    }

    If the command is very unclear, return: { "operations": [ { "action": "unknown", "payload": { "error": "Could not understand the request." } } ] }.
    Focus on the user's intent.

    User Command: "${command}"
    JSON Output:
  `;

  try {
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
    });
    const responseText = result.response.text();
    let parsedJson = JSON.parse(responseText);

    if (!parsedJson.operations || !Array.isArray(parsedJson.operations)) {
        console.warn("Gemini did not return operations as an array. Response:", responseText);
        parsedJson = { operations: [ { action: "unknown", payload: { error: "AI response format error." } } ] };
    }
    
    const processedOperations: AiOperation[] = parsedJson.operations.map((op: any) => {
        let { action, payload } = op;
        if (!payload) payload = {};

        // Post-process category: Ensure a specific category is assigned if "All Projects" was the context
        if ((payload.category === "All Projects" || !payload.category) && 
            action !== 'clarification' && action !== 'suggestion' && action !== 'unknown') {
            
            if (currentCategory !== "All Projects" && availableCategories.includes(currentCategory)) {
                payload.category = currentCategory;
            } else {
                // If currentCategory is "All Projects" or not in available, pick first specific one
                const firstSpecificCategory = availableCategories.find(cat => cat !== "All Projects");
                payload.category = firstSpecificCategory || (availableCategories.length > 0 && availableCategories[0] !== "All Projects" ? availableCategories[0] : "Personal Life"); // Final fallback
            }
        }
        
        // Validate/format dates
        if ((action === "addTask" || action === "updateTask") && payload.dueDate) {
            try {
                const parsedDate = parseISO(payload.dueDate as string);
                payload.dueDate = isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : undefined;
            } catch (e) { payload.dueDate = undefined; }
        }
        if (action === "addEvent" && payload.date) {
            try {
                // Attempt to parse, allowing for YYYY-MM-DD or full ISO
                let parsedEventDate = parseISO(payload.date as string);
                if (!isValid(parsedEventDate) && (payload.date as string).match(/^\d{4}-\d{2}-\d{2}$/)) {
                    // If it's just a date, append a default time (e.g., noon) before parsing
                    parsedEventDate = parseISO(`${payload.date}T12:00:00.000Z`);
                }
                payload.date = isValid(parsedEventDate) ? parsedEventDate.toISOString() : undefined;
            } catch (e) { payload.date = undefined; }
        }
        // Validate recurrenceRule dates
        if (payload.recurrenceRule?.endDate) {
            try {
                const parsedEndDate = parseISO(payload.recurrenceRule.endDate as string);
                payload.recurrenceRule.endDate = isValid(parsedEndDate) ? format(parsedEndDate, 'yyyy-MM-dd') : undefined;
            } catch (e) { if (payload.recurrenceRule) payload.recurrenceRule.endDate = undefined; }
        }

        return { action, payload, error: op.error };
    });

    return { operations: processedOperations, originalCommand: command };

  } catch (error) {
    console.error("Error processing with Gemini:", error);
    const errorMessage = `Gemini API error or JSON parsing issue: ${(error as Error).message}`;
    return {
      operations: [{ action: "unknown", payload: { error: errorMessage } }],
      originalCommand: command,
      overallError: errorMessage
    };
  }
}

```
## src/app/api/ai/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { processWithGemini, GeminiProcessedResponse, AiOperation } from '@/lib/gemini';
import { Category, Task, Note, Goal, Event as AppEvent, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import NoteModel from '@/models/NoteModel';
import GoalModel from '@/models/GoalModel';
import EventModel from '@/models/EventModel';
import { getToken } from 'next-auth/jwt';

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];

async function findTaskByName(userId: string, taskName: string, category?: Category): Promise<Task | null> {
    const query: any = { userId, text: { $regex: `^${taskName}$`, $options: 'i' } }; // Case-insensitive exact match
    if (category && category !== "All Projects") {
        query.category = category;
    }
    return TaskModel.findOne(query).lean(); // .lean() for plain JS object
}


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
      const payloadCategory = operation.payload.category;
      const effectiveCategory = (payloadCategory === "All Projects" && baseAvailableCategories.length > 0) 
                                ? baseAvailableCategories[0] 
                                : payloadCategory || currentCategory; 
      let itemSummary = "";

      try {
        switch (operation.action) {
          case 'addTask':
            if (!operation.payload.text) throw new Error('Task text is missing.');
            itemSummary = operation.payload.text.substring(0, 30);
            const newTaskData: Task = {
              id: uuidv4(),
              userId: userId,
              text: operation.payload.text!,
              completed: false,
              dueDate: operation.payload.dueDate as string | undefined,
              category: effectiveCategory as Category,
              recurrenceRule: operation.payload.recurrenceRule,
              subTasks: (operation.payload.subTasks || []).map(st => ({ id: uuidv4(), text: st.text, completed: false })),
              createdAt: new Date().toISOString(),
            };
            const createdTask = new TaskModel(newTaskData);
            await createdTask.save();
            createdItemsInfo.push({ type: 'Task', summary: itemSummary, success: true });
            break;
          
          case 'updateTask':
            let taskToUpdateId = operation.payload.taskIdToUpdate;
            let taskInstance = null;

            if (taskToUpdateId) {
                taskInstance = await TaskModel.findOne({ id: taskToUpdateId, userId: userId });
            } else if (operation.payload.text) { // AI provided task name instead of ID
                taskInstance = await findTaskByName(userId, operation.payload.text, effectiveCategory as Category);
                if (taskInstance) {
                    taskToUpdateId = taskInstance.id; // Found the ID
                }
            }

            if (!taskInstance) {
                throw new Error(`Task '${operation.payload.text || taskToUpdateId || 'Unknown'}' not found or you are not authorized.`);
            }
            
            itemSummary = taskInstance.text.substring(0, 30);
            let updated = false;

            if (operation.payload.subTasksToAdd && operation.payload.subTasksToAdd.length > 0) {
                const newSubTasksForExisting = operation.payload.subTasksToAdd.map(st => ({ id: uuidv4(), text: st.text, completed: false }));
                taskInstance.subTasks = [...(taskInstance.subTasks || []), ...newSubTasksForExisting];
                updated = true;
            }
            // Handle other direct updates to the task if AI provides them
            if (operation.payload.text && operation.payload.text !== taskInstance.text) { // only update if text is different and not just used for lookup
                taskInstance.text = operation.payload.text;
                updated = true;
            }
            if (operation.payload.dueDate !== undefined) {
                taskInstance.dueDate = operation.payload.dueDate;
                updated = true;
            }
            if (operation.payload.category !== undefined && operation.payload.category !== taskInstance.category) {
                taskInstance.category = operation.payload.category as Category;
                updated = true;
            }
            if (operation.payload.completed !== undefined && operation.payload.completed !== taskInstance.completed) {
                taskInstance.completed = operation.payload.completed;
                updated = true;
            }
            if (operation.payload.recurrenceRule !== undefined) {
                taskInstance.recurrenceRule = operation.payload.recurrenceRule;
                updated = true;
            }
            
            if (updated) {
                await taskInstance.save();
                createdItemsInfo.push({ type: 'Task Updated', summary: itemSummary, success: true });
            } else {
                 createdItemsInfo.push({ type: 'Task Update', summary: itemSummary, success: true, error: "No changes applied to task." });
            }
            break;

          case 'addNote':
            if (!operation.payload.content) throw new Error('Note content is missing.');
            itemSummary = operation.payload.title || operation.payload.content.substring(0, 30);
            const newNoteData: Note = {
              id: uuidv4(),
              userId: userId, 
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
              userId: userId, 
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
                userId: userId, 
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
              if (geminiResult.operations.length === 1) { // If this is the *only* operation
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
        console.error(`Error during AI operation ${operation.action}:`, opError);
        createdItemsInfo.push({ type: operation.action, summary: itemSummary || 'Failed operation', success: false, error: (opError as Error).message });
      }
    }

    let responseMessage = "";
    if (createdItemsInfo.some(item => item.success && item.type !== 'clarification' && item.type !== 'suggestion')) {
        const successfulActions = createdItemsInfo.filter(item => item.success && item.type !== 'clarification' && item.type !== 'suggestion');
        responseMessage = successfulActions.map(s => `${s.type} "${s.summary}..." processed`).join('. ') + ". ";
    }
    
    if (aiMessageForCard) { // If there's a specific clarification/suggestion message from a dedicated operation
        responseMessage = aiMessageForCard; // This message takes precedence if it's the only "successful" thing
    }
    
    if (createdItemsInfo.some(item => !item.success)) {
        const failures = createdItemsInfo.filter(item => !item.success);
        responseMessage += (responseMessage ? " " : "") + "Some operations failed: " + failures.map(f => `${f.type} (${f.error || 'Unknown error'})`).join('. ') + ".";
        hasErrors = true; // Ensure hasErrors is true if any operation failed
    }
    
    if (responseMessage.trim() === "") {
        responseMessage = hasErrors ? "There were issues processing your command." : "Command received, but no specific actions were taken.";
    }

    return NextResponse.json({ 
        message: responseMessage.trim(), 
        details: createdItemsInfo, 
        originalCommand: command 
    }, { status: hasErrors && !createdItemsInfo.some(i=>i.success) ? 422 : 200 }); // 422 if all ops failed or only unknown/error ops

  } catch (error) {
    console.error('Error in AI command processing API:', error);
    return NextResponse.json({ message: 'Failed to process AI command.', error: (error as Error).message }, { status: 500 });
  }
}


```