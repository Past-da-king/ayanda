"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react'; 
import { usePathname, useRouter, useSearchParams } from 'next/navigation'; 

import { Header } from '@/components/layout/Header';
import { ProjectSelectorBar } from '@/components/layout/ProjectSelectorBar';
import { FooterChat } from '@/components/layout/FooterChat';
import { AiAssistantWidget, ExecutedOperationInfo, AiChatMessage as AiChatMessageImport } from '@/components/dashboard/AiAssistantWidget';
import { TasksWidget } from '@/components/dashboard/TasksWidget';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { QuickNotesWidget } from '@/components/dashboard/QuickNotesWidget';
import { DueSoonWidget } from '@/components/dashboard/DueSoonWidget';
import { TasksView } from '@/components/views/TasksView';
import { GoalsView } from '@/components/views/GoalsView';
import { NotesView } from '@/components/views/NotesView';
import { CalendarFullScreenView } from '@/components/views/CalendarFullScreenView';
import { Task, Goal, Note, Event as AppEvent, ViewMode, Category, RecurrenceRule, SubTask } from '@/types';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import type { Part, Content } from '@google/generative-ai';
import type { InteractionMode } from '@/lib/gemini';

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];
const availableCategoriesForDropdown: Category[] = ["All Projects", ...baseAvailableCategories];

