import { User as NextAuthUser } from 'next-auth';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD format
  category: string; // This is used like projectId
}

export interface Goal {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string; // This is used like projectId
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  category: string; // This is used like projectId
  lastEdited: string; // ISO string
}

export interface Event {
  id: string;
  title: string; 
  date: string; // ISO string for the event's date and time
  duration?: number; 
  description?: string; 
  category: string; 
}


export type ViewMode = "dashboard" | "tasks" | "goals" | "notes" | "calendar";

export type Category = "All Projects" | "Personal Life" | "Work" | "Studies";

// For NextAuth session and JWT
export interface AuthenticatedUser extends NextAuthUser {
  id: string;
  email: string;
  name?: string | null;
}
