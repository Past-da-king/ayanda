

## src/lib/mongodb.ts
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

## src/models/TaskModel.ts
```typescript
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Task as TaskType } from '@/types'; // Using the existing Task type

export interface ITask extends TaskType, Document {}

const TaskSchema: Schema<ITask> = new Schema(
  {
    id: { type: String, required: true, unique: true }, // Retaining UUID from frontend
    text: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
    dueDate: { type: String, required: false }, // YYYY-MM-DD format
    category: { type: String, required: true }, // ProjectId
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Prevent model overwrite in HMR
const TaskModel: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;
```

## src/models/GoalModel.ts
```typescript
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Goal as GoalType } from '@/types';

export interface IGoal extends GoalType, Document {}

const GoalSchema: Schema<IGoal> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    currentValue: { type: Number, required: true, default: 0 },
    targetValue: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const GoalModel: Model<IGoal> = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default GoalModel;
```

## src/models/NoteModel.ts
```typescript
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Note as NoteType } from '@/types';

export interface INote extends NoteType, Document {}

const NoteSchema: Schema<INote> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: false },
    content: { type: String, required: true },
    category: { type: String, required: true },
    lastEdited: { type: String, required: true }, // ISO string
  },
  {
    timestamps: true, // Will add createdAt, updatedAt. lastEdited is specific.
  }
);

const NoteModel: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default NoteModel;
```

## src/models/EventModel.ts
```typescript
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Event as EventType } from '@/types'; // Using Event as AppEvent

export interface IEvent extends EventType, Document {}

const EventSchema: Schema<IEvent> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String, required: true }, // ISO string
    duration: { type: Number, required: false },
    description: { type: String, required: false },
    category: { type: String, required: true },
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
import { Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    const query = category && category !== "All Projects" ? { category } : {};
    const tasks: ITask[] = await TaskModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<Task, 'id' | 'completed'> = await request.json();
    const newTaskData: Task = {
        id: uuidv4(),
        ...body,
        completed: false, // Default completed to false
    };
    const task: ITask = new TaskModel(newTaskData);
    await task.save();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ message: 'Failed to create task', error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/tasks/[id]/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel, { ITask } from '@/models/TaskModel';
import { Task } from '@/types';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Task> = await request.json();
    const updatedTask = await TaskModel.findOneAndUpdate({ id: id }, body, { new: true, runValidators: true });
    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
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

## src/app/api/goals/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoalModel, { IGoal } from '@/models/GoalModel';
import { Goal } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query = category && category !== "All Projects" ? { category } : {};
    const goals: IGoal[] = await GoalModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return NextResponse.json({ message: 'Failed to fetch goals', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<Goal, 'id'> = await request.json();
     const newGoalData: Goal = {
        id: uuidv4(),
        ...body,
    };
    const goal: IGoal = new GoalModel(newGoalData);
    await goal.save();
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Failed to create goal:', error);
    return NextResponse.json({ message: 'Failed to create goal', error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/goals/[id]/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoalModel, { IGoal } from '@/models/GoalModel';
import { Goal } from '@/types';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Goal> = await request.json();
    const updatedGoal = await GoalModel.findOneAndUpdate({ id: id }, body, { new: true, runValidators: true });
    if (!updatedGoal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
    }
    return NextResponse.json(updatedGoal, { status: 200 });
  } catch (error) {
    console.error(`Failed to update goal ${id}:`, error);
    return NextResponse.json({ message: `Failed to update goal ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedGoal = await GoalModel.findOneAndDelete({ id: id });
    if (!deletedGoal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Goal deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete goal ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete goal ${id}`, error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/notes/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NoteModel, { INote } from '@/models/NoteModel';
import { Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query = category && category !== "All Projects" ? { category } : {};
    const notes: INote[] = await NoteModel.find(query).sort({ lastEdited: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json({ message: 'Failed to fetch notes', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<Note, 'id' | 'lastEdited'> = await request.json();
    const newNoteData: Note = {
        id: uuidv4(),
        ...body,
        lastEdited: new Date().toISOString(),
    };
    const note: INote = new NoteModel(newNoteData);
    await note.save();
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Failed to create note:', error);
    return NextResponse.json({ message: 'Failed to create note', error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/notes/[id]/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NoteModel, { INote } from '@/models/NoteModel';
import { Note } from '@/types';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<Note, 'id'>> = await request.json();
    const updateData = {
      ...body,
      lastEdited: new Date().toISOString(), // Always update lastEdited timestamp
    };
    const updatedNote = await NoteModel.findOneAndUpdate({ id: id }, updateData, { new: true, runValidators: true });
    if (!updatedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error(`Failed to update note ${id}:`, error);
    return NextResponse.json({ message: `Failed to update note ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedNote = await NoteModel.findOneAndDelete({ id: id });
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete note ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete note ${id}`, error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/events/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel, { IEvent } from '@/models/EventModel';
import { Event as AppEvent } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query = category && category !== "All Projects" ? { category } : {};
    const events: IEvent[] = await EventModel.find(query).sort({ date: 1 }); // Sort by event date
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ message: 'Failed to fetch events', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<AppEvent, 'id'> = await request.json();
    const newEventData: AppEvent = {
        id: uuidv4(),
        ...body,
    };
    const event: IEvent = new EventModel(newEventData);
    await event.save();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ message: 'Failed to create event', error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/api/events/[id]/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel, { IEvent } from '@/models/EventModel';
import { Event as AppEvent } from '@/types';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<AppEvent> = await request.json();
    const updatedEvent = await EventModel.findOneAndUpdate({ id: id }, body, { new: true, runValidators: true });
    if (!updatedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
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

## src/app/api/projects/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/types';

// For now, projects (categories) are hardcoded as per the initial setup.
// This API route can be expanded later if dynamic project/category management is needed.
// Currently, it will just return the predefined list.
const initialProjectsData: { id: string, name: Category }[] = [
    { id: 'proj_all', name: 'All Projects' }, // Added All Projects for completeness
    { id: 'proj_personal', name: 'Personal Life' },
    { id: 'proj_work', name: 'Work' },
    { id: 'proj_learning', name: 'Studies' }
];

export async function GET(request: NextRequest) {
  try {
    // In a real scenario, you might fetch these from a 'Categories' collection in MongoDB
    const categories: Category[] = initialProjectsData.map(p => p.name);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch projects/categories:', error);
    return NextResponse.json({ message: 'Failed to fetch projects/categories', error: (error as Error).message }, { status: 500 });
  }
}

// POST might be used to add a new category dynamically if needed.
// For now, we'll assume categories are managed elsewhere or are static.
/*
export async function POST(request: NextRequest) {
  // Example: Add a new category to a 'Categories' collection
  // await dbConnect();
  // const { name } = await request.json();
  // const newCategory = new CategoryModel({ name });
  // await newCategory.save();
  // return NextResponse.json(newCategory, { status: 201 });
  return NextResponse.json({ message: 'Project creation not implemented yet' }, { status:501});
}
*/
```

## src/lib/gemini.ts
```typescript
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
```

## src/app/api/ai/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { processWithGemini, GeminiResponse } from '@/lib/gemini';
import { Category, Task, Note, Goal, Event as AppEvent } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import NoteModel from '@/models/NoteModel';
import GoalModel from '@/models/GoalModel';
import EventModel from '@/models/EventModel';

// This should ideally come from a dynamic source or be more robustly managed
const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];


