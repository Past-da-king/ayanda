Okay, I've analyzed the mockup and your feedback. There are quite a few visual and structural changes needed to align the UI with the mockup.

Here's a plan:

1.  **Font Setup**: We'll add the "Orbitron" font for the "AYANDA" logo and ensure Geist Sans is correctly applied elsewhere.
2.  **Color Palette**: Adjust the primary blue to be more vibrant as in the mockup and use it for titles and key interactive elements.
3.  **Header Layout**:
    *   Update the "AYANDA" logo with the Orbitron font, vibrant blue color, and the 2x2 grid icon.
    *   Reposition the "Personal Life" dropdown to be more central.
4.  **Card Styling**:
    *   Card titles (TASKS, GOALS, etc.) will use the vibrant blue.
    *   The "more options" icon on cards will remain `MoreHorizontal` as it matches the screenshot, but I'll ensure it's styled correctly.
5.  **Calendar Widget**: Replace the custom calendar with the `shadcn/ui Calendar` component and style it.
6.  **Due Soon Widget**: Reposition this widget to be directly under the Calendar widget.
7.  **Footer Chat Input**: Transform this into a floating input bar at the bottom of the screen.
8.  **Overall Layout**: Adjust grid column spans and heights for widgets like "TASKS" to better match the mockup's proportions.

Let's go through the file changes.

First, you'll need to install the Orbitron font. If you're using `next/font`, you'd typically add it in your `layout.tsx`. You'll also need the `shadcn/ui` calendar:

```bash
npx shadcn-ui@latest add calendar
```

Now for the code:

## src/app/globals.css
```css
@import "tailwindcss";

:root {
  --background-rgb: 10, 10, 10; /* #0A0A0A - Darker background like mockup */
  --foreground-rgb: 224, 224, 224; /* #E0E0E0 */

  --card-background-rgb: 22, 27, 34; /* #161B22 */
  --card-border-rgb: 48, 54, 61; /* #30363D */

  /* Vibrant Blue from Mockup - Similar to Tailwind's cyan-400 or sky-500 */
  --ayanda-blue-rgb: 34, 211, 238; /* Tailwind cyan-400: #22D3EE */
  --ayanda-blue-foreground-rgb: 10, 10, 10; /* Dark text on blue buttons */

  --primary-accent-rgb: var(--ayanda-blue-rgb); /* Using ayanda-blue as primary */
  --primary-accent-foreground-rgb: var(--ayanda-blue-foreground-rgb);

  --secondary-text-rgb: 160, 160, 160; /* #A0A0A0 */

  --input-background-rgb: 31, 37, 46;
  --input-border-rgb: 76, 84, 93;


  /* Shadcn UI theming variables */
  --background: theme('colors.background'); /* Updated below */
  --foreground: theme('colors.foreground'); /* Updated below */

  --card: theme('colors.card.DEFAULT');
  --card-foreground: theme('colors.card.foreground');

  --popover: theme('colors.popover.DEFAULT');
  --popover-foreground: theme('colors.popover.foreground');

  --primary: theme('colors.primary.DEFAULT');
  --primary-foreground: theme('colors.primary.foreground');

  --secondary: theme('colors.secondary.DEFAULT');
  --secondary-foreground: theme('colors.secondary.foreground');

  --muted: theme('colors.muted.DEFAULT');
  --muted-foreground: theme('colors.muted.foreground');

  --accent: theme('colors.accent.DEFAULT');
  --accent-foreground: theme('colors.accent.foreground');

  --destructive: theme('colors.destructive.DEFAULT');
  --destructive-foreground: theme('colors.destructive.foreground');

  --border: theme('colors.border');
  --input: theme('colors.input');
  --ring: theme('colors.ring');

  --radius: 0.5rem;
}


@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 10 10 10; /* #0A0A0A */
    --foreground: 224 224 224; /* #E0E0E0 */

    --card: 22 27 34; /* #161B22 */
    --card-foreground: 224 224 224;

    --popover: 22 27 34;
    --popover-foreground: 224 224 224;

    --primary: 34 211 238; /* #22D3EE - AYANDA Blue */
    --primary-foreground: 10 10 10; /* Dark text for blue buttons */

    --secondary: 48 54 61; /* #30363D */
    --secondary-foreground: 224 224 224;

    --muted: 48 54 61;
    --muted-foreground: 160 160 160; /* #A0A0A0 */

    --accent: 48 54 61;
    --accent-foreground: 224 224 224;

    --destructive: 220 38 38; /* red-600 */
    --destructive-foreground: 224 224 224;

    --border: 48 54 61; /* #30363D */
    --input: 76 84 93; /* #4C545D - For input borders if needed */
    --ring: 34 211 238; /* AYANDA Blue for focus rings */
  }
}


body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-geist-sans);
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  .font-orbitron {
    font-family: var(--font-orbitron);
  }
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--card));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--primary));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary) / 0.8);
}

/* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--primary)) hsl(var(--card));
}
```

