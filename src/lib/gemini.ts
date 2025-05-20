import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Part,
  GenerateContentRequest,
  Content, 
} from "@google/generative-ai"; 

import { Category, Task, Goal, Note, Event as AppEvent, RecurrenceRule, SubTask } from '@/types';
import { format, addDays, parseISO, isValid } from 'date-fns';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable inside .env.local');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
  temperature: 0.6, // Slightly more deterministic for structured output
  topP: 0.95,
  topK: 60,
  maxOutputTokens: 2048,
  responseMimeType: "application/json", // AI must always respond with JSON
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE, },
];


function getTodaysDate() { return format(new Date(), 'yyyy-MM-dd'); }
function getTomorrowsDate() { return format(addDays(new Date(), 1), 'yyyy-MM-dd'); }

export type InteractionMode = 'quickCommand' | 'chatSession';

export interface AiOperation {
  action: "addTask" | "addNote" | "addGoal" | "addEvent" | "updateTask" | "unknown" | "clarification" | "suggestion"; // Clarification/suggestion are now more about the nature of the *operation* if any, not the top-level reply type.
  payload: Partial<Task & Note & Goal & AppEvent & {
    taskIdToUpdate?: string; 
    text?: string; name?: string; title?: string; content?: string; 
    targetValue?: number; unit?: string; 
    date?: string; description?: string; 
    dueDate?: string; 
    category?: Category;
    message?: string; // For clarification/suggestion payloads, or error messages in 'unknown'
    recurrenceRule?: RecurrenceRule;
    subTasks?: { text: string }[]; 
    subTasksToAdd?: { text: string }[]; 
    subTasksToRemove?: string[]; 
    subTasksToUpdate?: { id: string; text?: string; completed?: boolean }[]; 
  }>;
  error?: string; 
}

// This interface defines the expected JSON structure from Gemini
export interface GeminiApiResponse {
  reply: string; // Always present: the natural language response for the user
  operations: AiOperation[]; // Can be an empty array if no DB actions are intended
}


export interface ProcessedGeminiOutput {
  reply: string; // The user-facing text reply
  operations: AiOperation[]; // Parsed and validated operations
  originalInputParts: Part[];
  overallError?: string;
}