export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { command, currentCategory } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ message: 'Command is required and must be a string.' }, { status: 400 });
    }
    if (!currentCategory || typeof currentCategory !== 'string') {
      return NextResponse.json({ message: 'currentCategory is required and must be a string.' }, { status: 400 });
    }

    const geminiResult: GeminiResponse = await processWithGemini(command, currentCategory as Category, ["All Projects", ...baseAvailableCategories]);

    if (geminiResult.action === 'unknown' || geminiResult.error) {
      return NextResponse.json({ message: 'AI could not process the command.', details: geminiResult.payload.error || "Unknown error from AI.", originalCommand: command }, { status: 422 });
    }

    let createdItem: any = null;
    const payloadCategory = geminiResult.payload.category || currentCategory;
    const effectiveCategory = (payloadCategory === "All Projects" && baseAvailableCategories.length > 0) ? baseAvailableCategories[0] : payloadCategory;


    switch (geminiResult.action) {
      case 'addTask':
        if (!geminiResult.payload.text) return NextResponse.json({ message: 'Task text is missing from AI response.' }, { status: 422 });
        const newTaskData: Task = {
          id: uuidv4(),
          text: geminiResult.payload.text!,
          completed: false,
          dueDate: geminiResult.payload.dueDate as string | undefined,
          category: effectiveCategory,
        };
        createdItem = new TaskModel(newTaskData);
        await createdItem.save();
        break;
      
      case 'addNote':
        if (!geminiResult.payload.content) return NextResponse.json({ message: 'Note content is missing from AI response.' }, { status: 422 });
        const newNoteData: Note = {
          id: uuidv4(),
          title: geminiResult.payload.title as string | undefined,
          content: geminiResult.payload.content!,
          category: effectiveCategory,
          lastEdited: new Date().toISOString(),
        };
        createdItem = new NoteModel(newNoteData);
        await createdItem.save();
        break;

      case 'addGoal':
        if (!geminiResult.payload.name || geminiResult.payload.targetValue === undefined || !geminiResult.payload.unit) {
            return NextResponse.json({ message: 'Goal name, targetValue, or unit is missing from AI response.' }, { status: 422 });
        }
        const newGoalData: Goal = {
          id: uuidv4(),
          name: geminiResult.payload.name!,
          currentValue: (geminiResult.payload as Goal).currentValue || 0,
          targetValue: geminiResult.payload.targetValue!,
          unit: geminiResult.payload.unit!,
          category: effectiveCategory,
        };
        createdItem = new GoalModel(newGoalData);
        await createdItem.save();
        break;
        
      case 'addEvent':
        if (!geminiResult.payload.title || !geminiResult.payload.date) {
             return NextResponse.json({ message: 'Event title or date is missing from AI response.' }, { status: 422 });
        }
        const newEventData: AppEvent = {
            id: uuidv4(),
            title: geminiResult.payload.title!,
            date: geminiResult.payload.date!, // Should be ISO string from Gemini
            description: geminiResult.payload.description as string | undefined,
            category: effectiveCategory,
        };
        createdItem = new EventModel(newEventData);
        await createdItem.save();
        break;

      default:
        return NextResponse.json({ message: `Action '${geminiResult.action}' not supported or understood.`, originalCommand: command, aiResponse: geminiResult }, { status: 400 });
    }

    return NextResponse.json({ message: `${geminiResult.action} successful!`, item: createdItem, originalCommand: command, aiResponse: geminiResult.payload }, { status: 201 });

  } catch (error) {
    console.error('Error in AI command processing API:', error);
    return NextResponse.json({ message: 'Failed to process AI command.', error: (error as Error).message }, { status: 500 });
  }
}
```

## src/app/page.tsx
```typescript
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { ProjectSelectorBar } from '@/components/layout/ProjectSelectorBar';
import { FooterChat } from '@/components/layout/FooterChat';
import { TasksWidget } from '@/components/dashboard/TasksWidget';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { QuickNotesWidget } from '@/components/dashboard/QuickNotesWidget';
import { DueSoonWidget } from '@/components/dashboard/DueSoonWidget';
import { TasksView } from '@/components/views/TasksView';
import { GoalsView } from '@/components/views/GoalsView';
import { NotesView } from '@/components/views/NotesView';
import { CalendarFullScreenView } from '@/components/views/CalendarFullScreenView';
import { Task, Goal, Note, Event as AppEvent, ViewMode, Category } from '@/types';
import { cn } from '@/lib/utils';

