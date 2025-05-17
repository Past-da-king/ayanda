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
