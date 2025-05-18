

## src/types/index.ts
```typescript
import { User as NextAuthUser } from 'next-auth';

export interface RecurrenceRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // e.g., every 1 day, every 2 weeks
  daysOfWeek?: number[]; // 0 (Sun) to 6 (Sat), for weekly
  dayOfMonth?: number; // 1-31, for monthly
  monthOfYear?: number; // 1-12, for yearly on a specific month/day
  endDate?: string; // YYYY-MM-DD, optional end date for recurrence
  count?: number; // Optional number of occurrences
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD format (start date for recurring)
  category: string;
  recurrenceRule?: RecurrenceRule;
  subTasks?: SubTask[];
  // nextDueDate?: string; // Optional: Can be calculated on the fly or stored for performance
}

export interface Goal {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string;
}

export interface Note {
  id: string;
  title?: string;
  content: string; // Will store Markdown content
  category: string;
  lastEdited: string; // ISO string
}

export interface Event {
  id:string;
  title: string;
  date: string; // ISO string for the event's date and time (start date/time for recurring)
  duration?: number; // in minutes
  description?: string;
  category: string;
  recurrenceRule?: RecurrenceRule;
  // nextEventDate?: string; // Optional: Can be calculated
}


export type ViewMode = "dashboard" | "tasks" | "goals" | "notes" | "calendar";

export type Category = "All Projects" | "Personal Life" | "Work" | "Studies";

// For NextAuth session and JWT
export interface AuthenticatedUser extends NextAuthUser {
  id: string;
  email: string;
  name?: string | null;
}

// For Global Search Results
export interface SearchResultItem {
  id: string;
  type: 'task' | 'goal' | 'note' | 'event';
  title: string;
  category: Category;
  date?: string;
  contentPreview?: string;
  path: string; // To navigate to the item
}
```

## src/models/TaskModel.ts
```typescript
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Task as TaskType, RecurrenceRule, SubTask } from '@/types';

export interface ITask extends TaskType, Document {}

const RecurrenceRuleSchema = new Schema<RecurrenceRule>({
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  interval: { type: Number, required: true, min: 1 },
  daysOfWeek: { type: [Number], required: false },
  dayOfMonth: { type: Number, required: false },
  monthOfYear: { type: Number, required: false },
  endDate: { type: String, required: false },
  count: { type: Number, required: false },
}, { _id: false });

const SubTaskSchema = new Schema<SubTask>({
  id: { type: String, required: true }, // UUID generated on client/server
  text: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
}, { _id: false });

const TaskSchema: Schema<ITask> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
    dueDate: { type: String, required: false }, // YYYY-MM-DD format
    category: { type: String, required: true },
    recurrenceRule: { type: RecurrenceRuleSchema, required: false },
    subTasks: { type: [SubTaskSchema], required: false, default: [] },
    // nextDueDate: { type: String, required: false }, // Consider if this needs to be stored
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const TaskModel: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;
```

## src/models/EventModel.ts
```typescript
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Event as EventType, RecurrenceRule } from '@/types';

export interface IEvent extends EventType, Document {}

const RecurrenceRuleSchema = new Schema<RecurrenceRule>({
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  interval: { type: Number, required: true, min: 1 },
  daysOfWeek: { type: [Number], required: false },
  dayOfMonth: { type: Number, required: false },
  monthOfYear: { type: Number, required: false },
  endDate: { type: String, required: false },
  count: { type: Number, required: false },
}, { _id: false });

const EventSchema: Schema<IEvent> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String, required: true }, // ISO string
    duration: { type: Number, required: false }, // in minutes
    description: { type: String, required: false },
    category: { type: String, required: true },
    recurrenceRule: { type: RecurrenceRuleSchema, required: false },
    // nextEventDate: { type: String, required: false }, // Consider if this needs to be stored
  },
  {
    timestamps: true,
  }
);

const EventModel: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;
```

## src/app/api/tasks/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel, { ITask } from '@/models/TaskModel';
import { Task, RecurrenceRule, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    const query = category && category !== "All Projects" ? { category } : {};
    // Consider how to sort/filter recurring tasks for lists if `nextDueDate` isn't stored.
    // For now, sorting by createdAt or potentially dueDate (as start date for recurring).
    const tasks: ITask[] = await TaskModel.find(query).sort({ dueDate: 1, createdAt: -1 });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<Task, 'id' | 'completed'> & { subTasks?: SubTask[], recurrenceRule?: RecurrenceRule } = await request.json();
    
    const newSubTasks = (body.subTasks || []).map(sub => ({ ...sub, id: sub.id || uuidv4() }));

    const newTaskData: Task = {
        id: uuidv4(),
        text: body.text,
        completed: false,
        dueDate: body.dueDate,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
        subTasks: newSubTasks,
    };
    const task: ITask = new TaskModel(newTaskData);
    await task.save();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    // More detailed error logging or specific error messages can be added here
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create task', error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/tasks/[id]/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel'; // Removed ITask as it's inferred
import { Task, SubTask, RecurrenceRule } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';


interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<Task, 'id'>> & { subTasks?: SubTask[], recurrenceRule?: RecurrenceRule } = await request.json();

    // Ensure subTasks have IDs if provided
    if (body.subTasks) {
      body.subTasks = body.subTasks.map(sub => ({
        ...sub,
        id: sub.id || uuidv4(), // Assign new ID if missing, useful if adding new subtasks during update
      }));
    }
    
    // If recurrenceRule is explicitly set to null or undefined by client to remove it
    const updatePayload: any = { ...body };
    if (body.hasOwnProperty('recurrenceRule') && !body.recurrenceRule) {
        updatePayload.$unset = { recurrenceRule: "" };
        delete updatePayload.recurrenceRule;
    }
    if (body.hasOwnProperty('subTasks') && body.subTasks === null) { // Allow clearing subtasks
      updatePayload.subTasks = [];
    }


    const updatedTask = await TaskModel.findOneAndUpdate({ id: id }, updatePayload, { new: true, runValidators: true });
    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: `Failed to update task ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedTask = await TaskModel.findOneAndDelete({ id: id });
    if (!deletedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete task ${id}`, error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/events/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel, { IEvent } from '@/models/EventModel';
import { Event as AppEvent, RecurrenceRule } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query = category && category !== "All Projects" ? { category } : {};
    const events: IEvent[] = await EventModel.find(query).sort({ date: 1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ message: 'Failed to fetch events', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<AppEvent, 'id'> & { recurrenceRule?: RecurrenceRule } = await request.json();
    const newEventData: AppEvent = {
        id: uuidv4(),
        title: body.title,
        date: body.date,
        duration: body.duration,
        description: body.description,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
    };
    const event: IEvent = new EventModel(newEventData);
    await event.save();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create event', error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/events/[id]/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel from '@/models/EventModel'; // Removed IEvent as it's inferred
import { Event as AppEvent, RecurrenceRule } from '@/types';
import mongoose from 'mongoose';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<AppEvent, 'id'>> & { recurrenceRule?: RecurrenceRule | null } = await request.json();
    
    const updatePayload: any = { ...body };
    if (body.hasOwnProperty('recurrenceRule') && !body.recurrenceRule) {
        updatePayload.$unset = { recurrenceRule: "" }; // To remove the field from DB if set to null
        delete updatePayload.recurrenceRule; // Don't send recurrenceRule field itself if unsetting
    }

    const updatedEvent = await EventModel.findOneAndUpdate({ id: id }, updatePayload, { new: true, runValidators: true });
    if (!updatedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
     if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: `Failed to update event ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedEvent = await EventModel.findOneAndDelete({ id: id });
    if (!deletedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete event ${id}`, error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/search/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import GoalModel from '@/models/GoalModel';
import NoteModel from '@/models/NoteModel';
import EventModel from '@/models/EventModel';
import { Category, SearchResultItem } from '@/types';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const currentCategoryFilter = searchParams.get('category') as Category | null;

  if (!query || query.trim().length < 2) { // Require at least 2 characters for search
    return NextResponse.json({ message: 'Search query "q" must be at least 2 characters long' }, { status: 400 });
  }

  try {
    const searchRegex = { $regex: query, $options: 'i' };

    const categoryQueryPart = (currentCategoryFilter && currentCategoryFilter !== "All Projects")
      ? { category: currentCategoryFilter }
      : {};

    const tasksPromise = TaskModel.find({ ...categoryQueryPart, text: searchRegex }).limit(10).lean();
    const goalsPromise = GoalModel.find({ ...categoryQueryPart, name: searchRegex }).limit(10).lean();
    const notesPromise = NoteModel.find({ ...categoryQueryPart, $or: [{ title: searchRegex }, { content: searchRegex }] }).limit(10).lean();
    const eventsPromise = EventModel.find({ ...categoryQueryPart, $or: [{ title: searchRegex }, { description: searchRegex }] }).limit(10).lean();

    const [tasks, goals, notes, events] = await Promise.all([
      tasksPromise,
      goalsPromise,
      notesPromise,
      eventsPromise,
    ]);

    const results: SearchResultItem[] = [];

    tasks.forEach(task => results.push({
      id: task.id,
      type: 'task',
      title: task.text,
      category: task.category as Category,
      date: task.dueDate,
      path: `/tasks#${task.id}`, // Example path, adjust as needed for navigation
    }));
    goals.forEach(goal => results.push({
      id: goal.id,
      type: 'goal',
      title: goal.name,
      category: goal.category as Category,
      path: `/goals#${goal.id}`,
    }));
    notes.forEach(note => results.push({
      id: note.id,
      type: 'note',
      title: note.title || note.content.substring(0, 50) + (note.content.length > 50 ? '...' : ''),
      category: note.category as Category,
      date: note.lastEdited,
      contentPreview: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
      path: `/notes#${note.id}`,
    }));
    events.forEach(event => results.push({
      id: event.id,
      type: 'event',
      title: event.title,
      category: event.category as Category,
      date: event.date,
      contentPreview: event.description?.substring(0, 100) + ((event.description?.length || 0) > 100 ? '...' : ''),
      path: `/calendar#${event.id}`,
    }));
    
    // Sort results by a common field if possible, e.g., date, or leave as is
    results.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA; // Show more recent items first
    });


    return NextResponse.json(results.slice(0, 20), { status: 200 }); // Limit total results sent to client

  } catch (error) {
    console.error('Failed to perform search:', error);
    return NextResponse.json({ message: 'Failed to perform search', error: (error as Error).message }, { status: 500 });
  }
}
```

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
```

## tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Important for manual dark mode toggling
  theme: {
    extend: {
      fontFamily: {
        // Use a CSS variable that ThemeProvider will update
        sans: ['var(--font-selected-app)', 'var(--font-inter)', 'sans-serif'],
        orbitron: ['var(--font-orbitron-val)', 'sans-serif'],
        // Individual font variables are also available if needed directly
        inter: ['var(--font-inter)', 'sans-serif'],
        'geist-sans': ['var(--font-geist-sans)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
        lexend: ['var(--font-lexend)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        'jetbrains-mono': ['var(--font-jetbrains-mono)', 'monospace'],
        lora: ['var(--font-lora)', 'serif'],
      },
      colors: {
        // Define colors using CSS variables that will be dynamically set
        // These are for Tailwind's `theme()` helper and JIT engine
        // The actual color values will come from :root via ThemeProvider
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        widget: 'var(--widget-background-val)', // Custom name
        'widget-bg': 'var(--widget-background-val)', // Alias if needed
        'text-main': 'var(--text-color-val)',
        'text-muted': 'var(--text-muted-color-val)',
        'border-main': 'var(--border-color-val)',
        'input-bg': 'var(--input-bg-val)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        ring: 'var(--ring)',
        input: 'var(--input)', // shadcn input border color

        // Your custom palette variable names
        'accent-color': 'var(--accent-color-val)',
        'background-color': 'var(--background-color-val)',
        'widget-background': 'var(--widget-background-val)',
        'text-color': 'var(--text-color-val)',
        'text-muted-color': 'var(--text-muted-color-val)',
        'border-color': 'var(--border-color-val)',
        'danger-color': 'var(--danger-color-val)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Add typography for react-markdown
      typography: (theme: (path: string) => any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: `hsl(var(--accent-color-hsl) / 0.8)`,
              },
            },
            strong: { color: theme('colors.foreground') },
            code: { color: theme('colors.primary'), backgroundColor: `hsl(var(--accent-color-hsl) / 0.1)` , padding: '0.2em 0.4em', borderRadius: '0.25rem'},
            blockquote: { color: theme('colors.muted-foreground'), borderLeftColor: theme('colors.border')},
            h1: { color: theme('colors.foreground') },
            h2: { color: theme('colors.foreground') },
            h3: { color: theme('colors.foreground') },
            h4: { color: theme('colors.foreground') },
            'ul > li::before': { backgroundColor: theme('colors.muted-foreground') },
            'ol > li::before': { color: theme('colors.muted-foreground') },
          },
        },
        sm: { // for prose-sm
             css: {
                fontSize: '0.875rem', // text-sm
                p: { marginTop: '0.75em', marginBottom: '0.75em'},
                ul: { marginTop: '0.75em', marginBottom: '0.75em'},
                ol: { marginTop: '0.75em', marginBottom: '0.75em'},
                // Add other specific sm styles if needed
             }
        },
        invert: { // For dark mode, if using prose-invert
          css: {
            color: theme('colors.foreground'), // Assuming foreground is already dark-mode aware
            a: {
              color: theme('colors.primary'),
               '&:hover': {
                color: `hsl(var(--accent-color-hsl) / 0.8)`,
              },
            },
            strong: { color: theme('colors.foreground') },
            code: { color: theme('colors.primary'), backgroundColor: `hsl(var(--accent-color-hsl) / 0.15)`},
            blockquote: { color: theme('colors.muted-foreground'), borderLeftColor: theme('colors.border')},
            h1: { color: theme('colors.foreground') },
            h2: { color: theme('colors.foreground') },
            h3: { color: theme('colors.foreground') },
            h4: { color: theme('colors.foreground') },
            'ul > li::before': { backgroundColor: theme('colors.muted-foreground') },
            'ol > li::before': { color: theme('colors.muted-foreground') },
          },
        },
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'), // New plugin
  ],
};

export default config;
```



## src/components/layout/Header.tsx
```typescript
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { LogIn, LogOut, PaletteIcon, Search as SearchIcon, X as XIcon, CalendarIcon, ListChecks, Target, StickyNote } from 'lucide-react'; // Added SearchIcon, XIcon
import { AyandaLogoIcon } from './AyandaLogoIcon';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Added Input
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeCustomizer } from './ThemeCustomizer';
import { SearchResultItem } from '@/types'; // Added SearchResultItem
import { usePathname, useRouter } from 'next/navigation'; // For navigation from search

