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
  action: "addTask" | "addNote" | "addGoal" | "addEvent" | "unknown" | "clarification" | "suggestion";
  payload: Partial<Task & Note & Goal & AppEvent & { 
    text?: string; name?: string; title?: string; content?: string; // Basic fields
    targetValue?: number; unit?: string; // Goal specific
    date?: string; description?: string; // Event specific
    dueDate?: string; // Task specific
    category?: Category; 
    message?: string; // For clarification/suggestion
    recurrenceRule?: RecurrenceRule; // New
    subTasks?: { text: string }[]; // New: text for subtasks, IDs will be generated later
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
    You are AYANDA, an AI assistant. Analyze the user's command and convert it into a structured JSON object.
    Today's date is ${today}. Tomorrow's date is ${tomorrow}.

    The JSON object MUST have a field "operations" which is an ARRAY of objects. Each object in the array represents a distinct action to be taken.
    Each operation object must have "action" and "payload" fields.
    "action" can be: "addTask", "addNote", "addGoal", "addEvent", "clarification", "suggestion", or "unknown".
    "payload" contains details for that action.

    Available categories for items are: ${availableCategories.join(", ")}.
    If the user specifies a category, use it. If not, and the command implies a category, try to infer it.
    If no category is specified or can be reasonably inferred for an item, use the current category: "${currentCategory}". If currentCategory is "All Projects", try to pick a more specific one from the available list for that item, or use the first available specific category if unsure.

    Field details for "payload" based on "action":
    - "addTask":
      - "text": (string, required) Task description.
      - "dueDate": (string, optional, YYYY-MM-DD format) Infer date. This is the start date for recurring tasks.
      - "category": (string, required) Category.
      - "subTasks": (array of objects, optional) Each object: { "text": "subtask description" }.
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
    - "clarification" or "suggestion":
      - "message": (string, required) Message to display.
    - "unknown":
      - "error": (string, optional) Brief explanation.
      - "message": (string, optional) General message.

    Infer recurrence from phrases like "every day", "weekly on Tuesdays", "monthly on the 15th", "every 2 weeks".
    For weekly recurrence, "daysOfWeek" should be an array of numbers (Sunday=0, Monday=1, ..., Saturday=6).
    Example: "add task to prepare slides for work due next Friday, recurring weekly"
    {
      "operations": [
        { "action": "addTask", "payload": { "text": "prepare slides", "dueDate": "YYYY-MM-DD (next Friday)", "category": "Work", "recurrenceRule": {"type": "weekly", "interval": 1, "daysOfWeek": [5] } } }
      ]
    }
    If the command is "task: read chapter 5 with subtasks: take notes, summarize section 1, review key terms", the subTasks array should be generated.
    If the command is very unclear, return: { "operations": [ { "action": "unknown", "payload": { "error": "Could not understand the request." } } ] }.

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

        // Post-process category
        if ((payload.category === "All Projects" || !payload.category) && action !== 'clarification' && action !== 'suggestion' && action !== 'unknown') {
            if (currentCategory !== "All Projects" && availableCategories.includes(currentCategory)) {
                payload.category = currentCategory;
            } else {
                const firstSpecificCategory = availableCategories.find(cat => cat !== "All Projects");
                payload.category = firstSpecificCategory || (availableCategories.length > 0 ? availableCategories[0] : "Personal Life"); // Fallback
            }
        }
        
        // Validate/format dates
        if (action === "addTask" && payload.dueDate) {
            try {
                const parsedDate = parseISO(payload.dueDate as string);
                payload.dueDate = isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : undefined;
            } catch (e) { payload.dueDate = undefined; }
        }
        if (action === "addEvent" && payload.date) {
            try {
                const parsedEventDate = parseISO(payload.date as string);
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
