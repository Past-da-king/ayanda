"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession
import { useRouter } from 'next/navigation'; // For redirect if not authenticated

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
import { cn } from '@/lib/utils';

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];
const availableCategoriesForDropdown: Category[] = ["All Projects", ...baseAvailableCategories];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  
  const [currentCategory, setCurrentCategory] = useState<Category>("All Projects");

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AppEvent[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);


  // Authentication check
  useEffect(() => {
    if (status === "loading") return; // Don't do anything while loading
    if (!session && status === "unauthenticated") {
      router.replace('/login?callbackUrl=/'); // Redirect to login if not authenticated
    } else if (session && status === "authenticated" && !initialLoadDone) {
      setInitialLoadDone(true); // Mark that initial auth check and potential fetch can proceed
    }
  }, [session, status, router, initialLoadDone]);


  const fetchData = useCallback(async (categorySignal?: Category) => {
    if (status !== "authenticated" && !categorySignal) return; // Don't fetch if not authenticated, unless it's an explicit call
    
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

      if (!tasksRes.ok || !goalsRes.ok || !notesRes.ok || !eventsRes.ok) {
        console.error('Failed to fetch data:', { 
            tasks: tasksRes.statusText, 
            goals: goalsRes.statusText,
            notes: notesRes.statusText,
            events: eventsRes.statusText
        });
        setTasks([]); setGoals([]); setNotes([]); setEvents([]);
      } else {
        const tasksData = await tasksRes.json();
        const goalsData = await goalsRes.json();
        const notesData = await notesRes.json();
        const eventsData = await eventsRes.json();

        setTasks(tasksData);
        setGoals(goalsData);
        setNotes(notesData);
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setTasks([]); setGoals([]); setNotes([]); setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentCategory, status]); // Add status to dependencies

  useEffect(() => {
    if (initialLoadDone && status === "authenticated") { // Only fetch if initial auth check is done and authenticated
        fetchData();
    }
  }, [fetchData, initialLoadDone, status]); // status ensures re-fetch on auth change if needed

  useEffect(() => {
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


  // --- CRUD Handlers (Remain the same, ensure they only run if authenticated if necessary) ---
  const handleAddTask = async (text: string, dueDate: string | undefined, category: Category) => {
    if (status !== "authenticated") return;
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, dueDate, category: effectiveCategory }),
    });
    if (res.ok) fetchData(currentCategory);
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
  };

  const handleDeleteTask = async (taskId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    if (res.ok) fetchData(currentCategory);
  };
  
  const handleUpdateTask = async (taskId: string, newText: string, newDueDate?: string, newCategory?: Category) => {
    if (status !== "authenticated") return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText, dueDate: newDueDate, category: newCategory || task.category }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleAddGoal = async (name: string, targetValue: number, unit: string, category: Category) => {
    if (status !== "authenticated") return;
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, currentValue: 0, targetValue, unit, category: effectiveCategory }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleUpdateGoal = async (goalId: string, currentValue?: number, name?: string, targetValue?: number, unit?: string, category?: Category) => {
    if (status !== "authenticated") return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const currentTgt = targetValue ?? goal.targetValue;
    const updatedCurrentValue = currentValue !== undefined ? Math.max(0, Math.min(currentValue, currentTgt)) : goal.currentValue;

    const res = await fetch(`/api/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          currentValue: updatedCurrentValue, 
          name: name ?? goal.name, 
          targetValue: currentTgt, 
          unit: unit ?? goal.unit, 
          category: category ?? goal.category 
      }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
    if (res.ok) fetchData(currentCategory);
  };
  
  const handleAddNote = async (title: string | undefined, content: string, category: Category) => {
    if (status !== "authenticated") return;
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category: effectiveCategory }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleUpdateNote = async (noteId: string, title: string | undefined, content: string, category?: Category) => {
     if (status !== "authenticated") return;
     const note = notes.find(n => n.id === noteId);
     if (!note) return;
    const res = await fetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category: category || note.category }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    if (res.ok) fetchData(currentCategory);
  };

  const handleAddEvent = async (title: string, date: string, category: Category, description?: string) => {
    if (status !== "authenticated") return;
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date, category: effectiveCategory, description }),
    });
    if (res.ok) fetchData(currentCategory);
  };
  
  const handleUpdateEvent = async (eventId: string, title: string, date: string, category: Category, description?: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date, category, description }),
    });
    if (res.ok) fetchData(currentCategory);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) fetchData(currentCategory);
  };

  const handleAiInputCommand = async (command: string) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, currentCategory }),
    });
    if (res.ok) {
        const result = await res.json();
        console.log("AI Command result:", result);
        fetchData(currentCategory); 
    } else {
        const errorResult = await res.json();
        console.error("AI Command failed:", errorResult);
    }
  };

  const onCategoryChange = (category: Category) => {
    setCurrentCategory(category);
  };

  const renderView = () => {
    const commonViewProps = {
        categories: baseAvailableCategories,
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
        if (isLoading || status === "loading") {
            return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p className="text-xl accent-text">Loading Dashboard...</p></div>;
        }
        if (status === "unauthenticated") { // Should be handled by middleware, but good fallback
            return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p className="text-xl accent-text">Redirecting to login...</p></div>;
        }
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

  if (status === "loading" && !initialLoadDone) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            {/* Potentially a simpler ProjectSelectorBar or placeholder if needed during loading */}
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+1.5rem)] flex justify-center items-center">
                <p className="text-xl accent-text">Initializing AYANDA...</p>
            </main>
             {/* FooterChat might be hidden during initial full page load */}
        </div>
    );
  }
  if (status === "unauthenticated" && (pathname === "/" || !["/login", "/register", "/landing"].includes(pathname))) {
     // This state should ideally be brief as middleware handles redirection.
     // You can show a loading or redirecting message.
     return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+1.5rem)] flex justify-center items-center">
                <p className="text-xl accent-text">Redirecting to login...</p>
            </main>
        </div>
     );
  }
  // Add a check for pathname to avoid rendering ProjectSelectorBar on auth pages.
  // This is an approximation; middleware is the primary guard.
  const { pathname } = typeof window !== "undefined" ? window.location : { pathname: "/" };
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
             // Adjust top padding based on whether project bar is shown
            showProjectBar && viewMode === 'dashboard' ? "pt-[calc(5rem+2.875rem+1.5rem)]" : (viewMode === 'dashboard' ? "pt-[calc(5rem+1.5rem)]" : "pt-0")
        )}
      >
        {renderView()}
      </main>
      {status === "authenticated" && <FooterChat onSendCommand={handleAiInputCommand} />}
    </div>
  );
}