// Define base categories; "All Projects" is handled specially in UI
const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];
const availableCategoriesForDropdown: Category[] = ["All Projects", ...baseAvailableCategories];

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  
  const [currentCategory, setCurrentCategory] = useState<Category>("All Projects");

  // Derived states for filtered data (used by dashboard widgets)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AppEvent[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (categorySignal?: Category) => {
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

      if (!tasksRes.ok || !goalsRes.ok || !notesRes.ok || !eventsRes.ok) {
        console.error('Failed to fetch data:', { 
            tasks: tasksRes.statusText, 
            goals: goalsRes.statusText,
            notes: notesRes.statusText,
            events: eventsRes.statusText
        });
        // Potentially set an error state here to show in UI
        setTasks([]); setGoals([]); setNotes([]); setEvents([]); // Clear data on error
      } else {
        const tasksData = await tasksRes.json();
        const goalsData = await goalsRes.json();
        const notesData = await notesRes.json();
        const eventsData = await eventsRes.json();

        setTasks(tasksData);
        setGoals(goalsData);
        setNotes(notesData);
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setTasks([]); setGoals([]); setNotes([]); setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentCategory]); // Include currentCategory to refetch when it changes

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData is memoized with currentCategory

  // Update filtered data for dashboard widgets whenever master data or currentCategory changes
  useEffect(() => {
    const isAllProjects = currentCategory === "All Projects";
    setFilteredTasks(
        tasks
            .filter(t => isAllProjects || t.category === currentCategory)
            .sort((a,b) => (a.completed ? 1 : -1) || (a.dueDate && b.dueDate ? new Date(a.dueDate+"T00:00:00Z").getTime() - new Date(b.dueDate+"T00:00:00Z").getTime() : (a.dueDate ? -1 : (b.dueDate ? 1 : 0))))
    );
    setFilteredGoals(goals.filter(g => isAllProjects || g.category === currentCategory));
    setFilteredNotes(notes.filter(n => isAllProjects || n.category === currentCategory).sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()));
    setFilteredEvents(events.filter(e => isAllProjects || e.category === currentCategory));
  }, [tasks, goals, notes, events, currentCategory]);


  // --- CRUD Handlers ---
  const handleAddTask = async (text: string, dueDate: string | undefined, category: Category) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, dueDate, category: effectiveCategory }),
    });
    if (res.ok) fetchData(currentCategory); // Refetch relevant data
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleDeleteTask = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    if (res.ok) fetchData(currentCategory);
  };
  
  const handleUpdateTask = async (taskId: string, newText: string, newDueDate?: string, newCategory?: Category) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText, dueDate: newDueDate, category: newCategory || task.category }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleAddGoal = async (name: string, targetValue: number, unit: string, category: Category) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, currentValue: 0, targetValue, unit, category: effectiveCategory }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleUpdateGoal = async (goalId: string, currentValue?: number, name?: string, targetValue?: number, unit?: string, category?: Category) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const currentTgt = targetValue ?? goal.targetValue;
    const updatedCurrentValue = currentValue !== undefined ? Math.max(0, Math.min(currentValue, currentTgt)) : goal.currentValue;

    const res = await fetch(`/api/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          currentValue: updatedCurrentValue, 
          name: name ?? goal.name, 
          targetValue: currentTgt, 
          unit: unit ?? goal.unit, 
          category: category ?? goal.category 
      }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleDeleteGoal = async (goalId: string) => {
    const res = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
    if (res.ok) fetchData(currentCategory);
  };
  
  const handleAddNote = async (title: string | undefined, content: string, category: Category) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category: effectiveCategory }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleUpdateNote = async (noteId: string, title: string | undefined, content: string, category?: Category) => {
     const note = notes.find(n => n.id === noteId);
     if (!note) return;
    const res = await fetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category: category || note.category }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleDeleteNote = async (noteId: string) => {
    const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    if (res.ok) fetchData(currentCategory);
  };

  const handleAddEvent = async (title: string, date: string, category: Category, description?: string) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date, category: effectiveCategory, description }),
    });
    if (res.ok) fetchData(currentCategory);
  };
  
  const handleUpdateEvent = async (eventId: string, title: string, date: string, category: Category, description?: string) => {
    const res = await fetch(`/api/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date, category, description }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleDeleteEvent = async (eventId: string) => {
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) fetchData(currentCategory);
  };

  const handleAiInputCommand = async (command: string) => {
    const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, currentCategory }),
    });
    if (res.ok) {
        const result = await res.json();
        console.log("AI Command result:", result);
        fetchData(currentCategory); // Refetch data after AI command potentially adds something
    } else {
        const errorResult = await res.json();
        console.error("AI Command failed:", errorResult);
        // Optionally show an error message to the user
    }
  };

  const onCategoryChange = (category: Category) => {
    setCurrentCategory(category);
    // Fetch data will be called by the useEffect watching currentCategory
  };

  const renderView = () => {
    const commonViewProps = {
        categories: baseAvailableCategories,
        currentCategory: (currentCategory === "All Projects" || !baseAvailableCategories.includes(currentCategory)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : currentCategory,
        onClose: () => setViewMode('dashboard'),
    };
    
    // Use all data for views, filtering is handled inside the view components or by their API calls
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
        if (isLoading) {
            return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p className="text-xl accent-text">Loading Dashboard...</p></div>;
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <div className="lg:row-span-2">
                <TasksWidget tasks={filteredTasks} onTaskToggle={handleToggleTask} onNavigate={() => setViewMode('tasks')} />
            </div>
            <div className="flex flex-col space-y-5 md:space-y-6">
              <CalendarWidget events={filteredEvents} onNavigate={() => setViewMode('calendar')} />
              {/* For DueSoonWidget, pass all tasks/events and let it filter by its own date logic + currentProjectId */}
              <DueSoonWidget tasks={tasks} events={events} currentProjectId={currentCategory === "All Projects" ? null : currentCategory} />
            </div>
            <GoalsWidget goals={filteredGoals} onNavigate={() => setViewMode('goals')} />
            <QuickNotesWidget notes={filteredNotes} onNavigate={() => setViewMode('notes')} />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ProjectSelectorBar 
        currentCategory={currentCategory}
        onCategoryChange={onCategoryChange}
        availableCategories={availableCategoriesForDropdown}
      />
      <main 
        className={cn(
            "flex-grow px-6 pb-24",
            viewMode === 'dashboard' ? "pt-[calc(5rem+2.875rem+1.5rem)]" : "pt-0" 
        )}
      >
        {renderView()}
      </main>
      <FooterChat onSendCommand={handleAiInputCommand} />
    </div>
  );
}
```