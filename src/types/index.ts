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



