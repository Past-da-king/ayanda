import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Part, GenerateContentRequest, Content } from "@google/genai";

// Removed SubTask as it's unused in this file
import { Category, Task, Goal, Note, Event as AppEvent, RecurrenceRule } from '@/types';
import { format, addDays, parseISO, isValid } from 'date-fns';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable inside .env.local');
}

// Removed global genAI instance. It will be created locally in each function.

// Top-level generationConfig and safetySettings remain, to be passed into getGenerativeModel
const generationConfig_global = { 
  temperature: 0.6,
  topP: 0.95,
  topK: 60,
  maxOutputTokens: 2048,
  responseMimeType: "application/json",
};

const safetySettings_global = [ 
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE, },
];


function getTodaysDate() { return format(new Date(), 'yyyy-MM-dd'); }
function getTomorrowsDate() { return format(addDays(new Date(), 1), 'yyyy-MM-dd'); }

export type InteractionMode = 'quickCommand' | 'chatSession';

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

export interface GeminiApiResponse {
  reply: string; 
  operations: AiOperation[];
}


export interface ProcessedGeminiOutput {
  reply: string; 
  operations: AiOperation[];
  originalInputParts: Part[]; // Using direct import
  overallError?: string;
}

export async function processWithGemini(
    inputParts: Part[], // Using direct import
    currentCategory: Category,
    availableCategories: Category[],
    interactionMode: InteractionMode, 
    persistentUserContextSummary?: string,
    inSessionChatHistory?: Array<Content> // Using direct import
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
  } else { 
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
Ensure any recurrenceRule adheres to the defined structure.
`;

  if (persistentUserContextSummary && persistentUserContextSummary.trim() !== '') {
    systemInstructionText += `\n\nIMPORTANT PERSISTENT USER CONTEXT (Remember this for all interactions): "${persistentUserContextSummary}"`;
  }
  
  if (!API_KEY) throw new Error('GEMINI_API_KEY is not defined'); // Already checked at module start, but good for safety
  const genAI_local = new GoogleGenAI(API_KEY);

  const modelInstance = genAI_local.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: generationConfig_global, 
      safetySettings: safetySettings_global,     
      systemInstruction: { role: "system", parts: [{ text: systemInstructionText }] }
  });
  
  const contentsForRequest: Content[] = []; 
  if (inSessionChatHistory && inSessionChatHistory.length > 0) {
    const filteredHistory = inSessionChatHistory.filter(c => !(c.role === 'model' && c.parts.some(p => (p as {text:string}).text?.includes("AIDA is thinking..."))));
    contentsForRequest.push(...filteredHistory);
  }
  contentsForRequest.push({ role: "user", parts: inputParts });

  const requestObject: GenerateContentRequest = { contents: contentsForRequest };
    
  try {
    const result = await modelInstance.generateContent(requestObject);
    let responseText = result.response.text();
    console.log("[Gemini Raw Response Text]:", responseText);

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

    if (typeof parsedJson.reply !== 'string') {
        console.warn("[Gemini Warning] AI response missing or invalid 'reply' field. Response:", responseText);
        parsedJson.reply = "I'm not sure how to respond to that. Can you try again?";
    }
    if (!Array.isArray(parsedJson.operations)) {
        console.warn("[Gemini Warning] AI response missing or invalid 'operations' array. Setting to empty. Response:", responseText);
        parsedJson.operations = [];
    }
    
    const processedOperations: AiOperation[] = parsedJson.operations.map((op: AiOperation) => {
        let { action, payload } = op;
        // Basic validation for action, assuming payload structure is handled by Gemini or further downstream
        if (!action || typeof action !== 'string' || !["addTask", "addNote", "addGoal", "addEvent", "updateTask", "unknown", "clarification", "suggestion"].includes(action)) {
            console.warn(`[Gemini Warning] Invalid action type received: ${action}. Defaulting to 'unknown'.`);
            action = "unknown"; 
        }
        if (!payload || typeof payload !== 'object') payload = {};

        if ((payload.category === "All Projects" || !payload.category) && action !== 'unknown') {
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
            } catch { payload.dueDate = undefined; } 
        }
        if (action === "addEvent" && payload.date) {
            try {
                let parsedEventDate = parseISO(payload.date as string);
                if (!isValid(parsedEventDate) && (payload.date as string).match(/^\d{4}-\d{2}-\d{2}$/)) {
                    parsedEventDate = parseISO(`${payload.date}T12:00:00.000Z`);
                }
                payload.date = isValid(parsedEventDate) ? parsedEventDate.toISOString() : undefined;
            } catch { payload.date = undefined; } 
        }
        if (payload.recurrenceRule?.endDate) {
            try {
                const parsedEndDate = parseISO(payload.recurrenceRule.endDate as string);
                payload.recurrenceRule.endDate = isValid(parsedEndDate) ? format(parsedEndDate, 'yyyy-MM-dd') : undefined;
            } catch { if (payload.recurrenceRule) payload.recurrenceRule.endDate = undefined; } 
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
    chatSessionHistory: Array<Content>, // Using direct import
    existingSummary?: string
): Promise<string> {
    const historyForSummary = chatSessionHistory.filter(c => !(c.role === 'model' && c.parts.some(p => (p as {text:string}).text?.includes("AIDA is thinking..."))));
    if (historyForSummary.length === 0 && !existingSummary) {
        return ""; // Nothing to summarize if both are empty
    }

    let promptForSummary = "The following is a transcript of a recent conversation with a user. ";
    if (existingSummary && existingSummary.trim() !== "") {
        promptForSummary = `Here is the existing summary of the user's context: "${existingSummary}". \nNow, considering that existing summary, and the following new conversation transcript, please generate an updated, consolidated summary. The new summary should incorporate key new information from the recent conversation, maintain relevant insights from the existing summary, and prioritize new information if it conflicts or supersedes old details. Ensure the result is concise and coherent, avoiding redundancy. Output ONLY the new, complete summary text.\n\nRecent Conversation Transcript:\n`;
    } else {
        promptForSummary = "Please summarize the key information, decisions, user preferences, ongoing plans, or unresolved topics from the following conversation. Focus on details that would be helpful for a personal assistant to remember for future interactions with this user. Keep the summary concise, informative, and neutral in tone. Output ONLY the summary text.\n\nConversation Transcript:\n";
    }
    
    // Construct content for summary generation
    const summaryContents: Content[] = []; // Using direct import
    if (existingSummary && existingSummary.trim() !== "") {
        // We are including existing summary in the system/user prompt.
    }
    summaryContents.push(...historyForSummary);
    summaryContents.push({ role: 'user', parts: [{ text: "Based on all the above (including any prior summary provided in the instructions and this recent conversation), provide the new consolidated summary."}]});

    const systemInstructionForSummary = promptForSummary;

    if (!API_KEY) throw new Error('GEMINI_API_KEY is not defined for summary'); // Already checked
    const genAI_local_summary = new GoogleGenAI(API_KEY);
    
    const modelInstanceSummary = genAI_local_summary.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { 
            temperature: 0.3,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024, 
            responseMimeType: "text/plain",
        },
        safetySettings: safetySettings_global, 
        systemInstruction: { role: "system", parts: [{ text: systemInstructionForSummary }] }
    });
    
    const requestObjectSummary: GenerateContentRequest = { contents: summaryContents };

    try {
        const result = await modelInstanceSummary.generateContent(requestObjectSummary);
        const summaryText = result.response.text();
        console.log("[Gemini User Context Summary - New/Merged]:", summaryText);
        return summaryText.trim();
    } catch (error) {
        console.error("[Gemini Error] Failed to generate user context summary:", error);
        return existingSummary || ""; // Fallback to existing summary or empty if error
    }
}
