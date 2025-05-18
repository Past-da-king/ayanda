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
  userId: string; // Added for user ownership
  text: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD format (start date for recurring)
  category: string;
  recurrenceRule?: RecurrenceRule;
  subTasks?: SubTask[];
  createdAt?: string; // Added for sorting consistency
}

export interface Goal {
  id: string;
  userId: string; // Added for user ownership
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string;
}

export interface Note {
  id: string;
  userId: string; // Added for user ownership
  title?: string;
  content: string; // Will store Markdown content
  category: string;
  lastEdited: string; // ISO string
}

export interface Event {
  id:string;
  userId: string; // Added for user ownership
  title: string;
  date: string; // ISO string for the event's date and time (start date/time for recurring)
  duration?: number; // in minutes
  description?: string;
  category: string;
  recurrenceRule?: RecurrenceRule;
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