// Helper to get icon based on search result type
const getIconForType = (type: SearchResultItem['type']) => {
  switch (type) {
    case 'task': return <ListChecks className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'goal': return <Target className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'note': return <StickyNote className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'event': return <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />;
    default: return null;
  }
};


export function Header() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPopoverRef = useRef<HTMLDivElement>(null);

  const currentPathname = usePathname();
  const router = useRouter();


  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearchPopoverOpen(false);
      return;
    }
    setIsSearchLoading(true);
    setIsSearchPopoverOpen(true); // Open popover when search starts
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearchPopoverOpen(false);
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Close search popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchPopoverRef.current && !searchPopoverRef.current.contains(event.target as Node) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigateToItem = (item: SearchResultItem) => {
    // This is a simplified navigation. Ideally, you'd trigger the main page to open the correct view and scroll/highlight the item.
    // For now, it might just navigate to a general area if specific deep linking isn't set up in page.tsx for search results.
    // For MVP, redirecting to the view and user finds it by title might be okay.
    // A more advanced solution involves context or event emitters to tell page.tsx to switch view and highlight.
    
    // For now, we'll assume the path takes us close enough or page.tsx handles it.
    if (item.path) {
       router.push(`/#view=${item.type}&id=${item.id}`); // Example, adapt to how page.tsx handles deep links
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchPopoverOpen(false);
  };

  const showSearch = status === "authenticated" && !["/login", "/register", "/landing"].includes(currentPathname);


  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[95]",
        "flex items-center justify-between",
        "px-6 py-4",
        "bg-background border-b border-border-main", // Theming
      )}
      style={{ height: '5rem' }}
    >
      <Link href={session ? "/" : "/landing"} className="flex items-center space-x-3 cursor-pointer group">
        <AyandaLogoIcon className="group-hover:scale-110 transition-transform duration-200" />
        <h1 className="font-orbitron text-3xl font-bold tracking-wider accent-text group-hover:brightness-110 transition-all duration-200">AYANDA</h1>
      </Link>
      
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim().length >=2) setIsSearchPopoverOpen(true);}}
                className="pl-9 pr-8 h-9 w-48 md:w-64 input-field rounded-full bg-input-bg border-border-main focus:bg-widget-background focus:w-64 md:focus:w-72 transition-all"
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearchPopoverOpen(false); }}
                >
                  <XIcon className="h-4 w-4"/>
                </Button>
              )}
            </div>
            {isSearchPopoverOpen && (searchQuery.trim().length >= 2) && (
              <div
                ref={searchPopoverRef}
                className="absolute top-full mt-2 w-72 md:w-96 max-h-[60vh] overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[100] p-1 space-y-0.5"
              >
                {isSearchLoading && <p className="p-3 text-sm text-muted-foreground text-center">Searching...</p>}
                {!isSearchLoading && searchResults.length === 0 && (
                  <p className="p-3 text-sm text-muted-foreground text-center">No results found for "{searchQuery}".</p>
                )}
                {!isSearchLoading && searchResults.map(item => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="p-2.5 hover:bg-accent rounded cursor-pointer flex items-start"
                    onClick={() => handleNavigateToItem(item)}
                  >
                    {getIconForType(item.type)}
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-popover-foreground leading-tight truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.type} in <span className="font-medium">{item.category}</span>
                        {item.date && ` - ${new Date(item.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {status === "loading" ? (
          <div className="w-9 h-9 bg-muted animate-pulse rounded-full"></div>
        ) : session?.user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, {session.user.name || session.user.email?.split('@')[0]}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Customize Theme">
                  <PaletteIcon className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <ThemeCustomizer />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/landing' })}
              className="text-muted-foreground hover:text-accent-foreground"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Customize Theme">
                  <PaletteIcon className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <ThemeCustomizer />
              </PopoverContent>
            </Popover>
            <Link href="/login" legacyBehavior>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Sign In">
                <LogIn className="w-5 h-5" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
```

## src/components/views/TasksView.tsx
```typescript
"use client";

import React, { useState, useEffect } from 'react';
import { Task, Category, RecurrenceRule, SubTask } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // For subtask text if needed
import { X, Edit, Trash2, CalendarDays, PlusCircle, Repeat, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; // For recurrence editor
import { format, parseISO } from 'date-fns';

interface TasksViewProps {
  tasks: Task[];
  categories: Category[];
  currentCategory: Category;
  onAddTask: (taskData: Omit<Task, 'id' | 'completed'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, taskUpdateData: Partial<Omit<Task, 'id'>>) => void;
  onClose: () => void;
}

// Simplified Recurrence Editor Component (can be expanded)
const RecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
}> = ({ recurrence, onChange }) => {
  const [type, setType] = useState(recurrence?.type || 'weekly');
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (type && interval > 0) {
      const newRule: RecurrenceRule = { type, interval };
      if (type === 'weekly' && daysOfWeek.length > 0) newRule.daysOfWeek = daysOfWeek;
      if (endDate) newRule.endDate = endDate;
      onChange(newRule);
    } else {
      onChange(undefined); // Clear if invalid
    }
  }, [type, interval, daysOfWeek, endDate, onChange]);

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]);
  };

  if (!recurrence && type === '') { // Initial state to enable recurrence
    return <Button variant="outline" size="sm" onClick={() => setType('weekly')} className="text-xs"><Repeat className="w-3 h-3 mr-1.5"/>Set Recurrence</Button>
  }

  return (
    <div className="space-y-3 p-3 border border-border-main rounded-md bg-input-bg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => { onChange(undefined); setType(''); }}><X className="w-3.5 h-3.5"/></Button>
      </div>
      <Select value={type} onValueChange={(val) => setType(val as RecurrenceRule['type'])}>
        <SelectTrigger className="input-field text-xs h-8"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (basic)</SelectItem>
        </SelectContent>
      </Select>
      <Input type="number" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval" className="input-field text-xs h-8" />
      {type === 'weekly' && (
        <div className="flex space-x-1">
          {weekDays.map((day, i) => (
            <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-xs flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
              {day}
            </Button>
          ))}
        </div>
      )}
      <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" className="input-field text-xs h-8" />
    </div>
  );
};


export function TasksView({ tasks, categories, currentCategory, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, onClose }: TasksViewProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>(currentCategory === "All Projects" && categories.length > 0 ? categories[0] : currentCategory);
  const [newRecurrenceRule, setNewRecurrenceRule] = useState<RecurrenceRule | undefined>(undefined);
  const [newSubTasks, setNewSubTasks] = useState<SubTask[]>([]);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => { // Ensure category for new task is valid
    if (currentCategory === "All Projects" && categories.length > 0) {
        setNewTaskCategory(categories[0]);
    } else if (categories.includes(currentCategory)) {
        setNewTaskCategory(currentCategory);
    } else if (categories.length > 0) {
        setNewTaskCategory(categories[0]);
    }
  }, [currentCategory, categories]);

  const resetNewTaskForm = () => {
    setNewTaskText('');
    setNewTaskDueDate('');
    setNewRecurrenceRule(undefined);
    setNewSubTasks([]);
    if (currentCategory === "All Projects" && categories.length > 0) setNewTaskCategory(categories[0]);
    else if (categories.includes(currentCategory)) setNewTaskCategory(currentCategory);
    else if (categories.length > 0) setNewTaskCategory(categories[0]);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const taskData: Omit<Task, 'id' | 'completed'> = {
        text: newTaskText.trim(),
        category: newTaskCategory,
        dueDate: newTaskDueDate || undefined,
        recurrenceRule: newRecurrenceRule,
        subTasks: newSubTasks.filter(st => st.text.trim() !== ''),
      };
      onAddTask(taskData);
      resetNewTaskForm();
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditingTask(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEditedTask = (formData: {text: string; dueDate?: string; category: Category; recurrenceRule?: RecurrenceRule; subTasks?: SubTask[]}) => {
    if (editingTask) {
        onUpdateTask(editingTask.id, {
            text: formData.text,
            dueDate: formData.dueDate,
            category: formData.category,
            recurrenceRule: formData.recurrenceRule,
            subTasks: formData.subTasks,
        });
        closeEditModal();
    }
  };

  const handleAddSubTaskToNew = () => setNewSubTasks([...newSubTasks, { id: uuidv4(), text: '', completed: false }]);
  const handleNewSubTaskChange = (index: number, text: string) => {
    const updated = [...newSubTasks];
    updated[index].text = text;
    setNewSubTasks(updated);
  };
  const handleRemoveSubTaskFromNew = (id: string) => setNewSubTasks(newSubTasks.filter(st => st.id !== id));


  const filteredTasks = tasks
    .filter(task => (currentCategory === "All Projects" || task.category === currentCategory) && (showCompleted || !task.completed))
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const dateA = a.dueDate ? parseISO(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? parseISO(b.dueDate).getTime() : Infinity;
      if (dateA !== dateB) return dateA - dateB;
      return (b.createdAt || '').localeCompare(a.createdAt || ''); // Fallback sort by creation time
    });

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Tasks</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-widget-background border border-border-main rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Task Form */}
        <div className="space-y-3 p-4 bg-input-bg border border-border-main rounded-md">
          <Input
            type="text"
            placeholder="Add new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="input-field text-base p-3"
          />
          {/* Subtasks for New Task */}
           {newSubTasks.map((sub, index) => (
            <div key={sub.id} className="flex items-center gap-2 pl-4">
              <Checkbox disabled className="opacity-50"/>
              <Input 
                value={sub.text} 
                onChange={(e) => handleNewSubTaskChange(index, e.target.value)} 
                placeholder="Sub-task description"
                className="input-field text-sm p-1.5 h-8 flex-grow"
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveSubTaskFromNew(sub.id)} className="w-7 h-7"><Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive"/></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAddSubTaskToNew} className="text-xs border-border-main hover:bg-widget-background ml-4">+ Add sub-task</Button>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end pt-2">
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="input-field text-sm"
            />
             <Popover>
                <PopoverTrigger asChild>
                   <Button variant="outline" className="input-field text-sm justify-start font-normal h-auto py-2.5">
                     <Repeat className="w-3.5 h-3.5 mr-2"/> {newRecurrenceRule ? `${newRecurrenceRule.type}` : "Set Recurrence"}
                   </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                   <RecurrenceEditor recurrence={newRecurrenceRule} onChange={setNewRecurrenceRule} />
                </PopoverContent>
            </Popover>
            <Select value={newTaskCategory} onValueChange={(val) => setNewTaskCategory(val as Category)}>
              <SelectTrigger className="input-field text-sm h-auto py-2.5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-widget-background border-border-main text-text-main">
                {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <Button onClick={handleAddTask} className="btn-primary w-full mt-3 text-sm h-auto py-2.5">
                <PlusCircle className="w-4 h-4 mr-2"/> Add Task
            </Button>
        </div>

        <div className="flex justify-end items-center">
           <label htmlFor="task-show-completed-fs" className="flex items-center text-xs text-muted-foreground cursor-pointer">
             <Checkbox
                id="task-show-completed-fs"
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(Boolean(checked))}
                className="mr-1.5 h-3.5 w-3.5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
              /> Show Completed
            </label>
        </div>

        <ul className="space-y-2.5">
          {filteredTasks.map(task => (
            <li key={task.id} className={cn(
                "bg-input-bg border border-border-main rounded-md p-3", 
                task.completed && "opacity-60"
            )}>
                <div className="flex justify-between items-start">
                    <div className="flex items-start flex-grow min-w-0">
                        <Checkbox
                          id={`task-fs-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => onToggleTask(task.id)}
                          className="form-checkbox h-5 w-5 shrink-0 mt-0.5 mr-3 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                        />
                        <div className="flex-grow">
                            <span className={cn("text-base block", task.completed && "line-through")}>{task.text}</span>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center flex-wrap gap-x-2 gap-y-0.5">
                                <span>{task.category}</span>
                                {task.dueDate && (
                                    <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="flex items-center"><CalendarDays className="w-3 h-3 inline mr-1" />
                                        {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                                    </>
                                )}
                                {task.recurrenceRule && (
                                    <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="flex items-center"><Repeat className="w-3 h-3 inline mr-1" />
                                        {task.recurrenceRule.type}</span>
                                    </>
                                )}
                            </p>
                        </div>
                  </div>
                  <div className="flex items-center space-x-0.5 shrink-0 ml-2">
                     <Button variant="ghost" size="icon" onClick={() => openEditModal(task)} className="btn-icon w-7 h-7"><Edit className="w-4 h-4" /></Button>
                     <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="btn-icon danger w-7 h-7"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                {/* Display Subtasks */}
                {task.subTasks && task.subTasks.length > 0 && (
                    <div className="pl-8 mt-2 space-y-1.5">
                        {task.subTasks.map(sub => (
                            <div key={sub.id} className="flex items-center text-sm">
                                <Checkbox 
                                    id={`subtask-${task.id}-${sub.id}`}
                                    checked={sub.completed}
                                    onCheckedChange={() => {
                                        const updatedSubTasks = task.subTasks?.map(s => s.id === sub.id ? {...s, completed: !s.completed} : s);
                                        onUpdateTask(task.id, { subTasks: updatedSubTasks });
                                    }}
                                    className="h-4 w-4 mr-2 border-muted-foreground data-[state=checked]:bg-primary/70 data-[state=checked]:border-primary/70"
                                />
                                <label htmlFor={`subtask-${task.id}-${sub.id}`} className={cn("flex-grow", sub.completed && "line-through text-muted-foreground")}>{sub.text}</label>
                            </div>
                        ))}
                    </div>
                )}
            </li>
          ))}
           {filteredTasks.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
                {showCompleted ? "No tasks here." : "No active tasks. Way to go!"}
            </p>
          )}
        </ul>
      </div>

      {isEditModalOpen && editingTask && (
        <EditTaskModal 
            task={editingTask} 
            categories={categories}
            onClose={closeEditModal} 
            onSave={handleSaveEditedTask} 
        />
      )}
    </div>
  );
}

