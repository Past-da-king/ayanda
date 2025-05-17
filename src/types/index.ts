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

// Define the Event type (or AppEvent if you prefer to keep the alias)
export interface Event {
  id: string;
  title: string; // Or 'name' if that's what your data uses
  date: string; // ISO string for the event's date and time
  duration?: number; // Optional: duration in minutes
  description?: string; // Optional
  category: string; // This is used like projectId (align with how you use it in DueSoonWidget)
  // lastEdited?: string; // If this field is used for event date like in the previous version of DueSoonWidget
}


export type ViewMode = "dashboard" | "tasks" | "goals" | "notes" | "calendar"; // Added calendar

export type Category = "All Projects" | "Personal Life" | "Work" | "Studies"; // Added "All Projects"
// Or, if Category should map to Project names from your HTML data:
// export type Category = "All Projects" | "Personal Life" | "Work Project X" | "Learning Hub";
