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
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

const initialProjectsData: { id: string, name: Category }[] = [
    { id: 'proj_personal', name: 'Personal Life' },
    { id: 'proj_work', name: 'Work' },
    { id: 'proj_learning', name: 'Studies' }
];
const baseAvailableCategories: Category[] = initialProjectsData.map(p => p.name);
const availableCategoriesForDropdown: Category[] = ["All Projects", ...baseAvailableCategories];


const initialTasks: Task[] = [
  { id: 't1', text: 'Buy groceries for the weekend, including milk, eggs, bread, and that new cereal Ayanda likes.', completed: false, category: 'Personal Life', dueDate: '2024-10-28' },
  { id: 't2', text: 'Finalize Q4 report slides and send to marketing team.', completed: false, category: 'Work', dueDate: '2024-10-29' },
  { id: 't3', text: 'Read Chapter 3 of "Eloquent JavaScript".', completed: true, category: 'Studies', dueDate: '2024-10-25' },
  { id: 't4', text: 'Call Mom for her birthday.', completed: false, category: 'Personal Life', dueDate: '2024-10-27' },
  { id: 't5', text: 'Clean the apartment.', completed: false, category: 'Personal Life', dueDate: '2024-10-30' },
  { id: 't6', text: 'Submit Q1 proposal.', completed: false, category: 'Work', dueDate: '2024-11-01' },
];

const initialGoals: Goal[] = [
  { id: 'g1', name: 'Run 5km without stopping', currentValue: 2, targetValue: 5, unit: 'km', category: 'Personal Life' },
  { id: 'g2', name: 'Complete Figma Advanced UI Course', currentValue: 60, targetValue: 100, unit: '%', category: 'Studies' },
  { id: 'g3', name: 'Client retention rate to 90%', currentValue: 85, targetValue: 90, unit: '%', category: 'Work' },
];

const initialNotes: Note[] = [
  { id: 'n1', title: 'Coffee Shop Idea', content: 'The Daily Grind - good for client meetings. Has good Wi-Fi.', category: 'Work', lastEdited: '2024-10-24T10:00:00Z' },
  { id: 'n2', title: 'Book Recommendation', content: '"Atomic Habits" by James Clear. Very insightful for building good routines.', category: 'Personal Life', lastEdited: '2024-10-22T09:15:00Z' },
  { id: 'n3', title: 'JS Array Methods', content: 'Remember: map, filter, reduce, find, some, every. Practice more with reduce.', category: 'Studies', lastEdited: '2024-10-20T11:00:00Z' },
];

const initialEvents: AppEvent[] = [
  { id: 'e1', title: 'Team Meeting - Q4 Planning', date: '2024-10-29T10:00:00Z', category: 'Work', description: 'Discuss Q4 goals and roadmap.' },
  { id: 'e2', title: 'Doctor Appointment', date: '2024-11-05T14:30:00Z', category: 'Personal Life', description: 'Dr. Smith, Room 302.' },
  { id: 'e3', title: 'Webinar: Advanced CSS', date: '2024-10-30T18:00:00Z', category: 'Studies', description: 'Online link in email.' },
  { id: 'e4', title: 'Client Call - Project Alpha', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), category: 'Work', description: 'Follow up on feedback.' },
];


