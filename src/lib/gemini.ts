import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Part, // Import Part type
  GenerateContentRequest,
} from "@google/generative-ai"; 

import { Category, Task, Goal, Note, Event as AppEvent, RecurrenceRule, SubTask } from '@/types';
import { format, addDays, parseISO, isValid } from 'date-fns';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable inside .env.local');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 60,
  maxOutputTokens: 2048, // Increased slightly for potentially complex JSON from audio
  responseMimeType: "application/json",
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE, },
];


function getTodaysDate() { return format(new Date(), 'yyyy-MM-dd'); }
function getTomorrowsDate() { return format(addDays(new Date(), 1), 'yyyy-MM-dd'); }

export interface AiOperation {
  action: "addTask" | "addNote" | "addGoal" | "addEvent" | "updateTask" | "unknown" | "clarification" | "suggestion";
  payload: Partial<Task & Note & Goal & AppEvent & {
    taskIdToUpdate?: string; 
    text?: string; name?: string; title?: string; content?: string; 
    targetValue?: number; unit?: string; 
    date?: string; description?: string; 
    dueDate?: string; 
    category?: Category;
    message?: string; 
    recurrenceRule?: RecurrenceRule;
    subTasks?: { text: string }[]; 
    subTasksToAdd?: { text: string }[]; 
    subTasksToRemove?: string[]; 
    subTasksToUpdate?: { id: string; text?: string; completed?: boolean }[]; 
  }>;
  error?: string; 
}

export interface GeminiProcessedResponse {
  operations: AiOperation[];
  originalInput: Part[]; // Changed from originalCommand to originalInput
  overallError?: string;
}