interface EditTaskModalProps {
    task: Task;
    categories: Category[];
    onClose: () => void;
    onSave: (formData: {text: string; dueDate?: string; category: Category; recurrenceRule?: RecurrenceRule; subTasks?: SubTask[]}) => void;
}
function EditTaskModal({ task, categories, onClose, onSave }: EditTaskModalProps) {
    const [text, setText] = useState(task.text);
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [category, setCategory] = useState(task.category);
    const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule | undefined>(task.recurrenceRule);
    const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks ? JSON.parse(JSON.stringify(task.subTasks)) : []); // Deep copy

    const handleAddSubTask = () => setSubTasks([...subTasks, { id: uuidv4(), text: '', completed: false }]);
    const handleSubTaskChange = (id: string, newText: string) => {
        setSubTasks(subTasks.map(st => st.id === id ? { ...st, text: newText } : st));
    };
    const handleSubTaskToggle = (id: string) => {
        setSubTasks(subTasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
    };
    const handleRemoveSubTask = (id: string) => setSubTasks(subTasks.filter(st => st.id !== id));

    const handleSubmit = () => {
        if(text.trim()) {
            onSave({ text: text.trim(), dueDate: dueDate || undefined, category, recurrenceRule, subTasks: subTasks.filter(st=> st.text.trim() !== '') });
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[110]" onClick={onClose}>
            <div className="bg-widget-background border border-border-main rounded-lg p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-border-main">
                    <h3 className="font-orbitron text-xl accent-text">Edit Task</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text"><X className="w-5 h-5"/></Button>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar-fullscreen">
                    <Input value={text} onChange={e => setText(e.target.value)} placeholder="Task description" className="input-field p-3"/>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Sub-tasks</label>
                        {subTasks.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2">
                            <Checkbox id={`edit-sub-${sub.id}`} checked={sub.completed} onCheckedChange={() => handleSubTaskToggle(sub.id)} className="h-4 w-4 border-muted-foreground"/>
                            <Input value={sub.text} onChange={e => handleSubTaskChange(sub.id, e.target.value)} className="input-field flex-grow text-sm p-1 h-8" placeholder="Sub-task description"/>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveSubTask(sub.id)} className="h-7 w-7"><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive"/></Button>
                        </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={handleAddSubTask} className="text-xs border-border-main hover:bg-input-bg">+ Add sub-task</Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-field p-3"/>
                        <Select value={category} onValueChange={val => setCategory(val as Category)}>
                            <SelectTrigger className="input-field p-3 h-auto"><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main">
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <RecurrenceEditor recurrence={recurrenceRule} onChange={setRecurrenceRule}/>
                </div>

                <div className="flex justify-end pt-4 border-t border-border-main space-x-2 shrink-0">
                    <Button variant="outline" onClick={onClose} className="border-border-main text-muted-foreground hover:bg-input-bg">Cancel</Button>
                    <Button onClick={handleSubmit} className="btn-primary">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
```

## src/components/views/NotesView.tsx
```typescript
"use client";

import React, { useState, useEffect } from 'react';
import { Note, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, PlusCircle, Eye, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // For markdown cheatsheet

const MarkdownCheatsheet: React.FC = () => (
  <div className="p-3 text-xs space-y-1 text-muted-foreground bg-popover border border-border rounded-md shadow-md w-64">
    <p><strong># H1</strong>, <strong>## H2</strong>, <strong>### H3</strong></p>
    <p><strong>**bold**</strong> or __bold__</p>
    <p><em>*italic*</em> or _italic_</p>
    <p>~<sub>~</sub>Strikethrough~<sub>~</sub></p>
    <p>Unordered List: <br />- Item 1<br />- Item 2</p>
    <p>Ordered List: <br />1. Item 1<br />2. Item 2</p>
    <p>Checklist: <br />- [ ] To do<br />- [x] Done</p>
    <p>[Link Text](https://url.com)</p>
    <p>`Inline code`</p>
    <p>```<br />Code block<br />```</p>
  </div>
);


export function NotesView({ notes, categories, currentCategory, onAddNote, onUpdateNote, onDeleteNote, onClose }: NotesViewProps) {
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<Category>(currentCategory);
  const [isNewNotePreview, setIsNewNotePreview] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');
  const [isEditNotePreview, setIsEditNotePreview] = useState(false);

  useEffect(() => {
    if (currentCategory === "All Projects" && categories.length > 0) {
        setNewNoteCategory(categories[0]);
    } else if (categories.includes(currentCategory)) {
        setNewNoteCategory(currentCategory);
    } else if (categories.length > 0) {
        setNewNoteCategory(categories[0]);
    }
  }, [currentCategory, categories]);

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteTitle.trim() || undefined, newNoteContent.trim(), newNoteCategory);
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsNewNotePreview(false);
      if (currentCategory === "All Projects" && categories.length > 0) setNewNoteCategory(categories[0]);
        else if (categories.includes(currentCategory)) setNewNoteCategory(currentCategory);
        else if (categories.length > 0) setNewNoteCategory(categories[0]);
    }
  };

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditNoteTitle(note.title || '');
    setEditNoteContent(note.content);
    setIsEditNotePreview(false);
  };

  const handleUpdateNote = () => {
    if (editingNoteId && editNoteContent.trim()) {
      onUpdateNote(editingNoteId, editNoteTitle.trim() || undefined, editNoteContent.trim());
      setEditingNoteId(null);
      setIsEditNotePreview(false);
    }
  };
  
  const filteredNotes = notes
    .filter(note => currentCategory === "All Projects" || note.category === currentCategory)
    .sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" 
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Notes</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-widget-background border border-border-main rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Note Form */}
        <div className="space-y-3 p-4 bg-input-bg border border-border-main rounded-md">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Note title (optional)"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="input-field text-base p-3 flex-grow"
                    disabled={isNewNotePreview}
                />
                <div className="flex items-center ml-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Markdown?</Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="icon" onClick={() => setIsNewNotePreview(!isNewNotePreview)} className="w-8 h-8 ml-1">
                        {isNewNotePreview ? <Pencil className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </Button>
                </div>
            </div>
            {isNewNotePreview ? (
                <div className="prose prose-sm dark:prose-invert max-w-none p-3 min-h-[100px] border border-dashed border-border-main rounded-md">
                    <ReactMarkdown>{newNoteContent || "Nothing to preview..."}</ReactMarkdown>
                </div>
            ) : (
                <Textarea
                    placeholder="Type your note content here (Markdown supported)..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="input-field min-h-[100px] text-base p-3"
                />
            )}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-2">
                <label htmlFor="note-category-select" className="sr-only">Category</label>
                <Select value={newNoteCategory} onValueChange={(val) => setNewNoteCategory(val as Category)} disabled={isNewNotePreview}>
                    <SelectTrigger id="note-category-select" className="input-field text-sm h-auto py-2.5">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-widget-background border-border-main text-text-main">
                        {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddNote} className="btn-primary sm:col-span-3 text-sm h-auto py-2.5" disabled={isNewNotePreview}>
                 <PlusCircle className="w-4 h-4 mr-2"/> Add New Note
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <ul className="space-y-3">
          {filteredNotes.map(note => (
            <li key={note.id} className="bg-input-bg border border-border-main rounded-md p-3 hover:border-accent/30 transition-colors">
              {editingNoteId === note.id ? (
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} placeholder="Title (optional)" className="input-field p-2 text-sm flex-grow" disabled={isEditNotePreview}/>
                        <div className="flex items-center ml-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Markdown?</Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                            </Popover>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditNotePreview(!isEditNotePreview)} className="w-8 h-8 ml-1">
                                {isEditNotePreview ? <Pencil className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </Button>
                        </div>
                    </div>
                    {isEditNotePreview ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none p-2 min-h-[80px] border border-dashed border-border-main rounded-md">
                           <ReactMarkdown>{editNoteContent || "Nothing to preview..."}</ReactMarkdown>
                        </div>
                    ) : (
                        <Textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} placeholder="Content" className="input-field min-h-[80px] p-2 text-sm"/>
                    )}
                    <div className="flex gap-2 pt-1">
                        <Button onClick={handleUpdateNote} size="sm" className="btn-primary text-xs px-3 py-1.5" disabled={isEditNotePreview}>Save Changes</Button>
                        <Button onClick={() => setEditingNoteId(null)} variant="outline" size="sm" className="border-border-main text-muted-foreground hover:bg-background text-xs px-3 py-1.5">Cancel</Button>
                    </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-1">
                      <div>
                          {note.title && <h4 className="text-base font-semibold text-text-main">{note.title}</h4>}
                          <p className="text-xs text-muted-foreground">
                              {note.category} • Edited: {new Date(note.lastEdited).toLocaleDateString()}
                          </p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(note)} className="btn-icon w-7 h-7 text-muted-foreground hover:accent-text">
                              <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDeleteNote(note.id)} className="btn-icon danger w-7 h-7 text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-text-main leading-relaxed note-content-markdown">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                  </div>
                </>
              )}
            </li>
          ))}
          {filteredNotes.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No notes in this category. Jot something down!</p>
          )}
        </ul>
      </div>
    </div>
  );
}
```

## src/components/views/CalendarFullScreenView.tsx
```typescript
"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Event as AppEvent, Category, RecurrenceRule } from '@/types';
import { cn } from '@/lib/utils';
import { X, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { DateFormatter, DayPicker } from "react-day-picker"; // Import DayPicker for its types
import { format, parseISO, isValid as isValidDate, add, startOfDay } from 'date-fns';

// Simplified Recurrence Editor Component for Events (can be expanded or shared)
const EventRecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
  startDate: string; // YYYY-MM-DD format from the event form
}> = ({ recurrence, onChange, startDate }) => {
  const [type, setType] = useState(recurrence?.type || ''); // Start empty to enable
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (type && interval > 0) {
      const newRule: RecurrenceRule = { type, interval };
      if (type === 'weekly' && daysOfWeek.length > 0) newRule.daysOfWeek = daysOfWeek;
      else if (type === 'weekly' && startDate) { // Default day of week for weekly if none selected
         const startDay = parseISO(startDate + 'T00:00:00Z').getDay(); // Get day of week from start date
         newRule.daysOfWeek = [startDay];
      }
      if (endDate) newRule.endDate = endDate;
      onChange(newRule);
    } else {
      onChange(undefined); 
    }
  }, [type, interval, daysOfWeek, endDate, onChange, startDate]);

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]);
  };
  
  if (type === '') { // Initial state to enable recurrence
    return <Button variant="outline" size="sm" onClick={() => setType('weekly')} className="w-full input-field text-xs justify-start font-normal"><Repeat className="w-3 h-3 mr-1.5"/>Set Recurrence</Button>
  }

  return (
    <div className="space-y-2 p-3 border border-border-main rounded-md bg-input-bg/50 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => { onChange(undefined); setType(''); }}><X className="w-3 h-3"/></Button>
      </div>
      <Select value={type} onValueChange={(val) => setType(val as RecurrenceRule['type'])}>
        <SelectTrigger className="input-field text-xs h-8"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (on start date's day)</SelectItem>
          <SelectItem value="yearly">Yearly (on start date)</SelectItem>
        </SelectContent>
      </Select>
      <Input type="number" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval" className="input-field text-xs h-8" />
      {type === 'weekly' && (
        <div className="flex space-x-1">
          {weekDays.map((day, i) => (
            <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-[11px] flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
              {day}
            </Button>
          ))}
        </div>
      )}
      <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" title="Recurrence End Date" className="input-field text-xs h-8" />
    </div>
  );
};