export async function processWithGemini(
    inputParts: Part[],
    currentCategory: Category,
    availableCategories: Category[],
    interactionMode: InteractionMode, // New parameter
    persistentUserContextSummary?: string,
    inSessionChatHistory?: Array<Content>
): Promise<ProcessedGeminiOutput> {
  
  const today = getTodaysDate();
  const tomorrow = getTomorrowsDate();

  let systemInstructionText = `You are AYANDA, an AI assistant. Your primary goal is to process user input and respond with a JSON object.
This JSON object MUST always have two top-level fields:
1.  "reply": A string containing your natural language conversational response to the user. This is ALWAYS required.
2.  "operations": An array of operation objects. This array can be empty if no specific database actions are being taken.

Today's date is ${today}. Tomorrow's date is ${tomorrow}.
Available categories for items are: ${availableCategories.join(", ")}.
If no category is specified or can be reasonably inferred for an item to be created/updated, use the current category: "${currentCategory}". If currentCategory is "All Projects", pick a specific one like "Personal Life" or the first available if more appropriate.

Each object in the "operations" array (if any) MUST have "action" and "payload" fields.
Valid "action" values are: "addTask", "addNote", "addGoal", "addEvent", "updateTask", "unknown".
(The "clarification" and "suggestion" actions are less common for the 'operations' array now, as the main 'reply' field handles conversational aspects. Use 'unknown' if an operation cannot be formed).
`;

  if (interactionMode === 'chatSession') {
    systemInstructionText += `
**Chat Session Mode Active:**
- Engage in a natural, multi-turn conversation. Use the provided chat history for context.
- Your "reply" should be a direct response to the user's last message in the chat.
- Generate "operations" ONLY if the user EXPLICITLY commands you to create, update, or perform a similar action in their LATEST message.
- If the user is just chatting, asking questions, or brainstorming, your "reply" should be conversational, and the "operations" array should be empty.
- If critical information for a requested action is missing even after checking context, your "reply" should ask for the specific missing piece, and the "operations" array should be empty.
`;
  } else { // quickCommand mode
    systemInstructionText += `
**Quick Command Mode Active:**
- Assume the user's input is a direct command. Prioritize generating relevant "operations".
- Your "reply" should confirm the action or state any issues (e.g., "Okay, adding task...", or "I need more details to add that goal.").
- If the command is ambiguous or missing critical information for an action, your "reply" should ask for clarification, and the "operations" array should be empty.
`;
  }
  
  systemInstructionText += `
**Action Payload Requirements:**
- "addTask": requires "text". Optional: "dueDate" (YYYY-MM-DD), "category", "recurrenceRule", "subTasks" (array of {text: string}).
- "addNote": requires "content". Optional: "title", "category".
- "addGoal": requires "name", "targetValue" (number), "unit". Optional: "currentValue" (defaults to 0), "category".
- "addEvent": requires "title", "date" (ISO string like YYYY-MM-DDTHH:mm:00.000Z. If only date, use 12:00 PM. If only time, use today). Optional: "description", "category", "recurrenceRule".
- "updateTask": requires "taskIdToUpdate" OR "text" (of existing task to find). Payload can include fields to update.
- "unknown": use if an operation fails or input is unintelligible. Include an "error" or "message" in its payload.

Handle dates intelligently (e.g., "next Tuesday", "tomorrow at 5pm").
If audio input is provided, interpret the speech. For simple greetings like "hello" (audio or text) in chat mode, just provide a conversational "reply" and empty "operations".
If audio is background noise, the "reply" should state you couldn't understand, and "operations" should be empty or contain an "unknown" operation.
`;

  if (persistentUserContextSummary && persistentUserContextSummary.trim() !== '') {
    systemInstructionText += `\n\nIMPORTANT PERSISTENT USER CONTEXT (Remember this for all interactions): "${persistentUserContextSummary}"`;
  }
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const contents: Content[] = [];
  if (inSessionChatHistory && inSessionChatHistory.length > 0) {
    const filteredHistory = inSessionChatHistory.filter(c => !(c.role === 'model' && c.parts.some(p => (p as {text:string}).text?.includes("AIDA is thinking..."))));
    contents.push(...filteredHistory);
  }
  contents.push({ role: "user", parts: inputParts });

  const request: GenerateContentRequest = {
      contents: contents,
      generationConfig: generationConfig,
      safetySettings: safetySettings,
      systemInstruction: { role: "system", parts: [{ text: systemInstructionText }] }
  };
    
  try {
    const result = await model.generateContent(request);
    let responseText = result.response.text();
    console.log("[Gemini Raw Response Text]:", responseText);

    // Robust JSON extraction
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1];
    } else {
        responseText = responseText.trim();
        if (!responseText.startsWith('{') || !responseText.endsWith('}')) {
            const firstBrace = responseText.indexOf('{');
            const lastBrace = responseText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                responseText = responseText.substring(firstBrace, lastBrace + 1);
            } else {
                 console.error(`[Gemini Error] Could not extract valid JSON structure from response: ${responseText.substring(0, 300)}...`);
                 return { reply: "Sorry, I had trouble understanding that. Could you try rephrasing?", operations: [], originalInputParts: inputParts, overallError: "AI response format error: No valid JSON found."};
            }
        }
    }

    let parsedJson: GeminiApiResponse;
    try {
      parsedJson = JSON.parse(responseText) as GeminiApiResponse;
    } catch (parseError) {
      console.error("[Gemini Error] Failed to parse JSON response:", parseError, "Response Text:", responseText);
      return { reply: `Sorry, there was an issue processing my thoughts. Details: ${(parseError as Error).message}`, operations: [], originalInputParts: inputParts, overallError: `AI response format error: Invalid JSON. ${(parseError as Error).message}`};
    }

    // Validate top-level structure
    if (typeof parsedJson.reply !== 'string') {
        console.warn("[Gemini Warning] AI response missing or invalid 'reply' field. Response:", responseText);
        parsedJson.reply = "I'm not sure how to respond to that. Can you try again?";
    }
    if (!Array.isArray(parsedJson.operations)) {
        console.warn("[Gemini Warning] AI response missing or invalid 'operations' array. Setting to empty. Response:", responseText);
        parsedJson.operations = [];
    }
    
    const processedOperations: AiOperation[] = parsedJson.operations.map((op: any) => {
        let { action, payload } = op;
        if (!action || typeof action !== 'string' || !["addTask", "addNote", "addGoal", "addEvent", "updateTask", "unknown"].includes(action)) {
            console.warn(`[Gemini Warning] Invalid action type received: ${action}. Defaulting to 'unknown'.`);
            action = "unknown"; 
        }
        if (!payload || typeof payload !== 'object') payload = {};

        // Category assignment logic (remains similar)
        if ((payload.category === "All Projects" || !payload.category) && action !== 'unknown') {
            if (currentCategory !== "All Projects" && availableCategories.includes(currentCategory)) {
                payload.category = currentCategory;
            } else {
                const firstSpecificCategory = availableCategories.find(cat => cat !== "All Projects");
                payload.category = firstSpecificCategory || (availableCategories.length > 0 && availableCategories[0] !== "All Projects" ? availableCategories[0] : "Personal Life");
            }
        }
        // Date parsing logic (remains similar)
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
    
    return { 
        reply: parsedJson.reply,
        operations: processedOperations, 
        originalInputParts: inputParts,
    };

  } catch (error) {
    console.error("[Gemini Error] Error processing with Gemini:", error);
    const errorMessage = `Gemini API error: ${(error as Error).message}`;
    return {
      reply: "I encountered an issue while trying to process that. Please try again.",
      operations: [], 
      originalInputParts: inputParts,
      overallError: errorMessage
    };
  }
}