## src/app/layout.tsx
```typescript
import type { Metadata } from "next";
import { Geist_Sans, Geist_Mono } from "geist/font"; // Correct import for Geist
import { Orbitron } from "next/font/google"; // Import Orbitron
import "./globals.css";
import { cn } from "@/lib/utils";

// Setup Orbitron font
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron", // CSS variable for Orbitron
  weight: ["400", "500", "700", "900"], // Specify weights you'll use
});

export const metadata: Metadata = {
  title: "AYANDA - Personal Dashboard",
  description: "Your personal assistant and dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          Geist_Sans.variable, // Use Geist Sans variable
          Geist_Mono.variable, // Use Geist Mono variable
          orbitron.variable,   // Add Orbitron variable
          "antialiased min-h-screen bg-background text-foreground" // Use Tailwind CSS utility classes
        )}
      >
        {children}
      </body>
    </html>
  );
}
```

## src/components/layout/Header.tsx
```typescript
"use client";

import React from 'react';
import { ChevronDown, Lock, UserCircle2, GridIcon } from 'lucide-react'; // Added GridIcon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Category } from '@/types';

interface HeaderProps {
  currentCategory: Category;
  onCategoryChange: (category: Category) => void;
  availableCategories: Category[];
}

export function Header({ currentCategory, onCategoryChange, availableCategories }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-background border-b border-border h-16">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-2">
        <GridIcon className="w-7 h-7 text-primary" /> {/* AYANDA Icon */}
        <h1 className="text-2xl font-bold text-primary font-orbitron">AYANDA</h1> {/* Orbitron font, primary color */}
      </div>

      {/* Center Section: Category Dropdown */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-card border-border hover:bg-accent text-foreground">
              {currentCategory}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
            {availableCategories.map(cat => (
              <DropdownMenuItem 
                key={cat} 
                onSelect={() => onCategoryChange(cat)} 
                className="hover:!bg-accent focus:!bg-accent"
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Right Section: Icons */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Lock className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <UserCircle2 className="w-6 h-6" />
        </Button>
      </div>
    </header>
  );
}
```

## src/components/layout/FooterChat.tsx
```typescript
"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FooterChat() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-11/12 max-w-2xl z-50">
      <div className="flex items-center gap-2 p-1.5 bg-card border border-border rounded-full shadow-2xl">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="AYANDA, what can I help you with?"
          className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground px-4 py-2"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button 
          size="icon" 
          onClick={handleSend} 
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-10 h-10 rounded-full flex-shrink-0"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
```