interface CalendarFullScreenViewProps {
  events: AppEvent[];
  categories: Category[];
  currentCategory: Category; // This is the project filter, form should use specific category
  onAddEvent: (eventData: Omit<AppEvent, 'id'>) => void;
  onUpdateEvent: (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id'>>) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  category: Category;
  description?: string;
  recurrenceRule?: RecurrenceRule;
}

export function CalendarFullScreenView({
  events, categories, currentCategory, onAddEvent, onUpdateEvent, onDeleteEvent, onClose
}: CalendarFullScreenViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  
  const initialFormCategory = () => {
    if (currentCategory !== "All Projects" && categories.includes(currentCategory)) return currentCategory;
    return categories.length > 0 ? categories[0] : "Personal Life" as Category;
  };

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    category: initialFormCategory(),
    description: '',
    recurrenceRule: undefined,
  });

  useEffect(() => {
    if (selectedDate && !showEventForm && !editingEvent) { // Only update form date if not actively editing/adding
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, 'yyyy-MM-dd'),
        category: initialFormCategory()
      }));
    }
  }, [selectedDate, showEventForm, editingEvent, currentCategory, categories]);


  useEffect(() => {
    if (editingEvent) {
      const eventDateObj = parseISO(editingEvent.date);
      setFormData({
        title: editingEvent.title,
        date: format(eventDateObj, 'yyyy-MM-dd'),
        time: format(eventDateObj, 'HH:mm'),
        category: editingEvent.category,
        description: editingEvent.description || '',
        recurrenceRule: editingEvent.recurrenceRule,
      });
      setShowEventForm(true);
    }
  }, [editingEvent]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as Category }));
  };
  const handleRecurrenceChange = (rule: RecurrenceRule | undefined) => {
    setFormData(prev => ({ ...prev, recurrenceRule: rule}));
  }

  const handleSubmitEvent = () => {
    if (!formData.title || !formData.date || !formData.time) return;
    const dateTimeString = `${formData.date}T${formData.time}:00.000Z`; // Assume local, convert to ISO for storage
    
    const eventData = {
        title: formData.title,
        date: dateTimeString,
        category: formData.category,
        description: formData.description,
        recurrenceRule: formData.recurrenceRule,
    };

    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventData);
    } else {
      onAddEvent(eventData);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      time: '12:00',
      category: initialFormCategory(),
      description: '',
      recurrenceRule: undefined,
    });
  };
  
  const getNextOccurrence = (event: AppEvent, fromDate: Date): Date | null => {
    if (!event.recurrenceRule) return null;
    const rule = event.recurrenceRule;
    let baseDate = startOfDay(parseISO(event.date)); // Start from the event's original start date/time
    let checkDate = startOfDay(fromDate); // Date to find next occurrence after

    if (baseDate > checkDate) { // If base is in future relative to checkDate's start of day, it's the next one
        // Only return if it matches rule if it's a weekly rule and daysOfWeek is set
        if(rule.type === 'weekly' && rule.daysOfWeek && !rule.daysOfWeek.includes(baseDate.getDay())) {
            // continue searching below
        } else {
            return baseDate;
        }
    }
    
    // Simplified calculation - this would be much more complex with rrule.js
    // This basic logic only handles simple daily/weekly for demonstration
    for(let i=0; i< 365; i++) { // Limit search to 1 year
        let next: Date;
        switch(rule.type) {
            case 'daily': 
                next = add(baseDate, { days: rule.interval * i });
                break;
            case 'weekly':
                next = add(baseDate, { weeks: rule.interval * i });
                 // Adjust to the correct day of the week if specified
                if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                    let currentDay = next.getDay();
                    let targetDay = rule.daysOfWeek.find(d => d >= currentDay) ?? rule.daysOfWeek[0];
                    let diff = targetDay - currentDay;
                    if (diff < 0 && i === 0 && baseDate <= checkDate) { // If first week and target day passed for baseDate
                        // Try next week's first available day
                         next = add(next, {days: 7 - currentDay + rule.daysOfWeek[0]});

                    } else if (diff < 0) { // Target day passed for this iteration
                         next = add(next, {days: (7 - currentDay) + targetDay}); // Go to next week's target day
                    }
                     else {
                        next = add(next, { days: diff });
                    }
                }
                break;
            // Basic monthly/yearly - just add interval months/years
            case 'monthly': next = add(baseDate, { months: rule.interval * i}); break;
            case 'yearly': next = add(baseDate, { years: rule.interval * i}); break;
            default: return null;
        }
        next = startOfDay(next); // Compare day-granularity

        if(next > checkDate) { // Must be strictly after the fromDate's start of day
             if (rule.endDate && next > startOfDay(parseISO(rule.endDate))) return null; // Past end date
            return next;
        }
    }
    return null;
  };


  const DayCellContent: DateFormatter = useCallback((day, options, { locale }) => {
    const dayStart = startOfDay(day);
    let hasBaseEvent = false;
    let hasRecurringInstance = false;

    events.forEach(event => {
        const eventBaseDate = startOfDay(parseISO(event.date));
        if (eventBaseDate.getTime() === dayStart.getTime()) {
            hasBaseEvent = true;
        }
        if (event.recurrenceRule) {
            const next = getNextOccurrence(event, add(dayStart, {days: -1})); // Check if next occurrence falls on 'day'
            if (next && startOfDay(next).getTime() === dayStart.getTime()) {
                hasRecurringInstance = true;
            }
        }
    });

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {format(day, "d", { locale })}
        {(hasBaseEvent || hasRecurringInstance) && (
          <span className={cn(
              "absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full",
              hasBaseEvent && hasRecurringInstance ? "bg-gradient-to-r from-primary to-destructive" :
              hasBaseEvent ? "bg-primary" : 
              "bg-primary/50" // Recurring instance only
          )} />
        )}
      </div>
    );
  }, [events]);
  
  const eventsForSelectedDay = selectedDate ? events.flatMap(event => {
    const eventDateObj = parseISO(event.date);
    const selectedDayStart = startOfDay(selectedDate);
    const eventDayStart = startOfDay(eventDateObj);
    
    const results: AppEvent[] = [];
    if (eventDayStart.getTime() === selectedDayStart.getTime()) {
        results.push(event); // Original event instance
    }
    // Check for recurring instances on selectedDate
    if (event.recurrenceRule) {
        const next = getNextOccurrence(event, add(selectedDayStart, {days: -1}));
        if (next && startOfDay(next).getTime() === selectedDayStart.getTime()) {
            // Create a synthetic event for this occurrence
            // This might be the same as the base event if it's the first occurrence
            if (eventDayStart.getTime() !== selectedDayStart.getTime()) { // Avoid duplicating if base matches
                results.push({
                    ...event,
                    date: format(selectedDate, 'yyyy-MM-dd') + 'T' + format(eventDateObj, 'HH:mm:ss.SSS') + 'Z', // Keep original time
                    // id: `${event.id}-clone-${format(selectedDate, 'yyyyMMdd')}` // Synthetic ID if needed for keys
                });
            }
        }
    }
    return results;

  }).filter((event, index, self) => index === self.findIndex((e) => e.id === event.id && e.date === event.date)) // Deduplicate
  .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];


  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" 
    )}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-3xl accent-text">Calendar</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
                <X className="w-7 h-7" />
            </Button>
        </div>

        <div className="flex-grow flex gap-6 overflow-hidden">
            <div className="w-2/3 lg:w-3/4 bg-widget-background border border-border-main rounded-md p-6 flex flex-col items-center justify-start custom-scrollbar-fullscreen">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={viewMonth}
                    onMonthChange={setViewMonth}
                    className="w-full max-w-2xl" 
                    classNames={{
                        root: "w-full", 
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center h-10 mb-2",
                        caption_label: "text-xl font-orbitron accent-text",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
                            "rounded-md hover:bg-accent/20 text-muted-foreground hover:text-accent-foreground transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full mb-1",
                        head_cell: "text-muted-foreground rounded-md w-[14.28%] text-xs font-medium p-1 h-8 justify-center",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative w-[14.28%] h-16 sm:h-20 focus-within:relative focus-within:z-20",
                        day: cn(
                            "w-full h-full p-0 font-normal rounded-md",
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "transition-colors"
                        ),
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground ring-1 ring-primary/60",
                        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50 pointer-events-none",
                    }}
                    components={{
                        IconLeft: ({ ...props }) => <ChevronLeft {...props} className="h-5 w-5" />,
                        IconRight: ({ ...props }) => <ChevronRight {...props} className="h-5 w-5" />,
                    }}
                    formatters={{ formatDay: DayCellContent }}
                    showOutsideDays
                    fixedWeeks
                />
            </div>

            <div className="w-1/3 lg:w-1/4 bg-widget-background border border-border-main rounded-md p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar-fullscreen">
                <Button onClick={() => { setEditingEvent(null); setShowEventForm(true); }} className="w-full btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2"/> Add Event
                </Button>

                {showEventForm && (
                    <div className="p-3 border border-border-main rounded-md bg-input-bg/70 space-y-3">
                        <h3 className="font-orbitron text-lg accent-text">{editingEvent ? 'Edit Event' : 'New Event'}</h3>
                        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} className="input-field"/>
                        <div className="flex gap-2">
                            <Input name="date" type="date" value={formData.date} onChange={handleInputChange} className="input-field"/>
                            <Input name="time" type="time" value={formData.time} onChange={handleInputChange} className="input-field"/>
                        </div>
                        <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="input-field"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main">
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Textarea name="description" placeholder="Description (optional)" value={formData.description || ''} onChange={handleInputChange} className="input-field min-h-[60px]"/>
                        <EventRecurrenceEditor recurrence={formData.recurrenceRule} onChange={handleRecurrenceChange} startDate={formData.date}/>
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSubmitEvent} className="flex-grow btn-primary">{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
                            <Button variant="outline" onClick={resetForm} className="border-border-main text-muted-foreground hover:bg-background">Cancel</Button>
                        </div>
                    </div>
                )}

                {!showEventForm && selectedDate && (
                    <div>
                        <h3 className="font-orbitron text-lg accent-text mb-2">
                            Events for: {format(selectedDate, 'MMM d, yyyy')}
                        </h3>
                        {eventsForSelectedDay.length > 0 ? (
                            <ul className="space-y-2">
                                {eventsForSelectedDay.map((event, idx) => ( // Using idx for key if synthetic events don't have unique ID
                                    <li key={event.id + '-' + idx} className="p-2.5 bg-input-bg/70 border border-border-main rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(parseISO(event.date), 'p')} - {event.category}
                                                    {event.recurrenceRule && <Repeat className="w-3 h-3 inline ml-1.5 text-muted-foreground/70"/>}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingEvent(events.find(e=>e.id === event.id) || event) }} className="btn-icon w-6 h-6"><Edit className="w-3.5 h-3.5"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => onDeleteEvent(event.id)} className="btn-icon danger w-6 h-6"><Trash2 className="w-3.5 h-3.5"/></Button>
                                            </div>
                                        </div>
                                        {event.description && <p className="text-xs text-foreground mt-1 pt-1 border-t border-border-main/50 whitespace-pre-wrap">{event.description}</p>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No events for this day.</p>
                        )}
                    </div>
                )}
                 {!showEventForm && !selectedDate && (
                    <p className="text-sm text-muted-foreground text-center py-4">Select a date to see events.</p>
                )}
            </div>
        </div>
    </div>
  );
}
```

## src/components/dashboard/DueSoonWidget.tsx
```typescript
import React from 'react';
import { Task, Event as AppEvent } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';
import { format, parseISO, addDays, startOfDay, isSameDay, isTomorrow as dateFnsIsTomorrow } from 'date-fns';

