
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
  userId: string;
  text: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD format (start date for recurring)
  category: string;
  recurrenceRule?: RecurrenceRule;
  subTasks?: SubTask[];
  createdAt?: string; // Mongoose adds this as Date, will be string in JSON
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string;
  createdAt?: string; // Added for consistency if needed for sorting
}

export interface Note {
  id: string;
  userId: string;
  title?: string;
  content: string; // Will store Markdown content
  category: string;
  lastEdited: string; // ISO string (Mongoose 'updatedAt' can serve this role too)
  createdAt?: string; // Added for consistency
}

export interface Event {
  id:string;
  userId: string;
  title: string;
  date: string; // ISO string for the event's date and time
  duration?: number; // in minutes
  description?: string;
  category: string;
  recurrenceRule?: RecurrenceRule;
  createdAt?: string; // Added for consistency
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
  path: string;
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
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query: any = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const events: IEvent[] = await EventModel.find(query).sort({ date: 1 });
    return NextResponse.json(events, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ message: 'Failed to fetch events', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const body: Omit<AppEvent, 'id' | 'userId' | 'createdAt'> & { recurrenceRule?: RecurrenceRule } = await request.json();
    const newEventData: AppEvent = {
        id: uuidv4(),
        userId: userId,
        title: body.title,
        date: body.date,
        duration: body.duration,
        description: body.description,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
        // createdAt will be added by Mongoose timestamps
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
## src/app/api/notes/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NoteModel, { INote } from '@/models/NoteModel';
import { Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query: any = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const notes: INote[] = await NoteModel.find(query).sort({ lastEdited: -1 });
    return NextResponse.json(notes, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json({ message: 'Failed to fetch notes', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const body: Omit<Note, 'id' | 'lastEdited' | 'userId' | 'createdAt'> = await request.json();
    const newNoteData: Note = {
        id: uuidv4(),
        userId: userId,
        title: body.title,
        content: body.content,
        category: body.category,
        lastEdited: new Date().toISOString(),
        // createdAt will be added by Mongoose timestamps
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
## src/app/api/tasks/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel, { ITask } from '@/models/TaskModel';
import { Task, RecurrenceRule, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    const query: any = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const tasks: ITask[] = await TaskModel.find(query).sort({ dueDate: 1, createdAt: -1 });
    return NextResponse.json(tasks, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const body: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt'> & { subTasks?: SubTask[], recurrenceRule?: RecurrenceRule } = await request.json();
    
    const newSubTasks = (body.subTasks || []).map(sub => ({ ...sub, id: sub.id || uuidv4() }));

    const newTaskData: Omit<Task, 'id'> & {userId: string} = { // Ensure type matches what model expects for creation
        userId: userId,
        text: body.text,
        completed: false,
        dueDate: body.dueDate,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
        subTasks: newSubTasks,
        // createdAt will be added by Mongoose timestamps
    };
    // Construct with id for type-safety with Task, but Mongoose will handle its _id
    const taskToSave : Task = {id: uuidv4(), ...newTaskData};
    const task: ITask = new TaskModel(taskToSave);
    await task.save();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create task', error: (error as Error).message }, { status: 500 });
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
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query: any = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const goals: IGoal[] = await GoalModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(goals, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return NextResponse.json({ message: 'Failed to fetch goals', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const body: Omit<Goal, 'id' | 'userId' | 'createdAt'> = await request.json();
     const newGoalData: Goal = {
        id: uuidv4(),
        userId: userId,
        name: body.name,
        currentValue: body.currentValue,
        targetValue: body.targetValue,
        unit: body.unit,
        category: body.category,
        // createdAt will be added by Mongoose timestamps
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
import { v4 as uuidv4 } from 'uuid';

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];
const availableCategoriesForDropdown: Category[] = ["All Projects", ...baseAvailableCategories];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  
  const [currentCategory, setCurrentCategory] = useState<Category>("All Projects");

  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  useEffect(() => {
    const view = searchParams.get('view') as ViewMode | null;
    if (view && ['tasks', 'goals', 'notes', 'calendar'].includes(view)) {
      setViewMode(view);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "loading") return; 
    if (!session && status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${pathname}`); 
    } else if (session && status === "authenticated" && !initialLoadDone) {
      setInitialLoadDone(true); 
    }
  }, [session, status, router, initialLoadDone, pathname]);

  const fetchData = useCallback(async (categorySignal?: Category) => {
    if (status !== "authenticated") return; 
    
    console.log(`Fetching data for categorySignal: ${categorySignal}, currentCategoryState: ${currentCategory}, status: ${status}`);
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

      const checkOk = (res: Response, name: string) => {
          if(!res.ok) console.error(`Failed to fetch ${name}: ${res.status} ${res.statusText} - ${res.url}`);
          return res.ok;
      }
      
      if (checkOk(tasksRes, 'tasks') && checkOk(goalsRes, 'goals') && checkOk(notesRes, 'notes') && checkOk(eventsRes, 'events')) {
        const tasksData = await tasksRes.json();
        const goalsData = await goalsRes.json();
        const notesData = await notesRes.json();
        const eventsData = await eventsRes.json();

        console.log('Fetched Tasks:', tasksData);
        console.log('Fetched Goals:', goalsData);
        console.log('Fetched Notes:', notesData);
        console.log('Fetched Events:', eventsData);

        setTasks(tasksData);
        setGoals(goalsData);
        setNotes(notesData);
        setEvents(eventsData);
      } else {
         setAiMessage("Error fetching some data. Dashboard might be incomplete.");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setAiMessage("Network error fetching data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentCategory, status]); 

  useEffect(() => {
    if (initialLoadDone && status === "authenticated") { 
        fetchData();
    }
  }, [fetchData, initialLoadDone, status]); 

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt'>) => {
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
  
  const handleUpdateTask = async (taskId: string, taskUpdateData: Partial<Omit<Task, 'id' | 'userId'>>) => {
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

  const handleAddEvent = async (eventData: Omit<AppEvent, 'id' | 'userId' | 'createdAt'>) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/events', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Event "${eventData.title.substring(0,30)}..." added.`); } 
    else { setAiMessage(`Failed to add event.`); }
  };
  
  const handleUpdateEvent = async (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id' | 'userId'>>) => {
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
    
    if (res.ok) {
        const result = await res.json();
        setAiMessage(result.message || "AI command processed.");
        fetchData(currentCategory); 
    } else {
        const errorResult = await res.json().catch(() => ({message: "AI command failed with an unknown error."}));
        setAiMessage(errorResult.message || "AI command failed.");
    }
    setIsLoading(false);
  };

  const onCategoryChange = (category: Category) => {
    setCurrentCategory(category);
    // No longer set initialLoadDone to false here, let fetchData handle its own loading state
    // and rely on the useEffect for [fetchData, initialLoadDone, status] or direct calls.
    setAiMessage(null); 
  };

  const navigateToItemHandler = (type: 'tasks' | 'calendar' | 'notes' | 'goals', id: string) => {
    setViewMode(type);
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
        if (isLoading && !initialLoadDone) {
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
                    tasks={tasks} 
                    events={events} 
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
            viewMode !== 'dashboard' ? "pt-[5rem]" : 
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