type AiChatMessage = AiChatMessageImport;

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  
  const [currentCategory, setCurrentCategory] = useState<Category>("All Projects");

  const [isLoading, setIsLoading] = useState(true); 
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [aiMessageForCollapsedWidget, setAiMessageForCollapsedWidget] = useState<string | null>(null);

  const [isAiChatModeActive, setIsAiChatModeActive] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<AiChatMessage[]>([]);
  const [currentFooterChatMessage, setCurrentFooterChatMessage] = useState('');

  useEffect(() => {
    const view = searchParams.get('view') as ViewMode | null;
    if (view && ['tasks', 'goals', 'notes', 'calendar'].includes(view)) {
      setViewMode(view);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "loading") return; 
    if (!session && status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${pathname}`); 
    } else if (session && status === "authenticated" && !initialLoadDone) {
      setInitialLoadDone(true); 
    }
  }, [session, status, router, initialLoadDone, pathname]);

  const fetchData = useCallback(async (categorySignal?: Category) => {
    if (status !== "authenticated") return; 
    
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

      const checkOk = (res: Response, name: string) => {
          if(!res.ok) console.error(`Failed to fetch ${name}: ${res.status} ${res.statusText} - ${res.url}`);
          return res.ok;
      }
      
      if (checkOk(tasksRes, 'tasks') && checkOk(goalsRes, 'goals') && checkOk(notesRes, 'notes') && checkOk(eventsRes, 'events')) {
        const tasksData = await tasksRes.json();
        const goalsData = await goalsRes.json();
        const notesData = await notesRes.json();
        const eventsData = await eventsRes.json();

        setTasks(tasksData);
        setGoals(goalsData);
        setNotes(notesData);
        setEvents(eventsData);
      } else {
         setAiMessageForCollapsedWidget("Error fetching some data. Dashboard might be incomplete.");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setAiMessageForCollapsedWidget("Network error fetching data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentCategory, status]); 

  useEffect(() => {
    if (initialLoadDone && status === "authenticated") { 
        fetchData();
    }
  }, [fetchData, initialLoadDone, status]); 

  const sendAiRequest = useCallback(async (
    messageParts: Part[], 
    currentChatSessionHistoryForRequest: AiChatMessage[], // Use a temporary variable for history being sent
    mode: InteractionMode
  ) => {
    if (status !== "authenticated") return;
    setIsProcessingAi(true);
    
    const formattedHistoryForApi: Content[] = currentChatSessionHistoryForRequest
      .filter(chat => !chat.isAudioPlaceholder) // Don't send audio placeholders to Gemini
      .map(chat => ({
        role: chat.sender === 'user' ? 'user' : 'model',
        parts: [{ text: chat.message }]
    }));

    try {
        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                parts: messageParts, 
                currentCategory,
                chatHistory: mode === 'chatSession' ? formattedHistoryForApi : undefined, 
                interactionMode: mode,
            }),
        });
        
        const result: { aiMessage: string; executedOperationsLog?: ExecutedOperationInfo[]; error?: string } = await res.json();
        
        // Before adding the new AI message, remove any "Audio sent..." placeholders from the current user
        setAiChatHistory(prev => prev.filter(m => !(m.sender === 'user' && m.isAudioPlaceholder)));

        if (res.ok && result.aiMessage) {
            const aiReplyMessage: AiChatMessage = {
                sender: 'ai',
                message: result.aiMessage,
                timestamp: new Date(),
                executedOps: result.executedOperationsLog 
            };

            if (mode === 'chatSession') {
                setAiChatHistory(prev => [...prev, aiReplyMessage]);
                if (result.executedOperationsLog && result.executedOperationsLog.some(op => op.success)) {
                    fetchData(currentCategory); 
                }
            } else { 
                setAiMessageForCollapsedWidget(result.aiMessage);
                if (result.executedOperationsLog && result.executedOperationsLog.some(op => op.success)) {
                    fetchData(currentCategory);
                }
            }
        } else {
            const errorMessage = result.aiMessage || result.error || "AIDA had trouble responding.";
            if(mode === 'chatSession') {
                setAiChatHistory(prev => [...prev, { sender: 'ai', message: `Error: ${errorMessage}`, timestamp: new Date() }]);
            } else {
                setAiMessageForCollapsedWidget(`Error: ${errorMessage}`);
            }
        }
    } catch (error) {
        console.error("Error sending command to AI:", error);
        const connectError = "Sorry, I couldn't connect. Please try again.";
        setAiChatHistory(prev => prev.filter(m => !(m.sender === 'user' && m.isAudioPlaceholder)));
         if(mode === 'chatSession') {
            setAiChatHistory(prev => [...prev, { sender: 'ai', message: connectError, timestamp: new Date() }]);
        } else {
            setAiMessageForCollapsedWidget(connectError);
        }
    } finally {
        setIsProcessingAi(false);
    }
  }, [status, currentCategory, fetchData]);


  const handleToggleAiChatMode = useCallback(async () => {
    const wasChatModeActive = isAiChatModeActive;
    const currentSessionHistoryForSummary = [...aiChatHistory]; 

    setIsAiChatModeActive(prev => !prev); 

    if (wasChatModeActive && currentSessionHistoryForSummary.length > 0) { 
        setIsProcessingAi(true);
        setAiMessageForCollapsedWidget("Finalizing chat with AIDA...");
        try {
            const formattedHistoryForSummary: Content[] = currentSessionHistoryForSummary
                .filter(chat => !chat.isAudioPlaceholder) 
                .map(chat => ({
                    role: chat.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: chat.message }]
            }));

            if (formattedHistoryForSummary.length > 0) {
                await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chatHistory: formattedHistoryForSummary, 
                    isEndingChatSession: true,
                    currentCategory: currentCategory, 
                    interactionMode: 'chatSession' 
                }),
                });
                setAiMessageForCollapsedWidget("Chat session concluded. Context updated.");
            } else {
                setAiMessageForCollapsedWidget("Chat session ended.");
            }
        } catch (error) {
            console.error("Error finalizing chat session for summary:", error);
            setAiMessageForCollapsedWidget("Error ending chat session.");
        } finally {
            setIsProcessingAi(false);
        }
        setAiChatHistory([]); 
    }
    
    if (!wasChatModeActive) { 
        setAiMessageForCollapsedWidget(null);
        setCurrentFooterChatMessage(''); 
        // Send an empty 'parts' array to trigger initial greeting with context
        sendAiRequest([], [], 'chatSession'); 
    } else { 
        setCurrentFooterChatMessage(''); 
    }
  }, [isAiChatModeActive, aiChatHistory, currentCategory, sendAiRequest]);


  const handleCommandFromFooter = (command: string) => {
    if (!command.trim()) return;
    const commandParts: Part[] = [{ text: command.trim() }];
    
    if (isAiChatModeActive) {
        const newUserMessage: AiChatMessage = { sender: 'user', message: command.trim(), timestamp: new Date() };
        // Add user message to history immediately for responsive UI
        setAiChatHistory(prev => [...prev, newUserMessage]);
        // Pass the new state of aiChatHistory to sendAiRequest
        sendAiRequest(commandParts, [...aiChatHistory, newUserMessage], 'chatSession');
    } else {
        setAiMessageForCollapsedWidget(null);
        sendAiRequest(commandParts, [], 'quickCommand');
    }
  };

  const handleAudioCommandFromFooter = (audioBase64: string, mimeType: string) => {
    const audioPart: Part = { inlineData: { mimeType, data: audioBase64 } };
    const instructionPart: Part = { text: "This is an audio command. Please process it." };
    const messageParts = [audioPart, instructionPart];
    
    const audioPlaceholderMessage: AiChatMessage = { 
        sender: 'user', // Visually group with user actions
        message: "🎤 Audio input sent...", 
        timestamp: new Date(),
        isAudioPlaceholder: true 
    };

    if (isAiChatModeActive) {
        setAiChatHistory(prev => [...prev, audioPlaceholderMessage]);
        sendAiRequest(messageParts, [...aiChatHistory, audioPlaceholderMessage], 'chatSession');
    } else {
        setAiMessageForCollapsedWidget("Processing audio command..."); // Or a more subtle indicator
        sendAiRequest(messageParts, [], 'quickCommand');
    }
  };

  const handleCrudFeedback = (message: string, mode: 'success' | 'error') => {
    const feedbackMessage = `${mode === 'error' ? 'Error: ' : ''}${message}`;
    if (isAiChatModeActive) {
        setAiChatHistory(prev => [...prev, { sender: 'ai', message: feedbackMessage, timestamp: new Date() }]);
    } else {
        setAiMessageForCollapsedWidget(feedbackMessage);
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt'>) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskData) });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Task "${taskData.text.substring(0,30)}..." added.`, 'success');
    } else { handleCrudFeedback(`Failed to add task.`, 'error'); }
  };

  const handleToggleTask = async (taskId: string, subTaskId?: string) => {
    if (status !== "authenticated") return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    let updatePayload: Partial<Task>;
    if (subTaskId) {
        const updatedSubTasks = (task.subTasks || []).map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st );
        updatePayload = { subTasks: updatedSubTasks };
        const allSubTasksCompleted = updatedSubTasks.every(st => st.completed);
        if (updatedSubTasks.length > 0 && allSubTasksCompleted !== task.completed) updatePayload.completed = allSubTasksCompleted;
    } else {
        updatePayload = { completed: !task.completed };
        if (updatePayload.completed && task.subTasks && task.subTasks.length > 0) updatePayload.subTasks = task.subTasks.map(st => ({ ...st, completed: true }));
    }
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatePayload) });
    if (res.ok) fetchData(currentCategory);
    else handleCrudFeedback("Failed to toggle task.", 'error');
  };

  const handleDeleteTask = async (taskId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Task deleted.`, 'success'); } 
    else { handleCrudFeedback(`Failed to delete task.`, 'error'); }
  };
  
  const handleUpdateTask = async (taskId: string, taskUpdateData: Partial<Omit<Task, 'id' | 'userId'>>) => {
    if (status !== "authenticated") return;
    if (taskUpdateData.subTasks) taskUpdateData.subTasks = taskUpdateData.subTasks.map(st => ({ ...st, id: st.id || uuidv4() }));
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskUpdateData) });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Task updated.`, 'success'); } 
    else { handleCrudFeedback(`Failed to update task.`, 'error'); }
  };

  const handleAddGoal = async (name: string, targetValue: number, unit: string, category: Category) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/goals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, currentValue: 0, targetValue, unit, category }) });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Goal "${name.substring(0,30)}..." added.`, 'success'); } 
    else { handleCrudFeedback(`Failed to add goal.`, 'error'); }
  };

  const handleUpdateGoal = async (goalId: string, currentValue?: number, name?: string, targetValue?: number, unit?: string, categoryProp?: Category) => {
    if (status !== "authenticated") return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const payload: any = { name: name ?? goal.name, unit: unit ?? goal.unit, category: categoryProp ?? goal.category };
    if(targetValue !== undefined) payload.targetValue = targetValue; else payload.targetValue = goal.targetValue;
    if(currentValue !== undefined) payload.currentValue = Math.max(0, Math.min(currentValue, payload.targetValue)); else payload.currentValue = goal.currentValue;
    const res = await fetch(`/api/goals/${goalId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Goal updated.`, 'success'); } 
    else { handleCrudFeedback(`Failed to update goal.`, 'error'); }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Goal deleted.`, 'success'); } 
    else { handleCrudFeedback(`Failed to delete goal.`, 'error'); }
  };
  
  const handleAddNote = async (title: string | undefined, content: string, category: Category) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, category }) });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Note "${(title || content).substring(0,20)}..." added.`, 'success'); } 
    else { handleCrudFeedback(`Failed to add note.`, 'error'); }
  };

  const handleUpdateNote = async (noteId: string, title: string | undefined, content: string, categoryProp?: Category) => {
     if (status !== "authenticated") return;
     const note = notes.find(n => n.id === noteId);
     if (!note) return;
    const res = await fetch(`/api/notes/${noteId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, category: categoryProp || note.category }) });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Note updated.`, 'success'); } 
    else { handleCrudFeedback(`Failed to update note.`, 'error'); }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Note deleted.`, 'success'); } 
    else { handleCrudFeedback(`Failed to delete note.`, 'error'); }
  };

  const handleAddEvent = async (eventData: Omit<AppEvent, 'id' | 'userId' | 'createdAt'>) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData) });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Event "${eventData.title.substring(0,30)}..." added.`, 'success'); } 
    else { handleCrudFeedback(`Failed to add event.`, 'error'); }
  };
  
  const handleUpdateEvent = async (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id' | 'userId'>>) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventUpdateData) });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Event updated.`, 'success'); } 
    else { handleCrudFeedback(`Failed to update event.`, 'error'); }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); handleCrudFeedback(`Event deleted.`, 'success'); } 
    else { handleCrudFeedback(`Failed to delete event.`, 'error'); }
  };

  const onCategoryChange = (category: Category) => {
    setCurrentCategory(category);
    if (isAiChatModeActive) {
       setAiChatHistory([]);
       sendAiRequest([{text: `Switched to ${category} project view.`}], [], 'chatSession'); // Inform AI about context switch
    }
    setAiMessageForCollapsedWidget(null); 
  };

  const navigateToItemHandler = (type: 'tasks' | 'calendar' | 'notes' | 'goals', id: string) => {
    if (isAiChatModeActive) handleToggleAiChatMode(); 
    setViewMode(type); 
    router.push(`/?view=${type}&id=${id}`, { scroll: false });
  };

  const renderDashboardView = () => {
    if (isLoading && !initialLoadDone) {
        return <div className="flex justify-center items-center h-full"><p className="text-xl accent-text">Loading Dashboard...</p></div>;
    }
    if (status === "unauthenticated") { 
        return <div className="flex justify-center items-center h-full"><p className="text-xl accent-text">Redirecting to login...</p></div>;
    }
    const dashboardDataProps = {
      tasks: tasks.filter(t => currentCategory === "All Projects" || t.category === currentCategory),
      goals: goals.filter(g => currentCategory === "All Projects" || g.category === currentCategory),
      notes: notes.filter(n => currentCategory === "All Projects" || n.category === currentCategory).sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()),
      events: events.filter(e => currentCategory === "All Projects" || e.category === currentCategory),
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 h-full">
          <div className="lg:row-span-2 flex flex-col gap-5 md:gap-6">
            <AiAssistantWidget 
                initialMessage={aiMessageForCollapsedWidget}
                isChatModeActive={false} 
                onToggleChatMode={handleToggleAiChatMode}
                chatHistory={[]} 
                isProcessingAi={isProcessingAi}
            />
            <TasksWidget 
                tasks={dashboardDataProps.tasks} 
                onTaskToggle={handleToggleTask} 
                onNavigate={() => { setViewMode('tasks'); router.push('/?view=tasks', { scroll: false }); }}
                className="flex-grow"
            />
          </div>
          <div className="flex flex-col space-y-5 md:space-y-6">
            <CalendarWidget events={dashboardDataProps.events} onNavigate={() => { setViewMode('calendar'); router.push('/?view=calendar', { scroll: false }); }} />
            <DueSoonWidget 
                tasks={tasks} 
                events={events} 
                currentProjectId={currentCategory === "All Projects" ? null : currentCategory} 
                onNavigateToItem={navigateToItemHandler}
            />
          </div>
          <GoalsWidget goals={dashboardDataProps.goals} onNavigate={() => { setViewMode('goals'); router.push('/?view=goals', { scroll: false }); }} />
          <QuickNotesWidget notes={dashboardDataProps.notes} onNavigate={() => { setViewMode('notes'); router.push('/?view=notes', { scroll: false }); }} />
        </div>
    );
  }

  const renderView = () => {
    const commonViewProps = {
        categories: baseAvailableCategories,
        currentCategory: (currentCategory === "All Projects" || !baseAvailableCategories.includes(currentCategory)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : currentCategory,
        onClose: () => { 
            setViewMode('dashboard'); 
            setAiMessageForCollapsedWidget(null); 
            router.push('/', { scroll: false }); 
        },
    };
    
    if (isAiChatModeActive) {
        return (
            <div className="h-full w-full max-w-4xl mx-auto">
                <AiAssistantWidget
                    initialMessage={null}
                    isChatModeActive={true}
                    onToggleChatMode={handleToggleAiChatMode}
                    chatHistory={aiChatHistory}
                    isProcessingAi={isProcessingAi}
                />
            </div>
        );
    }
    
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
        return renderDashboardView();
    }
  };

  if (status === "loading" && !initialLoadDone) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+0.75rem)] flex justify-center items-center"> 
                <p className="text-xl accent-text">Initializing AYANDA...</p>
            </main>
        </div>
    );
  }
  if (status === "unauthenticated" && (pathname === "/" || !["/login", "/register", "/landing"].includes(pathname))) {
     return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+0.75rem)] flex justify-center items-center"> 
                <p className="text-xl accent-text">Redirecting to login...</p>
            </main>
        </div>
     );
  }

  const showProjectBar = status === "authenticated" && !["/login", "/register", "/landing"].includes(pathname);
  
  const mainPaddingTop = isAiChatModeActive 
      ? "pt-[5rem]" 
      : (viewMode !== 'dashboard' && viewMode !== undefined) 
          ? "pt-[5rem]" 
          : showProjectBar 
              ? "pt-[calc(5rem+2.875rem+1.5rem)]" 
              : "pt-[calc(5rem+1.5rem)]";

  const mainHeightStyle = isAiChatModeActive
      ? { height: "calc(100vh - 5rem - 70px)" } 
      : showProjectBar 
          ? { height: "calc(100vh - (5rem + 2.875rem) - 70px)" } 
          : { height: "calc(100vh - 5rem - 70px)" }; 

  return (
    <div className="flex flex-col min-h-screen h-screen max-h-screen overflow-hidden">
      <Header />
      {showProjectBar && !isAiChatModeActive && (
         <ProjectSelectorBar 
            currentCategory={currentCategory}
            onCategoryChange={onCategoryChange}
            availableCategories={availableCategoriesForDropdown}
          />
      )}
      <main 
        className={cn(
            "flex-grow px-6 pb-6 overflow-y-auto custom-scrollbar-fullscreen",
            isAiChatModeActive && "flex justify-center", 
            mainPaddingTop
        )}
        style={mainHeightStyle}
      >
        {renderView()}
      </main>
      {status === "authenticated" && (
        <FooterChat 
            onSendCommand={handleCommandFromFooter} 
            onSendAudioCommand={handleAudioCommandFromFooter}
            isProcessingAi={isProcessingAi}
            isAiChatModeActive={isAiChatModeActive}
            currentChatInput={currentFooterChatMessage}
            onChatInputChange={setCurrentFooterChatMessage}
        />
      )}
    </div>
  );
}