// Helper to get next occurrence for summary
const getNextOccurrenceForSummary = (item: Task | AppEvent, fromDate: Date = new Date()): Date | null => {
  const baseItemDate = item.dueDate ? parseISO(item.dueDate) : parseISO(item.date); // Task has dueDate, Event has date
  if (!item.recurrenceRule) {
    return startOfDay(baseItemDate) >= startOfDay(fromDate) ? baseItemDate : null;
  }

  const rule = item.recurrenceRule;
  let checkDate = startOfDay(baseItemDate); // Start from the item's original start date/time
  
  if (checkDate >= startOfDay(fromDate)) {
     // If rule is weekly, check if baseDate's day is in daysOfWeek, if not, find first valid day from baseDate
     if(rule.type === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length > 0 && !rule.daysOfWeek.includes(checkDate.getDay())) {
        // Find next valid day based on rule starting from checkDate
        for(let i = 0; i < 7; i++) { // Check next 7 days
            let futureDay = addDays(checkDate, i);
            if(rule.daysOfWeek.includes(futureDay.getDay())) {
                if(rule.endDate && futureDay > parseISO(rule.endDate)) return null;
                return futureDay;
            }
        }
        // If no day found in current week, it means we need to advance to next interval. Handled by loop below.
     } else {
        if(rule.endDate && checkDate > parseISO(rule.endDate)) return null;
        return checkDate; // Base date itself is a valid upcoming or current occurrence
     }
  }
  
  // Search for next occurrence after fromDate
  for(let i=0; i < (rule.count || 365); i++) { // Limit search
      let next: Date;
      switch(rule.type) {
          case 'daily': 
              next = addDays(checkDate, rule.interval * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) ); // ensure we are looking forward
              break;
          case 'weekly':
              next = addDays(checkDate, (rule.interval * 7 * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) ));
              if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                  let currentDay = next.getDay();
                  let targetDay = rule.daysOfWeek.find(d => d >= currentDay) ?? rule.daysOfWeek[0];
                  let diff = targetDay - currentDay;
                  if (diff < 0) { // Target day passed for this iteration
                      next = addDays(next, (7 - currentDay) + targetDay); // Go to next week's target day
                  } else {
                      next = addDays(next, diff);
                  }
              }
              break;
          case 'monthly': next = add(checkDate, { months: rule.interval * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) }); break;
          case 'yearly': next = add(checkDate, { years: rule.interval * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) }); break;
          default: return null;
      }
      next = startOfDay(next);

      if(next >= startOfDay(fromDate)) {
          if (rule.endDate && next > startOfDay(parseISO(rule.endDate))) return null;
          return next;
      }
      checkDate = next; // Update checkDate for next iteration, ensures we move forward from the found date
  }
  return null;
};


