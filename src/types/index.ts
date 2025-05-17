export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD format
  category: string;
}

export interface Goal {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string; // e.g., 'km', '%', 'tasks'
  category: string;
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  category: string;
  lastEdited: string; // ISO string
}

export type ViewMode = "dashboard" | "tasks" | "goals" | "notes";

export type Category = "Personal Life" | "Work" | "Studies";