export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [projects, setProjects] = useState(initialProjectsData);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [events, setEvents] = useState<AppEvent[]>(initialEvents);
  
  const [currentCategory, setCurrentCategory] = useState<Category>("All Projects");

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AppEvent[]>([]);

  const filterData = useCallback(() => {
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

  useEffect(() => {
    filterData();
  }, [filterData]);

  const handleAddTask = (text: string, dueDate: string | undefined, category: Category) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const newTask: Task = { id: uuidv4(), text, completed: false, dueDate, category: effectiveCategory };
    setTasks(prev => [...prev, newTask]);
  };
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  const handleUpdateTask = (taskId: string, newText: string, newDueDate?: string, newCategory?: Category) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, text: newText, dueDate: newDueDate, category: newCategory || t.category } : t));
  };

  const handleAddGoal = (name: string, targetValue: number, unit: string, category: Category) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const newGoal: Goal = { id: uuidv4(), name, currentValue: 0, targetValue, unit, category: effectiveCategory };
    setGoals(prev => [...prev, newGoal]);
  };
  const handleUpdateGoal = (goalId: string, currentValue?: number, name?: string, targetValue?: number, unit?: string, category?: Category) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const currentTgt = targetValue ?? g.targetValue;
        return {
          ...g,
          currentValue: currentValue !== undefined ? Math.max(0, Math.min(currentValue, currentTgt)) : g.currentValue,
          name: name ?? g.name, targetValue: currentTgt, unit: unit ?? g.unit, category: category ?? g.category,
        };
      } return g;
    }));
  };
  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const handleAddNote = (title: string | undefined, content: string, category: Category) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const newNote: Note = { id: uuidv4(), title, content, lastEdited: new Date().toISOString(), category: effectiveCategory };
    setNotes(prev => [newNote, ...prev]);
  };
  const handleUpdateNote = (noteId: string, title: string | undefined, content: string, category?: Category) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, title, content, category: category || n.category, lastEdited: new Date().toISOString() } : n));
  };
  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };
  
  const handleAddEvent = (title: string, date: string, category: Category, description?: string) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const newEvent: AppEvent = {id: uuidv4(), title, date, category: effectiveCategory, description };
    setEvents(prev => [...prev, newEvent].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };
  const handleUpdateEvent = (eventId: string, title: string, date: string, category: Category, description?: string) => {
     setEvents(prev => prev.map(e => e.id === eventId ? {...e, title, date, category, description} : e).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };
  const handleDeleteEvent = (eventId: string) => {
     setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleAiInputCommand = (command: string) => {
    const lowerInput = command.toLowerCase();
    let effectiveCategory = (currentCategory === "All Projects" || !baseAvailableCategories.includes(currentCategory)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : currentCategory;

    if (lowerInput.startsWith("add task:") || lowerInput.startsWith("new task:")) {
        const taskName = command.substring(lowerInput.indexOf(":") + 1).trim();
        if(taskName) handleAddTask(taskName, undefined, effectiveCategory);
    } else if (lowerInput.startsWith("add note:") || lowerInput.startsWith("new note:")) {
        const noteContent = command.substring(lowerInput.indexOf(":") + 1).trim();
        if(noteContent) handleAddNote("AI Note", noteContent, effectiveCategory);
    } else if (lowerInput.startsWith("add project:") || lowerInput.startsWith("new project:")) {
        const projName = command.substring(lowerInput.indexOf(":") + 1).trim() as Category;
         if(projName && !projects.find(p => p.name.toLowerCase() === projName.toLowerCase())) {
             const newProject = { id: uuidv4(), name: projName };
             setProjects(prev => [...prev, newProject]);
             // This would ideally also update baseAvailableCategories and availableCategoriesForDropdown if they were derived from `projects` state.
             // For now, this only adds to `projects` state.
        }
    } else if (lowerInput.startsWith("add goal:") || lowerInput.startsWith("new goal:")) {
        const goalName = command.substring(lowerInput.indexOf(":") + 1).trim();
        if(goalName) handleAddGoal(goalName, 100, "%", effectiveCategory);
    } else { if(command) handleAddTask(command, undefined, effectiveCategory); }
  };

  const renderView = () => {
    const commonViewProps = {
        categories: baseAvailableCategories, // Use projects derived categories
        currentCategory: (currentCategory === "All Projects" || !baseAvailableCategories.includes(currentCategory)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : currentCategory,
        onClose: () => setViewMode('dashboard'),
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
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <div className="lg:row-span-2">
                <TasksWidget tasks={filteredTasks} onTaskToggle={handleToggleTask} onNavigate={() => setViewMode('tasks')} />
            </div>
            <div className="flex flex-col space-y-5 md:space-y-6">
              <CalendarWidget events={filteredEvents} onNavigate={() => setViewMode('calendar')} />
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
        onCategoryChange={(cat) => setCurrentCategory(cat)}
        availableCategories={availableCategoriesForDropdown} // Use all categories including "All Projects"
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