interface DueSoonWidgetProps {
  tasks?: Task[];
  events?: AppEvent[];
  currentProjectId: string | null;
  onNavigateToItem: (type: 'tasks' | 'calendar', id: string) => void;
}

export function DueSoonWidget({ tasks = [], events = [], currentProjectId, onNavigateToItem }: DueSoonWidgetProps) {
  const upcomingItems: { type: 'Task' | 'Event'; name: string; date: Date; id: string; isToday: boolean; isTomorrow: boolean; originalCategory: string; }[] = [];
  const today = startOfDay(new Date());
  const tomorrow = startOfDay(addDays(today, 1));
  const endOfThreeDays = startOfDay(addDays(today, 3)); // Include today, tomorrow, and day after tomorrow

  const processItems = <T extends Task | AppEvent>(
    items: T[],
    itemType: 'Task' | 'Event'
  ) => {
    items
      .filter(item => {
        if (itemType === 'Task' && (item as Task).completed) return false;
        return (currentProjectId === null || item.category === currentProjectId);
      })
      .forEach(item => {
        const itemDateStr = itemType === 'Task' ? (item as Task).dueDate : (item as AppEvent).date;
        if (!itemDateStr) return;

        let nextOccurrenceDate = getNextOccurrenceForSummary(item, today);
        
        if (nextOccurrenceDate && nextOccurrenceDate < endOfThreeDays) {
          upcomingItems.push({
            type: itemType,
            name: itemType === 'Task' ? (item as Task).text : (item as AppEvent).title,
            date: nextOccurrenceDate,
            id: item.id,
            isToday: isSameDay(nextOccurrenceDate, today),
            isTomorrow: dateFnsIsTomorrow(nextOccurrenceDate),
            originalCategory: item.category,
          });
        }
      });
  };

  if (Array.isArray(tasks)) processItems(tasks, 'Task');
  if (Array.isArray(events)) processItems(events, 'Event');
  
  // Deduplicate if recurring item's next occurrence is same as another unique item on same day
  const uniqueUpcomingItems = upcomingItems.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.id === item.id && t.type === item.type && t.date.getTime() === item.date.getTime()
    ))
  );


  uniqueUpcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());
  const displayedItems = uniqueUpcomingItems.slice(0, 5); // Show up to 5

  return (
    <DashboardCardWrapper 
        title="DUE SOON" 
        allowExpand={false} // This widget summarizes, click items to navigate
        className="lg:col-span-2" // Assuming it takes more space
        id="due-soon-widget-summary"
        contentClassName="space-y-2"
    >
      {displayedItems.length > 0 ? (
        <ul className="space-y-2">
          {displayedItems.map(item => {
            let dateString = format(item.date, 'EEE, MMM d');
            if (item.isToday) dateString = "Today";
            else if (item.isTomorrow) dateString = "Tomorrow";
            
            return (
              <li 
                key={`${item.type}-${item.id}-${item.date.toISOString()}`} 
                className={cn(
                  "widget-item cursor-pointer", // Make it clickable
                  item.isToday ? "bg-amber-500/10 !border-l-amber-400" : "!border-l-sky-400/50"
                )}
                onClick={() => onNavigateToItem(item.type === 'Task' ? 'tasks' : 'calendar', item.id)}
                title={`${item.type}: ${item.name} - ${dateString} (${item.originalCategory})`}
              >
                <div className="flex justify-between items-center">
                    <p className="text-sm truncate flex-grow" >{item.type}: {item.name}</p>
                    <p className="text-xs text-muted-foreground shrink-0 ml-2">{dateString}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground p-2 text-center">Nothing due in the next 3 days.</p>
      )}
    </DashboardCardWrapper>
  );
}
```

## src/components/dashboard/CalendarWidget.tsx
```typescript
"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar"; // Renamed to avoid conflict
import { cn } from '@/lib/utils';
import { Event as AppEvent } from '@/types';
import { format, parseISO, startOfDay, addDays, isSameDay } from 'date-fns';

interface CalendarWidgetProps {
  events: AppEvent[];
  onNavigate: () => void;
}

const getNextOccurrenceForCalendarDot = (event: AppEvent, day: Date): boolean => {
    if (!event.recurrenceRule) {
      return isSameDay(parseISO(event.date), day);
    }
  
    const rule = event.recurrenceRule;
    let baseEventDate = startOfDay(parseISO(event.date));
    let currentDay = startOfDay(day);
  
    if (baseEventDate > currentDay) return false; // Recurrence hasn't started yet for this day
    if (rule.endDate && currentDay > startOfDay(parseISO(rule.endDate))) return false; // Recurrence ended
  
    switch (rule.type) {
      case 'daily':
        const diffDays = Math.floor((currentDay.getTime() - baseEventDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays % rule.interval === 0;
      case 'weekly':
        if (!rule.daysOfWeek?.includes(currentDay.getDay())) return false;
        // Check if it's a valid week in the interval
        const weekDiff = Math.floor((currentDay.getTime() - baseEventDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        // This check is simplified; a full rrule lib would be better for complex weekly intervals
        // For simple "every X weeks on day Y", this might work if baseEventDate was also on day Y.
        // A more robust check needed for "every X weeks" if base date isn't on the target day.
        // For this widget, we'll assume a match if the day of week matches and it's on or after base.
        return true; // Simplified for widget
      case 'monthly':
        // Check if the day of the month matches the original event's day of month
        // And if the month interval matches
        if (currentDay.getDate() !== baseEventDate.getDate()) return false;
        const monthDiff = (currentDay.getFullYear() - baseEventDate.getFullYear()) * 12 + (currentDay.getMonth() - baseEventDate.getMonth());
        return monthDiff >= 0 && monthDiff % rule.interval === 0;
      case 'yearly':
        if (currentDay.getDate() !== baseEventDate.getDate() || currentDay.getMonth() !== baseEventDate.getMonth()) return false;
        const yearDiff = currentDay.getFullYear() - baseEventDate.getFullYear();
        return yearDiff >= 0 && yearDiff % rule.interval === 0;
      default:
        return false;
    }
};

const DayCell = ({ date, events }: { date: Date; events: AppEvent[]; }) => {
  const displayDate = date.getDate();
  const showDot = events.some(event => getNextOccurrenceForCalendarDot(event, date));
  return (
    <>
      {displayDate}
      {showDot ? <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary/80 rounded-full" /> : null}
    </>
  );
};

export function CalendarWidget({ events, onNavigate }: CalendarWidgetProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [currentMonthForTitle, setCurrentMonthForTitle] = useState('');

  useEffect(() => {
    const dateToUse = selectedDay || new Date();
    setCurrentMonthForTitle(format(dateToUse, 'MMMM yyyy').toUpperCase());
  }, [selectedDay]);

  return (
    <DashboardCardWrapper 
        title={currentMonthForTitle}
        onNavigate={onNavigate} 
        id="calendar-widget-summary"
        className="min-h-[280px] lg:min-h-[300px] flex flex-col"
        contentClassName="!p-2 flex flex-col flex-grow items-center justify-center"
    >
      <ShadcnCalendar
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        month={selectedDay || new Date()}
        className="p-0 w-full" 
        classNames={{
          months: "flex flex-col items-center",
          month: "space-y-2 w-full", 
          caption: "flex justify-center pt-0.5 relative items-center text-sm mb-1",
          caption_label: "text-sm font-medium accent-text sr-only",
          nav: "space-x-1",
          nav_button: "h-6 w-6 p-0 opacity-0 cursor-default",
          table: "w-full border-collapse", 
          head_row: "flex w-full", 
          head_cell: cn(
            "text-muted-foreground rounded-md",
            "flex items-center justify-center font-normal text-[0.75rem] p-0",
            "h-7 flex-1 basis-0" 
          ),
          row: "flex w-full mt-1", 
          cell: cn(
            "text-center p-0 relative focus-within:relative focus-within:z-20 rounded-md",
            "flex flex-col items-center justify-center",
            "h-9 flex-1 basis-0" 
          ),
          day: cn(
            "h-full w-full p-0 font-normal aria-selected:opacity-100 rounded-md",
            "hover:bg-accent/10 flex items-center justify-center relative text-xs sm:text-sm"
          ),
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "ring-1 ring-primary/60 text-primary rounded-md font-semibold",
          day_outside: "text-muted-foreground/40 opacity-40",
          day_disabled: "text-muted-foreground/30 opacity-30",
        }}
        formatters={{
            formatDay: (date) => <DayCell date={date} events={events} />,
        }}
        showOutsideDays={true}
        numberOfMonths={1}
        disableNavigation
        fixedWeeks
      />
    </DashboardCardWrapper>
  );
}
```

## src/app/page.tsx
```typescript
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react'; 
import { usePathname, useRouter, useSearchParams } from 'next/navigation'; 

import { Header } from '@/components/layout/Header';
import { ProjectSelectorBar } from '@/components/layout/ProjectSelectorBar';
import { FooterChat } from '@/components/layout/FooterChat';
import { AiAssistantWidget } from '@/components/dashboard/AiAssistantWidget';
import { TasksWidget } from '@/components/dashboard/TasksWidget';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { QuickNotesWidget } from '@/components/dashboard/QuickNotesWidget';
import { DueSoonWidget } from '@/components/dashboard/DueSoonWidget';
import { TasksView } from '@/components/views/TasksView';
import { GoalsView } from '@/components/views/GoalsView';
import { NotesView } from '@/components/views/NotesView';
import { CalendarFullScreenView } from '@/components/views/CalendarFullScreenView';
import { Task, Goal, Note, Event as AppEvent, ViewMode, Category, RecurrenceRule, SubTask } from '@/types';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid'; // For client-side ID generation for subtasks

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];
const availableCategoriesForDropdown: Category[] = ["All Projects", ...baseAvailableCategories];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname
  const searchParams = useSearchParams();


  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  
  const [currentCategory, setCurrentCategory] = useState<Category>("All Projects");

  // Filtered states are not strictly necessary if filtering happens directly in child components or renderView
  // But keeping them can be useful if multiple components need the same filtered list.
  // For simplicity here, we'll filter directly where needed or pass all data.

  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Handle deep linking or navigation to specific views/items from search or other sources
  useEffect(() => {
    const view = searchParams.get('view') as ViewMode | null;
    // const itemId = searchParams.get('id'); // Could be used to highlight/scroll to item
    if (view && ['tasks', 'goals', 'notes', 'calendar'].includes(view)) {
      setViewMode(view);
      // Potentially clear search params after use
      // router.replace(pathname, undefined); // Next 13 way to clear query params
    }
  }, [searchParams, router, pathname]);


  useEffect(() => {
    if (status === "loading") return; 
    if (!session && status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${pathname}`); 
    } else if (session && status === "authenticated" && !initialLoadDone) {
      setInitialLoadDone(true); 
    }
  }, [session, status, router, initialLoadDone, pathname]);


  const fetchData = useCallback(async (categorySignal?: Category) => {
    if (status !== "authenticated" && !categorySignal) return; 
    
    setIsLoading(true);
    const categoryToFetch = categorySignal || currentCategory;
    const queryCategory = categoryToFetch === "All Projects" ? "" : `?category=${encodeURIComponent(categoryToFetch)}`;
    
    try {
      const [tasksRes, goalsRes, notesRes, eventsRes] = await Promise.all([
        fetch(`/api/tasks${queryCategory}`),
        fetch(`/api/goals${queryCategory}`),
        fetch(`/api/notes${queryCategory}`),
        fetch(`/api/events${queryCategory}`),
      ]);

      // Basic error check
      const checkOk = (res: Response, name: string) => {
          if(!res.ok) console.error(`Failed to fetch ${name}: ${res.status} ${res.statusText}`);
          return res.ok;
      }
      
      if (checkOk(tasksRes, 'tasks') && checkOk(goalsRes, 'goals') && checkOk(notesRes, 'notes') && checkOk(eventsRes, 'events')) {
        const tasksData = await tasksRes.json();
        const goalsData = await goalsRes.json();
        const notesData = await notesRes.json();
        const eventsData = await eventsRes.json();

        setTasks(tasksData);
        setGoals(goalsData);
        setNotes(notesData);
        setEvents(eventsData);
      } else {
         setAiMessage("Error fetching some data. Dashboard might be incomplete.");
         // Keep stale data or clear, depending on preference
         // setTasks([]); setGoals([]); setNotes([]); setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setAiMessage("Network error fetching data.");
      // setTasks([]); setGoals([]); setNotes([]); setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentCategory, status]); 

  useEffect(() => {
    if (initialLoadDone && status === "authenticated") { 
        fetchData();
    }
  }, [fetchData, initialLoadDone, status]); 


  // Handlers for CRUD operations
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
        fetchData(currentCategory);
        setAiMessage(`Task "${taskData.text.substring(0,30)}..." added.`);
    } else { setAiMessage(`Failed to add task.`); }
  };

  const handleToggleTask = async (taskId: string) => {
    if (status !== "authenticated") return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    if (res.ok) fetchData(currentCategory);
    else setAiMessage("Failed to toggle task.");
  };

  const handleDeleteTask = async (taskId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Task deleted.`); } 
    else { setAiMessage(`Failed to delete task.`); }
  };
  
  const handleUpdateTask = async (taskId: string, taskUpdateData: Partial<Omit<Task, 'id'>>) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskUpdateData),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Task updated.`); } 
    else { setAiMessage(`Failed to update task.`); }
  };

  const handleAddGoal = async (name: string, targetValue: number, unit: string, category: Category) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, currentValue: 0, targetValue, unit, category }),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Goal "${name.substring(0,30)}..." added.`); } 
    else { setAiMessage(`Failed to add goal.`); }
  };

  const handleUpdateGoal = async (goalId: string, currentValue?: number, name?: string, targetValue?: number, unit?: string, categoryProp?: Category) => {
    if (status !== "authenticated") return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const payload: any = { name: name ?? goal.name, unit: unit ?? goal.unit, category: categoryProp ?? goal.category };
    if(targetValue !== undefined) payload.targetValue = targetValue; else payload.targetValue = goal.targetValue;
    if(currentValue !== undefined) payload.currentValue = Math.max(0, Math.min(currentValue, payload.targetValue)); else payload.currentValue = goal.currentValue;

    const res = await fetch(`/api/goals/${goalId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Goal updated.`); } 
    else { setAiMessage(`Failed to update goal.`); }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Goal deleted.`); } 
    else { setAiMessage(`Failed to delete goal.`); }
  };
  
  const handleAddNote = async (title: string | undefined, content: string, category: Category) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/notes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, category }),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Note "${(title || content).substring(0,20)}..." added.`); } 
    else { setAiMessage(`Failed to add note.`); }
  };

  const handleUpdateNote = async (noteId: string, title: string | undefined, content: string, categoryProp?: Category) => {
     if (status !== "authenticated") return;
     const note = notes.find(n => n.id === noteId);
     if (!note) return;
    const res = await fetch(`/api/notes/${noteId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, category: categoryProp || note.category }),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Note updated.`); } 
    else { setAiMessage(`Failed to update note.`); }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Note deleted.`); } 
    else { setAiMessage(`Failed to delete note.`); }
  };

  const handleAddEvent = async (eventData: Omit<AppEvent, 'id'>) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/events', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Event "${eventData.title.substring(0,30)}..." added.`); } 
    else { setAiMessage(`Failed to add event.`); }
  };
  
  const handleUpdateEvent = async (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id'>>) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventUpdateData),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Event updated.`); } 
    else { setAiMessage(`Failed to update event.`); }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Event deleted.`); } 
    else { setAiMessage(`Failed to delete event.`); }
  };

  const handleAiInputCommand = async (command: string) => {
    if (status !== "authenticated") return;
    setIsLoading(true); 
    setAiMessage(`AIDA is processing your command...`); 

    const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, currentCategory }),
    });
    
    setIsLoading(false); // Moved setIsLoading to before fetchData
    if (res.ok) {
        const result = await res.json();
        setAiMessage(result.message || "AI command processed.");
        fetchData(currentCategory); 
    } else {
        const errorResult = await res.json().catch(() => ({message: "AI command failed with an unknown error."})); // Add catch for non-JSON error response
        setAiMessage(errorResult.message || "AI command failed.");
    }
  };

  const onCategoryChange = (category: Category) => {
    setCurrentCategory(category);
    setAiMessage(null); 
  };

  const navigateToItemHandler = (type: 'tasks' | 'calendar' | 'notes' | 'goals', id: string) => {
    setViewMode(type);
    // Future: Could scroll to specific item ID within the view.
    // For now, just opening the view is sufficient.
  };

  const renderView = () => {
    const commonViewProps = {
        categories: baseAvailableCategories,
        currentCategory: (currentCategory === "All Projects" || !baseAvailableCategories.includes(currentCategory)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : currentCategory,
        onClose: () => { setViewMode('dashboard'); setAiMessage(null); },
    };
    
    const dashboardDataProps = {
      tasks: tasks.filter(t => currentCategory === "All Projects" || t.category === currentCategory),
      goals: goals.filter(g => currentCategory === "All Projects" || g.category === currentCategory),
      notes: notes.filter(n => currentCategory === "All Projects" || n.category === currentCategory).sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()),
      events: events.filter(e => currentCategory === "All Projects" || e.category === currentCategory),
    };
    
    switch (viewMode) {
      case 'tasks':
        return <TasksView {...commonViewProps} tasks={tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} onUpdateTask={handleUpdateTask} />;
      case 'goals':
        return <GoalsView {...commonViewProps} goals={goals} onAddGoal={handleAddGoal} onUpdateGoal={handleUpdateGoal} onDeleteGoal={handleDeleteGoal} />;
      case 'notes':
        return <NotesView {...commonViewProps} notes={notes} onAddNote={handleAddNote} onUpdateNote={handleUpdateNote} onDeleteNote={handleDeleteNote} />;
      case 'calendar':
        return <CalendarFullScreenView {...commonViewProps} events={events} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />;
      case 'dashboard':
      default:
        if (isLoading && !initialLoadDone) { // Show loading only on initial full load
            return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p className="text-xl accent-text">Loading Dashboard...</p></div>;
        }
        if (status === "unauthenticated") { 
            return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p className="text-xl accent-text">Redirecting to login...</p></div>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              <div className="lg:row-span-2 flex flex-col gap-5 md:gap-6">
                <AiAssistantWidget message={aiMessage} />
                <TasksWidget 
                    tasks={dashboardDataProps.tasks} 
                    onTaskToggle={handleToggleTask} 
                    onNavigate={() => setViewMode('tasks')} 
                    className="flex-grow"
                />
              </div>
              <div className="flex flex-col space-y-5 md:space-y-6">
                <CalendarWidget events={dashboardDataProps.events} onNavigate={() => setViewMode('calendar')} />
                <DueSoonWidget 
                    tasks={tasks} // Pass all tasks for DueSoon to filter internally based on its logic
                    events={events} // Pass all events
                    currentProjectId={currentCategory === "All Projects" ? null : currentCategory} 
                    onNavigateToItem={navigateToItemHandler}
                />
              </div>
              <GoalsWidget goals={dashboardDataProps.goals} onNavigate={() => setViewMode('goals')} />
              <QuickNotesWidget notes={dashboardDataProps.notes} onNavigate={() => setViewMode('notes')} />
            </div>
        );
    }
  };

  if (status === "loading" && !initialLoadDone) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+0.75rem)] flex justify-center items-center"> 
                <p className="text-xl accent-text">Initializing AYANDA...</p>
            </main>
        </div>
    );
  }
  if (status === "unauthenticated" && (pathname === "/" || !["/login", "/register", "/landing"].includes(pathname))) {
     return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+0.75rem)] flex justify-center items-center"> 
                <p className="text-xl accent-text">Redirecting to login...</p>
            </main>
        </div>
     );
  }

  const showProjectBar = status === "authenticated" && !["/login", "/register", "/landing"].includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {showProjectBar && (
         <ProjectSelectorBar 
            currentCategory={currentCategory}
            onCategoryChange={onCategoryChange}
            availableCategories={availableCategoriesForDropdown}
          />
      )}
      <main 
        className={cn(
            "flex-grow px-6 pb-24",
             // Adjust top padding based on whether project bar and view mode
            viewMode !== 'dashboard' ? "pt-[5rem]" : // Fullscreen views have their own internal top padding
            showProjectBar ? "pt-[calc(5rem+2.875rem+1.5rem)]" : "pt-[calc(5rem+1.5rem)]"
        )}
      >
        {renderView()}
      </main>
      {status === "authenticated" && <FooterChat onSendCommand={handleAiInputCommand} />}
    </div>
  );
}
```