// Modified to accept Part[] for multimodal input
export async function processWithGemini(
    inputParts: Part[], // Now accepts an array of Parts (text, audio, etc.)
    currentCategory: Category,
    availableCategories: Category[]
): Promise<GeminiProcessedResponse> {
  console.log("Input Parts to Gemini:", JSON.stringify(inputParts, null, 2));

  const today = getTodaysDate();
  const tomorrow = getTomorrowsDate();

  const systemInstructionText = `You MUST ONLY return a JSON object with a top-level field named "operations". This field MUST be an ARRAY of objects. Each object in the array represents a distinct action to be taken.

You are AYANDA, an AI assistant. Your primary goal is to accurately convert the user's input (which could be text, audio, or a combination) into this structured JSON object format.
Today's date is ${today}. Tomorrow's date is ${tomorrow}.

Each operation object MUST have "action" and "payload" fields.
"action" can be: "addTask", "addNote", "addGoal", "addEvent", "updateTask", "clarification", "suggestion", or "unknown".
"payload" contains details for that action. Your interpretation MUST be based on the user's input.

If the input includes audio, understand the speech from the audio to determine the user's intent.
DO NOT return any other JSON structure or conversational text outside of the "operations" array JSON.
DO NOT attempt to interpret the user's command as an external action or tool call.
If input does not fit defined actions, you MUST use "unknown" action with a message/error in payload. This is the ONLY acceptable output for unclear commands.

Available categories for items are: ${availableCategories.join(", ")}.
If the user specifies a category (in text or speech), use it. If not, and the command implies a category, try to infer it.
If no category is specified or can be reasonably inferred for an item, use the current category: "${currentCategory}". If currentCategory is "All Projects", try to pick a more specific one from the available list for that item, or use the first available specific category if unsure (e.g., "Personal Life").

Field details for "payload" (same as before, ensure all types are handled, especially dates).
Example "addEvent" with date and time: { "title": "Meeting with Team", "date": "YYYY-MM-DDTHH:mm:00.000Z" ... }
If only date given, default time to 12:00 PM. If only time, assume today's date.

If the input is audio and it's unclear, or not a command, use "clarification" or "unknown" action.
For example, if audio is just "hello", respond with { "operations": [ { "action": "clarification", "payload": { "message": "Hello! How can I help you today?" } } ] }.
If audio is background noise, use { "operations": [ { "action": "unknown", "payload": { "message": "I couldn't understand the audio. Please try again." } } ] }.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const request: GenerateContentRequest = {
        contents: [{ role: "user", parts: inputParts }],
        generationConfig: generationConfig,
        safetySettings: safetySettings,
        systemInstruction: { role: "system", parts: [{ text: systemInstructionText }] } 
        // Using object structure for systemInstruction as it's more robust.
        // Some SDK versions might allow string directly. If `parts: [{text...}]` causes issues,
        // can try `systemInstruction: systemInstructionText` directly.
    };
    
    const result = await model.generateContent(request);
    let responseText = result.response.text();

    console.log("Raw AI Response Text:", responseText);

    if (typeof responseText !== 'string') {
        console.error(`Expected string response, but got: ${typeof responseText}`);
        return {
            operations: [{ action: "unknown", payload: { error: "AI response format error: Did not receive a string response.", message: String(responseText) } }],
            originalInput: inputParts,
            overallError: "AI response format error: Did not receive a string response."
        };
    }

    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1];
    } else {
        responseText = responseText.trim();
    }

    if (!responseText.startsWith('{')) {
       console.error(`Expected JSON response (starting with '{'), but got: ${responseText.substring(0, 200)}...`);
       return {
           operations: [{ action: "unknown", payload: { error: "AI response format error: Did not receive a JSON object.", message: responseText } }],
           originalInput: inputParts,
           overallError: "AI response format error: Did not receive a JSON object."
       };
    }

    let parsedJson = JSON.parse(responseText);

    if (!parsedJson.operations || !Array.isArray(parsedJson.operations)) {
        console.warn("Gemini did not return operations as an array. Response:", responseText);
        parsedJson = { operations: [ { action: "unknown", payload: { error: "AI response format error: Expected 'operations' array.", message: responseText } } ] };
    }

    const processedOperations: AiOperation[] = parsedJson.operations.map((op: any) => {
        let { action, payload } = op;
        if (!payload) payload = {};

        if ((payload.category === "All Projects" || !payload.category) &&
            action !== 'clarification' && action !== 'suggestion' && action !== 'unknown') {
            if (currentCategory !== "All Projects" && availableCategories.includes(currentCategory)) {
                payload.category = currentCategory;
            } else {
                const firstSpecificCategory = availableCategories.find(cat => cat !== "All Projects");
                payload.category = firstSpecificCategory || (availableCategories.length > 0 && availableCategories[0] !== "All Projects" ? availableCategories[0] : "Personal Life");
            }
        }

        if ((action === "addTask" || action === "updateTask") && payload.dueDate) {
            try {
                const parsedDate = parseISO(payload.dueDate as string);
                payload.dueDate = isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : undefined;
            } catch (e) { payload.dueDate = undefined; }
        }
        if (action === "addEvent" && payload.date) {
            try {
                let parsedEventDate = parseISO(payload.date as string);
                if (!isValid(parsedEventDate) && (payload.date as string).match(/^\d{4}-\d{2}-\d{2}$/)) {
                    parsedEventDate = parseISO(`${payload.date}T12:00:00.000Z`);
                }
                payload.date = isValid(parsedEventDate) ? parsedEventDate.toISOString() : undefined;
            } catch (e) { payload.date = undefined; }
        }
        if (payload.recurrenceRule?.endDate) {
            try {
                const parsedEndDate = parseISO(payload.recurrenceRule.endDate as string);
                payload.recurrenceRule.endDate = isValid(parsedEndDate) ? format(parsedEndDate, 'yyyy-MM-dd') : undefined;
            } catch (e) { if (payload.recurrenceRule) payload.recurrenceRule.endDate = undefined; }
        }
        
        const operation: AiOperation = { action, payload };
        if (op.error !== undefined) {
            operation.error = op.error;
        }
        return operation;
    });

    return { operations: processedOperations, originalInput: inputParts };

  } catch (error) {
    console.error("Error processing with Gemini:", error);
    const errorMessage = `Gemini API error or JSON parsing issue: ${(error as Error).message}`;
    return {
      operations: [{ action: "unknown", payload: { error: errorMessage } }], 
      originalInput: inputParts,
      overallError: errorMessage
    };
  }
}