export async function generateUserContextSummary(
    chatSessionHistory: Array<Content>
): Promise<string> {
    if (!chatSessionHistory || chatSessionHistory.length === 0) {
        return "";
    }
    // Filter out AI "thinking" messages from history before sending for summary
    const historyForSummary = chatSessionHistory.filter(c => !(c.role === 'model' && c.parts.some(p => (p as {text:string}).text?.includes("AIDA is thinking..."))));
    if (historyForSummary.length === 0) return "";


    const systemInstructionText = `You are an AI assistant. Your task is to summarize the key information, decisions, user preferences, ongoing plans, or unresolved topics from the following conversation history. 
Focus on details that would be helpful for a personal assistant to remember for future interactions with this user.
Keep the summary concise, informative, and neutral in tone. Output ONLY the summary text, nothing else.
For example: "User is planning a trip to Japan in December, interested in budget airlines. They often work on 'Project X' and prefer morning meetings. They are currently looking for vegetarian recipes."
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const request: GenerateContentRequest = {
        contents: [...historyForSummary, { role: 'user', parts: [{ text: "Please summarize our conversation for future reference." }] }],
        generationConfig: {
            temperature: 0.3,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 512, 
            responseMimeType: "text/plain",
        },
        safetySettings: safetySettings,
        systemInstruction: { role: "system", parts: [{ text: systemInstructionText }] }
    };

    try {
        const result = await model.generateContent(request);
        const summaryText = result.response.text();
        console.log("[Gemini User Context Summary]:", summaryText);
        return summaryText.trim();
    } catch (error) {
        console.error("[Gemini Error] Failed to generate user context summary:", error);
        return "";
    }
}