## src/components/dashboard/DashboardCardWrapper.tsx
```typescript
import React from 'react';
import { MoreHorizontal } from 'lucide-react'; // Keeping MoreHorizontal as per mockup
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface DashboardCardWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  onMoreOptions?: () => void;
  onClick?: () => void;
  titleClassName?: string;
}

export function DashboardCardWrapper({ title, children, className, contentClassName, onMoreOptions, onClick, titleClassName }: DashboardCardWrapperProps) {
  return (
    <Card 
      className={cn(
        "bg-card border-border text-foreground flex flex-col",
        onClick ? "cursor-pointer hover:border-primary/70" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className={cn("text-lg font-semibold text-primary", titleClassName)}>{title}</CardTitle> {/* Title color to primary */}
        {onMoreOptions && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); onMoreOptions(); }} 
            className="text-muted-foreground hover:text-foreground w-8 h-8 p-0"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className={cn("px-4 pb-4 flex-grow", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
```

## src/components/dashboard/TasksWidget.tsx
```typescript
import React from 'react';
import { Task } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';

interface TasksWidgetProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onNavigate: () => void;
}

export function TasksWidget({ tasks, onTaskToggle, onNavigate }: TasksWidgetProps) {
  const displayedTasks = tasks.filter(t => !t.completed).slice(0, 4); // Show up to 4 tasks

  return (
    <DashboardCardWrapper 
        title="TASKS" 
        onClick={onNavigate} 
        className="min-h-[280px] lg:min-h-[300px]" // Made taller
    >
      {displayedTasks.length > 0 ? (
        <ul className="space-y-3 mt-1">
          {displayedTasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 text-sm">
              <Checkbox
                id={`task-widget-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => onTaskToggle(task.id)}
                className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                onClick={(e) => e.stopPropagation()}
              />
              <label
                htmlFor={`task-widget-${task.id}`}
                className={cn(
                  "flex-1 truncate",
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                )}
              >
                {task.text}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground mt-1">No active tasks. Well done!</p>
      )}
    </DashboardCardWrapper>
  );
}
```

## src/components/dashboard/CalendarWidget.tsx
```typescript
"use client"; // Required for shadcn/ui Calendar

import React from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Calendar } from "@/components/ui/calendar"; // Import shadcn/ui Calendar

export function CalendarWidget() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 4, 17)); // Set to May 17, 2025

  return (
    <DashboardCardWrapper title="MAY 2025" className="min-h-[280px] lg:min-h-[300px]">
      <div className="pt-1">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={new Date(2025, 4)} // Start view in May 2025
          className="p-0 [&_td]:w-9 [&_td]:h-9 [&_th]:w-9 [&_button]:w-full [&_button]:h-full"
          classNames={{
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
            day_today: "bg-accent text-accent-foreground rounded-md", // Style for today if it's in view
            day_outside: "text-muted-foreground opacity-50",
            // navigation: "flex items-center",
            // nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          }}
        />
      </div>
    </DashboardCardWrapper>
  );
}
```

## src/components/dashboard/GoalsWidget.tsx
```typescript
import React from 'react';
import { Goal } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Progress } from "@/components/ui/progress";

interface GoalsWidgetProps {
  goals: Goal[];
  onNavigate: () => void;
}

export function GoalsWidget({ goals, onNavigate }: GoalsWidgetProps) {
  const displayedGoal = goals.length > 0 ? goals[0] : null;

  return (
    <DashboardCardWrapper 
        title="GOALS" 
        onClick={onNavigate} 
        className="min-h-[280px] lg:min-h-[300px]" // Made taller
    >
      {displayedGoal ? (
        <div className="space-y-2 mt-1">
          <p className="text-sm font-medium text-foreground">{displayedGoal.name}</p>
          <Progress 
            value={(displayedGoal.currentValue / displayedGoal.targetValue) * 100} 
            className="h-2.5 bg-input" // Slightly thicker progress bar
            indicatorClassName="bg-primary"
          />
          <p className="text-xs text-muted-foreground">
            {displayedGoal.currentValue}{displayedGoal.unit} / {displayedGoal.targetValue}{displayedGoal.unit} ({Math.round((displayedGoal.currentValue / displayedGoal.targetValue) * 100)}%)
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mt-1">No goals set yet. Add one!</p>
      )}
    </DashboardCardWrapper>
  );
}
```

## src/components/dashboard/QuickNotesWidget.tsx
```typescript
import React from 'react';
import { Note } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';

