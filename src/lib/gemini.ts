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

