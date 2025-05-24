"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react'; 
import { usePathname, useRouter, useSearchParams } from 'next/navigation'; 

import { Header } from '@/components/layout/Header';
// ProjectSelectorBar import removed
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
import { ProjectManagementModal } from '@/components/layout/ProjectManagementModal';
import { Task, Goal, Note, Event as AppEvent, ViewMode, Category, Project, AuthenticatedUser } from '@/types'; 
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import type { Part, Content } from '@google/generative-ai';
import type { InteractionMode } from '@/lib/gemini';


const DEFAULT_PROJECTS: Omit<Project, 'userId'>[] = [ // Omit userId, will be added based on session or 'system'
    { id: 'default_personal', name: 'Personal Life', createdAt: new Date().toISOString() },
    { id: 'default_work', name: 'Work', createdAt: new Date().toISOString() },
    { id: 'default_studies', name: 'Studies', createdAt: new Date().toISOString() },
];

type AiChatMessage = AiChatMessageImport;

export default function HomePageContent() {
  const { data: session, status } = useSession();
  const typedSessionUser = session?.user as AuthenticatedUser | undefined;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null); 
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); 
  
  const [currentProjectName, setCurrentProjectName] = useState<Category>("All Projects"); 

  const [isLoading, setIsLoading] = useState(true); 
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [aiMessageForCollapsedWidget, setAiMessageForCollapsedWidget] = useState<string | null>(null);

  const [isAiChatModeActive, setIsAiChatModeActive] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<AiChatMessage[]>([]);
  const [currentFooterChatMessage, setCurrentFooterChatMessage] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);


  const fetchProjects = useCallback(async () => {
    if (status !== "authenticated" || !typedSessionUser?.id) return;
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        let fetchedProjects: Project[] = await res.json();
        if (fetchedProjects.length === 0) {
          const createdDefaults: Project[] = [];
          for (const defaultProject of DEFAULT_PROJECTS) {
            try {
              const addRes = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: defaultProject.name }), // API will assign userId
              });
              if (addRes.ok) {
                createdDefaults.push(await addRes.json());
              }
            } catch (e) { console.error("Failed to create default project", e); }
          }
          fetchedProjects = createdDefaults;
        }
        setProjects(fetchedProjects);
      } else {
        console.error("Failed to fetch projects, using defaults");
        setProjects(DEFAULT_PROJECTS.map(p => ({...p, userId: typedSessionUser.id || 'system'}))); 
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects(DEFAULT_PROJECTS.map(p => ({...p, userId: typedSessionUser.id || 'system'}))); 
    }
  }, [status, typedSessionUser]);


  useEffect(() => {
    const view = searchParams.get('view') as ViewMode | null;
    const itemId = searchParams.get('id'); 
    if (view && ['tasks', 'goals', 'notes', 'calendar'].includes(view)) {
      setViewMode(view);
      if (view === 'notes' && itemId) {
        setEditingNoteId(itemId);
      } else {
        setEditingNoteId(null); 
      }
      if (itemId && view !== 'notes') { 
        console.log(`Navigating to view: ${view}, item ID: ${itemId}`);
      }
    } else {
      setViewMode('dashboard'); 
      setEditingNoteId(null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "loading") return; 
    if (!session && status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${pathname}`); 
    } else if (session && status === "authenticated" && !initialLoadDone) {
      fetchProjects().then(() => { 
        setInitialLoadDone(true); 
      });
    }
  }, [session, status, router, initialLoadDone, pathname, fetchProjects]);

  const fetchData = useCallback(async (projectFilterName?: Category) => {
    if (status !== "authenticated") return; 
    
    setIsLoading(true);
    const categoryToFetch = projectFilterName || currentProjectName;
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
  }, [currentProjectName, status]); 

  useEffect(() => {
    if (initialLoadDone && status === "authenticated") { 
        fetchData(); 
    }
  }, [fetchData, initialLoadDone, status, currentProjectName]); 


  const sendAiRequest = useCallback(async (
    messageParts: Part[], 
    currentChatSessionHistoryForRequest: AiChatMessage[], 
    mode: InteractionMode
  ) => {
    if (status !== "authenticated") return;
    setIsProcessingAi(true);
    
    const formattedHistoryForApi: Content[] = currentChatSessionHistoryForRequest
      .filter(chat => !chat.isAudioPlaceholder) 
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
                currentCategory: currentProjectName, 
                chatHistory: mode === 'chatSession' ? formattedHistoryForApi : undefined, 
                interactionMode: mode,
            }),
        });
        
        const result: { aiMessage: string; executedOperationsLog?: ExecutedOperationInfo[]; error?: string } = await res.json();
        
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
                    fetchData(currentProjectName); 
                }
            } else { 
                setAiMessageForCollapsedWidget(result.aiMessage);
                if (result.executedOperationsLog && result.executedOperationsLog.some(op => op.success)) {
                    fetchData(currentProjectName);
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
  }, [status, currentProjectName, fetchData]);


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
                    currentCategory: currentProjectName, 
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
        sendAiRequest([], [], 'chatSession'); 
    } else { 
        setCurrentFooterChatMessage(''); 
    }
  }, [isAiChatModeActive, aiChatHistory, currentProjectName, sendAiRequest]);


  const handleCommandFromFooter = (command: string) => {
    if (!command.trim()) return;
    const commandParts: Part[] = [{ text: command.trim() }];
    
    if (isAiChatModeActive) {
        const newUserMessage: AiChatMessage = { sender: 'user', message: command.trim(), timestamp: new Date() };
        setAiChatHistory(prev => [...prev, newUserMessage]);
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
        sender: 'user', 
        message: " Audio input sent...", 
        timestamp: new Date(),
        isAudioPlaceholder: true 
    };

    if (isAiChatModeActive) {
        setAiChatHistory(prev => [...prev, audioPlaceholderMessage]);
        sendAiRequest(messageParts, [...aiChatHistory, audioPlaceholderMessage], 'chatSession');
    } else {
        setAiMessageForCollapsedWidget("Processing audio command..."); 
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

  const handleAddTask = async (taskData: Pick<Task, 'text' | 'category' | 'dueDate' | 'recurrenceRule' | 'subTasks' | 'linkedGoalId' | 'contributionValue'>) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskData) });
    if (res.ok) { fetchData(currentProjectName); handleCrudFeedback(`Task "${taskData.text.substring(0,30)}..." added.`, 'success');
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
    if (res.ok) { 
        fetchData(currentProjectName); 
    } else { handleCrudFeedback("Failed to toggle task.", 'error');}
  };

  const handleDeleteTask = async (taskId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentProjectName); handleCrudFeedback(`Task deleted.`, 'success'); } 
    else { handleCrudFeedback(`Failed to delete task.`, 'error'); }
  };
  
  const handleUpdateTask = async (taskId: string, taskUpdateData: Partial<Omit<Task, 'id' | 'userId'>>) => {
    if (status !== "authenticated") return;
    if (taskUpdateData.subTasks) taskUpdateData.subTasks = taskUpdateData.subTasks.map(st => ({ ...st, id: st.id || uuidv4() }));
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskUpdateData) });
    if (res.ok) { fetchData(currentProjectName); handleCrudFeedback(`Task updated.`, 'success'); } 
    else { handleCrudFeedback(`Failed to update task.`, 'error'); }
  };

  const handleAddGoal = async (name: string, targetValue: number, unit: string, category: Category) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/goals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, targetValue, unit, category }) });
    if (res.ok) { fetchData(currentProjectName); handleCrudFeedback(`Goal "${name.substring(0,30)}..." added.`, 'success'); } 
    else { handleCrudFeedback(`Failed to add goal.`, 'error'); }
  };

  const handleUpdateGoal = async (goalId: string, name?: string, targetValue?: number, unit?: string, categoryProp?: Category) => {
    if (status !== "authenticated") return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const payload: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt' | 'currentValue'>> = { 
      name: name ?? goal.name, 
      unit: unit ?? goal.unit, 
      category: categoryProp ?? goal.category 
    };
    if(targetValue !== undefined) payload.targetValue = targetValue; else payload.targetValue = goal.targetValue;
    
    const res = await fetch(`/api/goals/${goalId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { fetchData(currentProjectName); handleCrudFeedback(`Goal updated.`, 'success'); } 
    else { handleCrudFeedback(`Failed to update goal.`, 'error'); }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentProjectName); handleCrudFeedback(`Goal deleted.`, 'success'); } 
    else { handleCrudFeedback(`Failed to delete goal.`, 'error'); }
  };
  
  const handleAddNote = async (title: string | undefined, content: string, category: Category) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, category }) });
    if (res.ok) { 
        await fetchData(currentProjectName); 
        handleCrudFeedback(`Note "${(title || content).substring(0,20)}..." added.`, 'success'); 
    } else { handleCrudFeedback(`Failed to add note.`, 'error'); }
  };

  const handleUpdateNote = async (noteId: string, title: string | undefined, content: string, categoryProp: Category) => { 
     if (status !== "authenticated") return;
     const note = notes.find(n => n.id === noteId);
     if (!note) return;
    const res = await fetch(`/api/notes/${noteId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, category: categoryProp }) });
    if (res.ok) { 
        await fetchData(currentProjectName); 
        handleCrudFeedback(`Note updated.`, 'success'); 
    } else { handleCrudFeedback(`Failed to update note.`, 'error'); }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    if (res.ok) { 
        await fetchData(currentProjectName); 
        handleCrudFeedback(`Note deleted.`, 'success');
        if(editingNoteId === noteId) {
            setEditingNoteId(null); 
        }
    } else { handleCrudFeedback(`Failed to delete note.`, 'error'); }
  };

  const handleAddEvent = async (eventData: Omit<AppEvent, 'id' | 'userId' | 'createdAt'>) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData) });
    if (res.ok) { fetchData(currentProjectName); handleCrudFeedback(`Event "${eventData.title.substring(0,30)}..." added.`, 'success'); } 
    else { handleCrudFeedback(`Failed to add event.`, 'error'); }
  };
  
  const handleUpdateEvent = async (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id' | 'userId'>>) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventUpdateData) });
    if (res.ok) { fetchData(currentProjectName); handleCrudFeedback(`Event updated.`, 'success'); } 
    else { handleCrudFeedback(`Failed to update event.`, 'error'); }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentProjectName); handleCrudFeedback(`Event deleted.`, 'success'); } 
    else { handleCrudFeedback(`Failed to delete event.`, 'error'); }
  };

  const onProjectChange = (projectName: Category) => { 
    setCurrentProjectName(projectName);
    if (isAiChatModeActive) {
       setAiChatHistory([]);
       sendAiRequest([{text: `Switched to ${projectName} project view.`}], [], 'chatSession'); 
    }
    setAiMessageForCollapsedWidget(null); 
  };
  
  const handleAddProject = async (name: string) => {
    if (status !== "authenticated") throw new Error("Not authenticated");
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to add project");
    }
    await fetchProjects(); 
  };

  const handleUpdateProject = async (id: string, newName: string) => {
    if (status !== "authenticated") throw new Error("Not authenticated");
    const oldProject = projects.find(p => p.id === id);
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to update project");
    }
    await fetchProjects(); 
    if (oldProject && currentProjectName === oldProject.name) {
        setCurrentProjectName(newName); 
    } else {
        await fetchData(currentProjectName); 
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (status !== "authenticated") throw new Error("Not authenticated");
    const projectToDelete = projects.find(p => p.id === id);
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to delete project");
    }
    await fetchProjects(); 
    if (projectToDelete && currentProjectName === projectToDelete.name) {
      setCurrentProjectName("All Projects"); 
    } else {
      await fetchData(currentProjectName); 
    }
  };


  const navigateToNotesView = (noteIdToEdit?: string) => {
    setViewMode('notes');
    setEditingNoteId(noteIdToEdit || null);
    const url = noteIdToEdit ? `/?view=notes&id=${noteIdToEdit}` : '/?view=notes';
    router.push(url, { scroll: false });
  };
  
  const navigateToItemHandler = (type: 'tasks' | 'calendar' | 'notes' | 'goals', id: string) => {
    if (isAiChatModeActive) handleToggleAiChatMode(); 
    setViewMode(type); 
    if (type === 'notes') {
        navigateToNotesView(id);
    } else {
        router.push(`/?view=${type}&id=${id}`, { scroll: false });
    }
  };


  const renderDashboardView = () => {
    if (isLoading && !initialLoadDone) {
        return <div className="flex justify-center items-center h-full"><p className="text-xl accent-text">Loading Dashboard...</p></div>;
    }
    if (status === "unauthenticated") { 
        return <div className="flex justify-center items-center h-full"><p className="text-xl accent-text">Redirecting to login...</p></div>;
    }
    const dashboardDataProps = {
      tasks: tasks.filter(t => currentProjectName === "All Projects" || t.category === currentProjectName),
      goals: goals.filter(g => currentProjectName === "All Projects" || g.category === currentProjectName),
      notes: notes.filter(n => currentProjectName === "All Projects" || n.category === currentProjectName).sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()),
      events: events.filter(e => currentProjectName === "All Projects" || e.category === currentProjectName),
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
                currentProjectId={currentProjectName === "All Projects" ? null : currentProjectName} 
                onNavigateToItem={navigateToItemHandler}
            />
          </div>
          <GoalsWidget goals={dashboardDataProps.goals} onNavigate={() => { setViewMode('goals'); router.push('/?view=goals', { scroll: false }); }} />
          <QuickNotesWidget 
            notes={dashboardDataProps.notes} 
            onNavigate={() => navigateToNotesView()} 
           />
        </div>
    );
  }

  const renderView = () => {
    const projectNamesForDropdown = projects.map(p => p.name);
    let activeCurrentProjectForView: Category = "All Projects";
    if (projectNamesForDropdown.includes(currentProjectName)) {
        activeCurrentProjectForView = currentProjectName;
    } else if (currentProjectName !== "All Projects" && projectNamesForDropdown.length > 0) {
        activeCurrentProjectForView = projectNamesForDropdown.find(p => p !== "All Projects") || projectNamesForDropdown[0];
    } else if (projectNamesForDropdown.length > 0) {
         activeCurrentProjectForView = projectNamesForDropdown.find(p => p !== "All Projects") || projectNamesForDropdown[0];
    } else if (DEFAULT_PROJECTS.length > 0) {
        activeCurrentProjectForView = DEFAULT_PROJECTS[0].name;
    }


    const commonViewProps = {
        categories: projectNamesForDropdown.filter(name => name !== "All Projects"), 
        currentCategory: activeCurrentProjectForView,
        onClose: () => { 
            setViewMode('dashboard'); 
            setEditingNoteId(null);
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
        return <TasksView {...commonViewProps} tasks={tasks} goals={goals} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} onUpdateTask={handleUpdateTask} />;
      case 'goals':
        return <GoalsView {...commonViewProps} goals={goals} onAddGoal={handleAddGoal} onUpdateGoal={handleUpdateGoal} onDeleteGoal={handleDeleteGoal} />;
      case 'notes':
        const noteToEdit = editingNoteId ? notes.find(n => n.id === editingNoteId) : undefined;
        return <NotesView 
                    {...commonViewProps} 
                    categories={projects.map(p=>p.name).filter(name => name !== "All Projects")} 
                    noteToEdit={noteToEdit} 
                    notes={notes} 
                    onAddNote={handleAddNote} 
                    onUpdateNote={handleUpdateNote} 
                    onDeleteNote={handleDeleteNote} 
                />;
      case 'calendar':
        return <CalendarFullScreenView {...commonViewProps} events={events} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />;
      case 'dashboard':
      default:
        return renderDashboardView();
    }
  };

  if (status === "loading" && !initialLoadDone) {
    return (
        <div className="flex flex-col min-h-screen h-screen max-h-screen overflow-hidden">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+1rem)] flex justify-center items-center"> 
                <p className="text-xl accent-text">Initializing AIDA...</p>
            </main>
        </div>
    );
  }
  if (status === "unauthenticated" && (pathname === "/" || !["/login", "/register", "/landing"].includes(pathname))) {
     return (
        <div className="flex flex-col min-h-screen h-screen max-h-screen overflow-hidden">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+1rem)] flex justify-center items-center"> 
                <p className="text-xl accent-text">Redirecting to login...</p>
            </main>
        </div>
     );
  }

  const isFullScreenViewActive = viewMode === 'notes' || viewMode === 'tasks' || viewMode === 'goals' || viewMode === 'calendar';
  const showFooterChat = status === "authenticated" && !["/login", "/register", "/landing"].includes(pathname);

  let mainPaddingTop = "pt-[5rem]"; 
  if (isAiChatModeActive) {
    mainPaddingTop = "pt-[5rem]"; 
  } else if (!isFullScreenViewActive) { 
     mainPaddingTop = "pt-[calc(5rem+1rem)]"; 
  }
  
  let mainHeightCss = 'calc(100vh - 5rem - 70px)'; 
  if (isFullScreenViewActive) {
    mainHeightCss = 'calc(100vh - 5rem - 70px)'; 
  } else if (!isAiChatModeActive) { 
    mainHeightCss = 'calc(100vh - 5rem - 70px - 1rem)';
  }
  
  const availableProjectsForHeaderDropdown = [{id: 'all-projects-pseudo-id', userId: typedSessionUser?.id || 'system', name: "All Projects", createdAt: new Date().toISOString()}, ...projects];


  return (
    <div className="flex flex-col min-h-screen h-screen max-h-screen overflow-hidden">
      <Header 
        currentProjectName={currentProjectName}
        onProjectChange={onProjectChange}
        availableProjects={availableProjectsForHeaderDropdown}
        onManageProjects={() => setIsProjectModalOpen(true)}
      />
      <main 
        className={cn(
            "flex-grow overflow-y-auto custom-scrollbar-fullscreen", 
            isAiChatModeActive && "flex justify-center", 
            (isFullScreenViewActive || isAiChatModeActive) ? "p-0" : "px-6 pb-6", 
            mainPaddingTop
        )}
        style={{ height: mainHeightCss }}
      >
        {renderView()}
      </main>
      {showFooterChat && (
        <FooterChat 
            onSendCommand={handleCommandFromFooter} 
            onSendAudioCommand={handleAudioCommandFromFooter}
            isProcessingAi={isProcessingAi}
            isAiChatModeActive={isAiChatModeActive}
            currentChatInput={currentFooterChatMessage}
            onChatInputChange={setCurrentFooterChatMessage}
        />
      )}
      <ProjectManagementModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projects={projects}
        onAddProject={handleAddProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
}
