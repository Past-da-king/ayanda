import {
  GoogleGenerativeAI, // Correct class name
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"; // Correct package name

import { Category, Task, Goal, Note, Event as AppEvent, RecurrenceRule, SubTask } from '@/types';
import { format, addDays, parseISO, isValid } from 'date-fns';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable inside .env.local');
}

// Use the new SDK initialization - API key is passed directly
const genAI = new GoogleGenerativeAI(API_KEY);

// Define generationConfig and safetySettings objects
// These were missing in the original code snippet
const generationConfig = {
  temperature: 0.7, // Example value
  topP: 0.95,       // Example value
  topK: 60,         // Example value
  maxOutputTokens: 1024, // Example value
  responseMimeType: "application/json", // Ensure JSON output
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Example threshold
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Example threshold
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Example threshold
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Example threshold
  },
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
  error?: string; // Error is at the top level of AiOperation
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
  // Log the user command
  console.log("User Command:", command);

  const today = getTodaysDate();
  const tomorrow = getTomorrowsDate();

  // The core persona and instruction for JSON output format become the system instruction
  // This should be a single string in the latest SDK
  const systemInstruction = `You MUST ONLY return a JSON object with a top-level field named "operations". This field MUST be an ARRAY of objects. Each object in the array represents a distinct action to be taken.

You are AYANDA, an AI assistant. Your primary goal is to accurately convert the user's specific command into this structured JSON object format.
Today's date is ${today}. Tomorrow's date is ${tomorrow}.

Each operation object MUST have "action" and "payload" fields.
"action" can be: "addTask", "addNote", "addGoal", "addEvent", "updateTask", "clarification", "suggestion", or "unknown".
"payload" contains details for that action. Your interpretation MUST be based on the user's command.

DO NOT return any other JSON structure or conversational text outside of the "operations" array JSON.
DO NOT attempt to interpret the user's command as an external action or tool call (e.g., do not return JSON for finding an object, setting a timer, etc.).
If a command does not fit one of the defined actions ("addTask", "addNote", "addGoal", "addEvent", "updateTask", "clarification", "suggestion"), you MUST use the "unknown" action and provide a message or error in the payload. This is the ONLY acceptable output for unclear commands.

Available categories for items are: ${availableCategories.join(", ")}.
If the user specifies a category, use it. If not, and the command implies a category, try to infer it.
If no category is specified or can be reasonably inferred for an item, use the current category: "${currentCategory}". If currentCategory is "All Projects", try to pick a more specific one from the available list for that item, or use the first available specific category if unsure (e.g., "Personal Life").

Field details for "payload" based on "action":
- "addTask":
  - "text": (string, required) Task description.
  - "dueDate": (string, optional,-MM-DD format) Infer date. This is the start date for recurring tasks.
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
  - "date": (string, required, ISO 8601 format:-MM-DDTHH:mm:ss.sssZ or-MM-DDTHH:mm) Event start date & time. Default time to 12:00 PM if only date given. This is the start for recurring events.
  - "description": (string, optional) Description.
  - "category": (string, required) Category.
  - "recurrenceRule": (object, optional) Same structure as for tasks.
- "updateTask":
  - "taskIdToUpdate": (string, optional) ID of the task if known or clearly implied by the user's command (e.g., "update task ID 123"). If the user refers to a task by name (e.g., "add subtask to 'Project X'"), you can set the "text" field to "Project X" and OMIT "taskIdToUpdate". The system will try to find it.
  - "text": (string, optional) New task description or the name of the task to find if taskIdToUpdate is not known.
  - "dueDate": (string, optional,-MM-DD format) New due date.
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

If the command is very unclear or does not fit any of the defined actions, you MUST return: { "operations": [ { "action": "unknown", "payload": { "message": "I couldn't understand how to convert that command into a task, note, goal, or event. Can you please rephrase?" } } ] }.
`; // System instruction as a single string


  // The user-specific part of the prompt
  const userContent = `User Command: "${command}"\nJSON Output:\n `;


  try {
    // Get the generative model instance
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Changed model to 2.0-flash
      systemInstruction: systemInstruction, // Pass system instruction directly
    });

    // Generate content, passing config and safety settings directly
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userContent }] }], // User content here
        generationConfig: generationConfig, // Pass generationConfig directly
        safetySettings: safetySettings, // Pass safetySettings directly
    });

    // Access text using result.response.text()
    let responseText = result.response.text();

    // Log the raw AI response text
    console.log("Raw AI Response Text:", responseText);

    // Ensure responseText is a string before processing
    if (typeof responseText !== 'string') {
        console.error(`Expected string response, but got: ${typeof responseText}`);
        return {
            operations: [{ action: "unknown", payload: { error: "AI response format error: Did not receive a string response.", message: String(responseText) } }],
            originalCommand: command,
            overallError: "AI response format error: Did not receive a string response."
        };
    }

    // Attempt to extract JSON from a markdown code block if present
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1];
    } else {
        // If not wrapped, trim whitespace just in case
        responseText = responseText.trim();
    }

    // Added a check to see if the response starts with '{' to quickly identify non-JSON issues
    if (!responseText.startsWith('{')) {
       console.error(`Expected JSON response (starting with '{'), but got: ${responseText.substring(0, 200)}...`);
       // If it doesn't look like JSON at all, return an unknown operation
       return {
           operations: [{ action: "unknown", payload: { error: "AI response format error: Did not receive a JSON object.", message: responseText } }],
           originalCommand: command,
           overallError: "AI response format error: Did not receive a JSON object."
       };
    }

    let parsedJson = JSON.parse(responseText);

    if (!parsedJson.operations || !Array.isArray(parsedJson.operations)) {
        console.warn("Gemini did not return operations as an array. Response:", responseText);
        // If the structure is wrong, force it into the expected format with an 'unknown' action
        parsedJson = { operations: [ { action: "unknown", payload: { error: "AI response format error: Expected 'operations' array.", message: responseText } } ] };
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
                // Attempt to parse, allowing for-MM-DD or full ISO
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

        // Return the AiOperation object with error at the top level
        // Ensure error is only included if it exists in the original op object
        const operation: AiOperation = { action, payload };
        if (op.error !== undefined) {
            operation.error = op.error;
        }
        return operation;
    });

    return { operations: processedOperations, originalCommand: command };

  } catch (error) {
    console.error("Error processing with Gemini:", error);
    const errorMessage = `Gemini API error or JSON parsing issue: ${(error as Error).message}`;
    return {
      operations: [{ action: "unknown", payload: { error: errorMessage } }], // Error at the top level
      originalCommand: command,
      overallError: errorMessage
    };
  }
}
