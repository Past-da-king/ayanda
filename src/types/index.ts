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
  category: string; // This will now be Project['name']
  recurrenceRule?: RecurrenceRule;
  subTasks?: SubTask[];
  createdAt?: string; // Mongoose adds this as Date, will be string in JSON
  linkedGoalId?: string; // ID of the Goal this task contributes to
  contributionValue?: number; // How much this task contributes to the linked goal
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetValue: number;
  unit: string;
  category: string; // This will now be Project['name']
  createdAt?: string; 
  currentValue?: number; // Transient property for calculated value
}

export interface Note {
  id: string;
  userId: string;
  title?: string;
  content: string; 
  category: string; // This will now be Project['name']
  lastEdited: string; // ISO string 
  createdAt?: string; 
}

export interface Event {
  id:string;
  userId: string;
  title: string;
  date: string; // ISO string for the event's date and time
  duration?: number; // in minutes
  description?: string;
  category: string; // This will now be Project['name']
  recurrenceRule?: RecurrenceRule;
  createdAt?: string; 
}

// New Project Interface
export interface Project {
  id: string;
  userId: string;
  name: string; // This is what was previously Category string
  createdAt?: string;
  updatedAt?: string;
}


export type ViewMode = "dashboard" | "tasks" | "goals" | "notes" | "calendar";

// Category will now refer to Project['name'], but the type alias can remain for convenience
// if used extensively, or be replaced by Project['name'] directly.
// For now, keeping it simple, existing components use 'string' for category.
export type Category = string; 


export interface AuthenticatedUser extends NextAuthUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface SearchResultItem {
  id: string;
  type: 'task' | 'goal' | 'note' | 'event';
  title: string;
  category: Category; // Project name
  date?: string;
  contentPreview?: string;
  path: string;
}