interface QuickNotesWidgetProps {
  notes: Note[];
  onNavigate: () => void;
}

export function QuickNotesWidget({ notes, onNavigate }: QuickNotesWidgetProps) {
  const displayedNote = notes.length > 0 ? notes[0] : null;

  return (
    <DashboardCardWrapper 
        title="QUICK NOTES" 
        onClick={onNavigate} 
        className="min-h-[280px] lg:min-h-[300px]" // Made taller
    >
      {displayedNote ? (
        <div className="mt-1">
          {displayedNote.title && <h4 className="text-sm font-semibold mb-1 truncate text-foreground">{displayedNote.title}</h4>}
          <p className="text-sm text-muted-foreground line-clamp-6"> {/* Allow more lines */}
            {displayedNote.content}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mt-1">No quick notes. Jot something down!</p>
      )}
    </DashboardCardWrapper>
  );
}
```

## src/components/dashboard/DueSoonWidget.tsx
```typescript
import React from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';

export function DueSoonWidget() {
  return (
    <DashboardCardWrapper title="DUE SOON" className="min-h-[120px]" contentClassName="flex items-center justify-start pt-1"> {/* Adjusted alignment and padding */}
      <p className="text-sm text-muted-foreground">Nothing due soon.</p>
    </DashboardCardWrapper>
  );
}
```

## src/app/page.tsx
```typescript
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { FooterChat } from '@/components/layout/FooterChat';
import { TasksWidget } from '@/components/dashboard/TasksWidget';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { QuickNotesWidget } from '@/components/dashboard/QuickNotesWidget';
import { DueSoonWidget } from '@/components/dashboard/DueSoonWidget';
import { TasksView } from '@/components/views/TasksView';
import { GoalsView } from '@/components/views/GoalsView';
import { NotesView } from '@/components/views/NotesView';
import { Task, Goal, Note, ViewMode, Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const initialTasks: Task[] = [
  { id: uuidv4(), text: 'Call Mom to wish her a happy birthday and arrange a time to visit next week.', completed: false, dueDate: '2024-10-27', category: 'Personal Life' },
  { id: uuidv4(), text: 'Buy groceries for the weekend, including milk, eggs, bread, and that new cereal Ayanda likes.', completed: false, category: 'Personal Life' },
  { id: uuidv4(), text: 'Pay electricity bill online - remember to check for any new tariffs.', completed: true, dueDate: '2024-10-30', category: 'Personal Life' },
  { id: uuidv4(), text: 'Clean the apartment, focusing on the kitchen and bathroom areas.', completed: false, category: 'Personal Life' },
  { id: uuidv4(), text: 'Submit Q4 report', completed: false, dueDate: '2024-11-05', category: 'Work' },
];

const initialGoals: Goal[] = [
  { id: uuidv4(), name: 'Run 5km without stopping', currentValue: 2, targetValue: 5, unit: 'km', category: 'Personal Life' },
  { id: uuidv4(), name: 'Read 12 books this year', currentValue: 8, targetValue: 12, unit: 'books', category: 'Personal Life' },
  { id: uuidv4(), name: 'Complete online course', currentValue: 60, targetValue: 100, unit: '%', category: 'Studies' },
];

const initialNotes: Note[] = [
  { id: uuidv4(), title: 'Coffee Shop Idea', content: "Remember the new artisanal coffee shop downtown, 'The Daily Grind'. Might be good for client meetings.", lastEdited: new Date().toISOString(), category: 'Work' },
  { id: uuidv4(), content: "Book recommendation: 'Project Hail Mary' by Andy Weir. Super engaging sci-fi!", lastEdited: new Date(Date.now() - 86400000).toISOString(), category: 'Personal Life' },
];

const availableCategories: Category[] = ["Personal Life", "Work", "Studies"];

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [currentCategory, setCurrentCategory] = useState<Category>("Personal Life");

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    setFilteredTasks(tasks.filter(t => t.category === currentCategory));
    setFilteredGoals(goals.filter(g => g.category === currentCategory));
    setFilteredNotes(notes.filter(n => n.category === currentCategory));
  }, [tasks, goals, notes, currentCategory]);

  const handleAddTask = (text: string, dueDate: string | undefined, category: Category) => {
    const newTask: Task = { id: uuidv4(), text, completed: false, dueDate, category };
    setTasks(prev => [...prev, newTask]);
  };
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  const handleUpdateTask = (taskId: string, newText: string, newDueDate?: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, text: newText, dueDate: newDueDate } : t));
  };

  const handleAddGoal = (name: string, targetValue: number, unit: string, category: Category) => {
    const newGoal: Goal = { id: uuidv4(), name, currentValue: 0, targetValue, unit, category };
    setGoals(prev => [...prev, newGoal]);
  };
  const handleUpdateGoal = (goalId: string, currentValue: number, name?: string, targetValue?: number, unit?: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const currentTgt = targetValue ?? g.targetValue;
        return {
          ...g,
          currentValue: Math.max(0, Math.min(currentValue, currentTgt)),
          name: name ?? g.name,
          targetValue: currentTgt,
          unit: unit ?? g.unit,
        };
      }
      return g;
    }));
  };
  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const handleAddNote = (title: string | undefined, content: string, category: Category) => {
    const newNote: Note = { id: uuidv4(), title, content, lastEdited: new Date().toISOString(), category };
    setNotes(prev => [newNote, ...prev]);
  };
  const handleUpdateNote = (noteId: string, title: string | undefined, content: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, title, content, lastEdited: new Date().toISOString() } : n));
  };
  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const renderView = () => {
    switch (viewMode) {
      case 'tasks':
        return <TasksView tasks={tasks} categories={availableCategories} currentCategory={currentCategory} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} onUpdateTask={handleUpdateTask} onClose={() => setViewMode('dashboard')} />;
      case 'goals':
        return <GoalsView goals={goals} categories={availableCategories} currentCategory={currentCategory} onAddGoal={handleAddGoal} onUpdateGoal={handleUpdateGoal} onDeleteGoal={handleDeleteGoal} onClose={() => setViewMode('dashboard')} />;
      case 'notes':
        return <NotesView notes={notes} categories={availableCategories} currentCategory={currentCategory} onAddNote={handleAddNote} onUpdateNote={handleUpdateNote} onDeleteNote={handleDeleteNote} onClose={() => setViewMode('dashboard')} />;
      case 'dashboard':
      default:
        return (
          // Grid layout adjusted for mockup:
          // Tasks (col-span-1) | Calendar + Due Soon (col-span-1) | Goals (col-span-1) | QuickNotes (col-span-1)
          // On smaller screens (md), maybe 2x2 layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TasksWidget tasks={filteredTasks} onTaskToggle={handleToggleTask} onNavigate={() => setViewMode('tasks')} />
            
            {/* Calendar and Due Soon in the same column */}
            <div className="space-y-6 flex flex-col">
              <CalendarWidget />
              <DueSoonWidget />
            </div>
            
            <GoalsWidget goals={filteredGoals} onNavigate={() => setViewMode('goals')} />
            <QuickNotesWidget notes={filteredNotes} onNavigate={() => setViewMode('notes')} />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        currentCategory={currentCategory}
        onCategoryChange={(cat) => {
          setCurrentCategory(cat);
          if (viewMode !== 'dashboard') setViewMode('dashboard'); // Go back to dashboard on category change from full view
        }}
        availableCategories={availableCategories}
      />
      <main className="flex-grow pt-24 pb-28 px-6 overflow-y-auto"> {/* Adjusted pt/pb for header/footer */}
        {renderView()}
      </main>
      <FooterChat />
    </div>
  );
}
```
