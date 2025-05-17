import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig } from "@google/generative-ai";
import { Category, Task, Goal, Note, Event as AppEvent } from '@/types';
import { format, addDays, parseISO } from 'date-fns';

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
  responseMimeType: "application/json", // Ensure JSON output
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

function getTodaysDate() {
  return format(new Date(), 'yyyy-MM-dd');
}
function getTomorrowsDate() {
  return format(addDays(new Date(), 1), 'yyyy-MM-dd');
}


export interface GeminiResponse {
  action: "addTask" | "addNote" | "addGoal" | "addEvent" | "unknown";
  payload: Partial<Task | Note | Goal | AppEvent> & { text?: string; name?: string; title?: string; content?: string; targetValue?: number; unit?: string; date?: string; description?: string; category?: Category };
  originalCommand: string;
  error?: string;
}


export async function processWithGemini(
    command: string, 
    currentCategory: Category, 
    availableCategories: Category[]
): Promise<GeminiResponse> {
  const today = getTodaysDate();
  const tomorrow = getTomorrowsDate();

  const prompt = `
    You are AYANDA, an AI assistant that helps users manage tasks, notes, goals, and events.
    Analyze the user's command and convert it into a structured JSON object.
    Today's date is ${today}. Tomorrow's date is ${tomorrow}.

    The JSON object must have two fields: "action" and "payload".
    "action" can be one of: "addTask", "addNote", "addGoal", "addEvent", or "unknown".
    "payload" will contain the details.

    Available categories for items are: ${availableCategories.join(", ")}.
    If the user specifies a category, use it. If not, and the command implies a category (e.g. "work meeting", "personal reminder"), try to infer it.
    If no category is specified or can be reasonably inferred, use the current category: "${currentCategory}". If currentCategory is "All Projects", try to pick a more specific one from the available list, or use the first available specific category if unsure.

    For "addTask":
    - "text": (string, required) The task description.
    - "dueDate": (string, optional, YYYY-MM-DD format) Infer date if mentioned (e.g., "tomorrow", "next Monday", "Oct 28").
    - "category": (string, required) The category for the task.

    For "addNote":
    - "title": (string, optional) A title for the note. If not obvious, can be omitted or generated (e.g. "Note about X").
    - "content": (string, required) The content of the note.
    - "category": (string, required) The category for the note.

    For "addGoal":
    - "name": (string, required) The name of the goal.
    - "targetValue": (number, required) The target value of the goal. If not specified, assume 100 if unit is '%', otherwise try to infer a sensible default or ask.
    - "unit": (string, required) The unit for the goal (e.g., "km", "%", "tasks"). Infer if possible (e.g. "read 5 books" unit is "books").
    - "currentValue": (number, defaults to 0) The current progress.
    - "category": (string, required) The category for the goal.

    For "addEvent":
    - "title": (string, required) The title of the event.
    - "date": (string, required, ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ, or at least YYYY-MM-DDTHH:mm) The date and time of the event. Infer from "tomorrow at 3pm", "Oct 28 10:00". If only date is given, default time to 12:00 PM.
    - "description": (string, optional) Description of the event.
    - "category": (string, required) The category for the event.

    If the command is unclear or crucial information is missing for the identified action, set action to "unknown" and provide a brief explanation in the payload like {"error": "Could not determine XYZ"}.
    Focus on extracting the core information. Be concise.

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
    const parsedResponse = JSON.parse(responseText) as Omit<GeminiResponse, 'originalCommand'>;
    
    // Post-process category if Gemini defaults to "All Projects" incorrectly
    if (parsedResponse.payload && parsedResponse.payload.category === "All Projects" && currentCategory !== "All Projects" && availableCategories.includes(currentCategory)) {
        parsedResponse.payload.category = currentCategory;
    } else if (parsedResponse.payload && parsedResponse.payload.category === "All Projects" && availableCategories.length > 1 && availableCategories[1] !== "All Projects") {
        // If Gemini chose "All Projects" and a more specific one is better
        const firstSpecificCategory = availableCategories.find(cat => cat !== "All Projects");
        if (firstSpecificCategory) {
            parsedResponse.payload.category = firstSpecificCategory;
        }
    }


    // Ensure dueDate for tasks is YYYY-MM-DD if provided, otherwise undefined.
    if (parsedResponse.action === "addTask" && parsedResponse.payload.dueDate) {
        try {
            // Attempt to parse and reformat. This handles various date strings Gemini might produce.
            const parsedDate = parseISO(parsedResponse.payload.dueDate as string); // Try ISO first
            parsedResponse.payload.dueDate = format(parsedDate, 'yyyy-MM-dd');
        } catch (e) {
            // If parsing fails, it might be already YYYY-MM-DD or an invalid date from Gemini
            // Basic check for YYYY-MM-DD format
            if (!/^\d{4}-\d{2}-\d{2}$/.test(parsedResponse.payload.dueDate as string)) {
                 console.warn("Gemini returned an unparseable dueDate:", parsedResponse.payload.dueDate);
                 // delete parsedResponse.payload.dueDate; // Or set to undefined
            }
        }
    }
    // Ensure date for events is ISO string if provided.
     if (parsedResponse.action === "addEvent" && parsedResponse.payload.date) {
        try {
            const parsedDate = parseISO(parsedResponse.payload.date as string);
            parsedResponse.payload.date = parsedDate.toISOString();
        } catch (e) {
            console.warn("Gemini returned an unparseable event date:", parsedResponse.payload.date);
             // delete parsedResponse.payload.date; // Or set to undefined
        }
    }


    return { ...parsedResponse, originalCommand: command };

  } catch (error) {
    console.error("Error processing with Gemini:", error);
    return {
      action: "unknown",
      payload: { error: `Gemini API error: ${(error as Error).message}` },
      originalCommand: command,
    };
  }
}
