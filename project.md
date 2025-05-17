
## src/components/layout/ProjectSelectorBar.tsx
```typescript
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cog } from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectSelectorBarProps {
  currentCategory: Category;
  onCategoryChange: (category: Category) => void;
  availableCategories: Category[];
  // onManageProjects: () => void; 
}

export function ProjectSelectorBar({ 
  currentCategory, 
  onCategoryChange, 
  availableCategories 
}: ProjectSelectorBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectCategory = (category: Category | null) => {
    onCategoryChange(category || "All Projects" as Category);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        pillRef.current && !pillRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayCategoryName = currentCategory === "All Projects" ? "All Projects" : currentCategory;


  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-[90]",
        "bg-background", // Use themed background
        "px-6 py-3 border-b border-border", // Add bottom border to match header style for integration
        // "shadow-[0_2px_5px_rgba(0,0,0,0.1)]", // Shadow removed for less separation
        "flex items-center justify-center"
      )}
      style={{ top: '5rem' }} 
    >
      <div className="relative">
        <div
          ref={pillRef}
          onClick={toggleDropdown}
          className={cn(
            "bg-widget-bg border border-border", // Use themed widget-bg and border
            "rounded-full px-5 py-2",
            "text-sm font-medium cursor-pointer text-foreground", // Use themed text
            "flex items-center min-w-[220px] justify-between",
            "transition-colors duration-200 hover:border-primary hover:bg-accent" // Use themed primary/accent
          )}
        >
          <span>{displayCategoryName}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute mt-2 bg-popover border border-border rounded-md", // Use themed popover and border
              "w-[250px] max-h-[300px] overflow-y-auto text-popover-foreground", // Use themed text
              "shadow-[0_8px_25px_rgba(0,0,0,0.4)] z-[100]", // Keep shadow for dropdown itself
              "transition-all duration-200 ease-out",
              isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2.5"
            )}
            style={{ top: 'calc(100% + 0.5rem)'}} 
          >
            <div 
              className={cn(
                "px-4 py-2.5 cursor-pointer text-sm",
                (currentCategory === "All Projects" || !availableCategories.includes(currentCategory as Category)) 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => handleSelectCategory("All Projects" as Category)}
            >
              All Projects
            </div>
            {availableCategories.map(cat => (
              <div
                key={cat}
                className={cn(
                  "px-4 py-2.5 cursor-pointer text-sm",
                  currentCategory === cat 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => handleSelectCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>
       <button 
        title="Manage Projects" 
        className="ml-3 p-2 rounded-full hover:bg-input-bg text-muted-foreground hover:text-accent-foreground" // Use themed colors
      >
        <Cog className="w-5 h-5" />
      </button>
    </div>
  );
}
```



## src/app/page.tsx
```typescript
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation'; 

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


  useEffect(() => {
    if (status === "loading") return; 
    if (!session && status === "unauthenticated") {
      router.replace('/login?callbackUrl=/'); 
    } else if (session && status === "authenticated" && !initialLoadDone) {
      setInitialLoadDone(true); 
    }
  }, [session, status, router, initialLoadDone]);


  const fetchData = useCallback(async (categorySignal?: Category) => {
    if (status !== "authenticated" && !categorySignal) return; 
    
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
  }, [currentCategory, status]); 

  useEffect(() => {
    if (initialLoadDone && status === "authenticated") { 
        fetchData();
    }
  }, [fetchData, initialLoadDone, status]); 

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
        if (status === "unauthenticated") { 
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
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+0.75rem)] flex justify-center items-center"> {/* Adjusted gap */}
                <p className="text-xl accent-text">Initializing AYANDA...</p>
            </main>
        </div>
    );
  }
  if (status === "unauthenticated" && (router.pathname === "/" || !["/login", "/register", "/landing"].includes(router.pathname))) {
     return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+0.75rem)] flex justify-center items-center"> {/* Adjusted gap */}
                <p className="text-xl accent-text">Redirecting to login...</p>
            </main>
        </div>
     );
  }

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
            // 5rem (Header) + ~2.875rem (ProjectSelectorBar height from py-3 & content) + 0.75rem (desired gap)
            showProjectBar && viewMode === 'dashboard' ? "pt-[calc(5rem+2.875rem+0.75rem)]" : 
            (viewMode === 'dashboard' ? "pt-[calc(5rem+0.75rem)]" : "pt-0")
        )}
      >
        {renderView()}
      </main>
      {status === "authenticated" && <FooterChat onSendCommand={handleAiInputCommand} />}
    </div>
  );
}
```
