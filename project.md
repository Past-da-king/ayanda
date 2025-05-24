

## public/manifest.json
```json
{
  "name": "AIDA - Intelligent Assistant",
  "short_name": "AIDA",
  "description": "Your intelligent personal assistant and dashboard, designed to streamline your tasks, goals, notes, and events with the power of AI.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0F14",
  "theme_color": "#00DCFF",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## public/sw.js
```javascript
// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.

const CACHE_NAME = 'aida-cache-v1';
const urlsToCache = [
  '/',
  '/landing',
  '/login',
  '/register',
  '/profile',
  '/manifest.json',
  // Add paths to your core CSS and JS bundles if known and static
  // e.g., '/_next/static/css/...', '/_next/static/chunks/...'
  // These are usually hashed, so a more dynamic approach or workbox might be better for production.
  // For a basic PWA, caching the main routes is a start.
  '/favicon.ico', // Example, your favicon
  '/icons/icon-192x192.png', // Example icon
  '/icons/icon-512x512.png'  // Example icon
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add essential assets that make up the app shell
        // Be careful with caching too many dynamic Next.js assets here without a proper strategy
        return cache.addAll(urlsToCache.filter(url => !url.startsWith('/_next/static/'))); // Avoid caching dev bundles directly
      })
      .catch(err => {
        console.error('Failed to cache urls on install:', err);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests, try network first, then cache (NetworkFallingToCache)
  // This ensures users get the latest HTML, but can fallback to cached version if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful, cache the response for future offline use
          // Check if we received a valid response
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/'); // Fallback to home page or a generic offline page
            });
        })
    );
    return;
  }

  // For other requests (CSS, JS, images), use a CacheFirst strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Cache hit - return response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network, then cache it
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});
```

## src/app/layout.tsx
```typescript
// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
import type { Metadata, Viewport } from "next"; // Added Viewport
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthSessionProvider from "@/components/auth/AuthSessionProvider";
import { ThemeProvider, FOUTPreventionScript } from "@/context/ThemeContext";
import {
  inter,
  orbitronFont,
  geistSans,
  manrope,
  lexend,
  poppins,
  jetbrainsMono,
  lora
} from '@/lib/fonts';

export const metadata: Metadata = {
  title: "AIDA",
  description: "Your personal assistant and dashboard.",
  manifest: "/manifest.json", // Added manifest link
  icons: [ // Added basic icons for PWA
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
    { rel: "icon", url: "/favicon.ico" },
  ],
};

// Added Viewport configuration for PWA theme color
export const viewport: Viewport = {
  themeColor: "#00DCFF", // Default theme color from manifest
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <FOUTPreventionScript />
        {/* PWA specific meta tags - manifest is in metadata now */}
        {/* <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AIDA" /> */}
        {/* theme-color is handled by viewport export */}
      </head>
      <body
        className={cn(
          inter.variable,
          orbitronFont.variable,
          geistSans.variable,
          manrope.variable,
          lexend.variable,
          poppins.variable,
          jetbrainsMono.variable,
          lora.variable,
          "antialiased min-h-screen bg-background text-foreground"
        )}
      >
        <AuthSessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
```

## src/app/HomePageContent.tsx
```typescript
// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react'; 
import { usePathname, useRouter, useSearchParams } from 'next/navigation'; 

import { Header } from '@/components/layout/Header';
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


const DEFAULT_PROJECTS: Omit<Project, 'userId'>[] = [
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

  // PWA Service Worker Registration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('Service Worker registered with scope:', registration.scope))
        .catch(error => console.log('Service Worker registration failed:', error));
    }
  }, []);


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
                body: JSON.stringify({ name: defaultProject.name }),
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
        // Mobile: Single column grid. Desktop: 4 columns.
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 h-full">
          {/* Column 1: AI and Tasks - Takes full width on mobile, specific spans on larger screens */}
          <div className="md:col-span-1 lg:col-span-1 lg:row-span-2 flex flex-col gap-5 md:gap-6">
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
                className="flex-grow" // Ensures it takes available space in the flex column
            />
          </div>
          {/* Column 2: Calendar and Due Soon */}
          <div className="md:col-span-1 lg:col-span-1 flex flex-col space-y-5 md:space-y-6">
            <CalendarWidget events={dashboardDataProps.events} onNavigate={() => { setViewMode('calendar'); router.push('/?view=calendar', { scroll: false }); }} />
            <DueSoonWidget 
                tasks={tasks} 
                events={events} 
                currentProjectId={currentProjectName === "All Projects" ? null : currentProjectName} 
                onNavigateToItem={navigateToItemHandler}
            />
          </div>
          {/* Column 3: Goals */}
          <div className="md:col-span-1 lg:col-span-1">
            <GoalsWidget goals={dashboardDataProps.goals} onNavigate={() => { setViewMode('goals'); router.push('/?view=goals', { scroll: false }); }} />
          </div>
          {/* Column 4: Quick Notes */}
          <div className="md:col-span-1 lg:col-span-1">
            <QuickNotesWidget 
              notes={dashboardDataProps.notes} 
              onNavigate={() => navigateToNotesView()} 
            />
          </div>
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
            <div className="h-full w-full max-w-4xl mx-auto"> {/* Max width for chat view */}
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
     mainPaddingTop = "pt-[calc(5rem+1rem)]"; // Header + gap for non-fullscreen views
  }
  
  // Adjust main height considering the footer chat bar (~70px height with padding)
  let mainHeightCss = 'calc(100vh - 5rem)'; // Base: viewport height - header height
  if (showFooterChat) {
    mainHeightCss = `calc(100vh - 5rem - ${isAiChatModeActive ? '70px' : '86px'})`; // header + footer + potential gap for dashboard
  }
   if (!isFullScreenViewActive && !isAiChatModeActive) { // Dashboard view with project selector bar space
    mainHeightCss = `calc(100vh - 5rem - 86px - 1rem)`; // Header + Footer + TopGap
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
            isAiChatModeActive && "flex justify-center", // Center chat view content
            (isFullScreenViewActive || isAiChatModeActive) ? "p-0" : "px-4 sm:px-6 pb-6", // Padding for dashboard
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
```

## src/components/views/CalendarFullScreenView.tsx
```typescript
// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Event as AppEvent, Category, RecurrenceRule } from '@/types';
import { cn } from '@/lib/utils';
import { X, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Repeat, Eye, Pencil } from 'lucide-react';
import { DateFormatter } from "react-day-picker";
import { format, parseISO, isValid as isValidDate, add, startOfDay, isSameDay } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const DISABLE_RECURRENCE_VALUE_CALENDAR = "_DISABLE_RECURRENCE_CALENDAR_";

type RecurrenceTypeOption = RecurrenceRule['type'] | typeof DISABLE_RECURRENCE_VALUE_CALENDAR | '';


const MarkdownCheatsheet: React.FC = () => (
  <div className="p-3 text-xs space-y-1 text-muted-foreground bg-popover border border-border rounded-md shadow-md w-64">
    <p><strong># H1</strong>, <strong>## H2</strong>, <strong>### H3</strong></p>
    <p><strong>**bold**</strong> or __bold__</p>
    <p><em>*italic*</em> or _italic_</p>
    <p>~<sub>~</sub>Strikethrough~<sub>~</sub></p>
    <p>Unordered List: <br />- Item 1<br />- Item 2</p>
    <p>Ordered List: <br />1. Item 1<br />2. Item 2</p>
    <p>Checklist: <br />- [ ] To do<br />- [x] Done</p>
    <p>[Link Text](https://url.com)</p>
    <p>`Inline code`</p>
    <p>```<br />Code block<br />```</p>
  </div>
);

const EventRecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
  startDate: string;
}> = ({ recurrence, onChange, startDate }) => {
  const [type, setType] = useState<RecurrenceTypeOption>(recurrence?.type || '');
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    setType(recurrence?.type || '');
    setIntervalValue(recurrence?.interval || 1);
    setDaysOfWeek(recurrence?.daysOfWeek || []);
    setEndDate(recurrence?.endDate || '');
  }, [recurrence]);

  useEffect(() => {
    let newRuleCalculated: RecurrenceRule | undefined = undefined;
    if (type && type !== DISABLE_RECURRENCE_VALUE_CALENDAR && interval > 0) {
        newRuleCalculated = { type: type as RecurrenceRule['type'], interval };
        if (type === 'weekly') {
            if (daysOfWeek.length > 0) {
                newRuleCalculated.daysOfWeek = [...daysOfWeek].sort((a, b) => a - b);
            } else if (startDate && isValidDate(parseISO(startDate))) {
                const startDay = parseISO(startDate + 'T00:00:00Z').getDay();
                newRuleCalculated.daysOfWeek = [startDay];
            }
        }
        if (endDate && isValidDate(parseISO(endDate))) {
            newRuleCalculated.endDate = endDate;
        } else if (newRuleCalculated?.endDate) {
            delete newRuleCalculated.endDate;
        }
    }
    if (JSON.stringify(newRuleCalculated) !== JSON.stringify(recurrence)) {
        onChange(newRuleCalculated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, interval, daysOfWeek, endDate, startDate, recurrence]);

  const handleTypeChangeInternal = (selectedValue: string) => {
    const newType = selectedValue as RecurrenceTypeOption;
    setType(newType);
    if (newType === DISABLE_RECURRENCE_VALUE_CALENDAR) {
        onChange(undefined);
    }
  };

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => {
        const newDays = prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex];
        return newDays;
    });
  };

  if (!type && !recurrence) {
    return <Button variant="outline" size="sm" onClick={() => handleTypeChangeInternal('weekly')} className="w-full input-field text-xs justify-start font-normal"><Repeat className="w-3 h-3 mr-1.5"/>Set Recurrence</Button>
  }

  return (
    <div className="space-y-2 p-3 border border-border-main rounded-md bg-input-bg/50 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => handleTypeChangeInternal(DISABLE_RECURRENCE_VALUE_CALENDAR)}><X className="w-3 h-3"/></Button>
      </div>
      <Select
        value={type || DISABLE_RECURRENCE_VALUE_CALENDAR}
        onValueChange={handleTypeChangeInternal}
      >
        <SelectTrigger className="input-field text-xs h-8"><SelectValue placeholder="No Recurrence" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (on start date&apos;s day)</SelectItem>
          <SelectItem value="yearly">Yearly (on start date)</SelectItem>
          <SelectItem value={DISABLE_RECURRENCE_VALUE_CALENDAR}>Disable Recurrence</SelectItem>
        </SelectContent>
      </Select>
      {type && type !== DISABLE_RECURRENCE_VALUE_CALENDAR && (
        <>
            <Input type="number" min="1" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval" className="input-field text-xs h-8" />
            {type === 'weekly' && (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                {weekDays.map((day, i) => (
                    <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-[10px] flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
                    {day}
                    </Button>
                ))}
                </div>
            )}
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" title="Recurrence End Date" className="input-field text-xs h-8" />
        </>
      )}
    </div>
  );
};

interface CalendarFullScreenViewProps {
  events: AppEvent[];
  categories: Category[];
  currentCategory: Category;
  onAddEvent: (eventData: Omit<AppEvent, 'id' | 'userId'>) => void;
  onUpdateEvent: (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id' | 'userId'>>) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  date: string;
  time: string;
  category: Category;
  description?: string;
  recurrenceRule?: RecurrenceRule;
}

export function CalendarFullScreenView({
  events, categories, currentCategory, onAddEvent, onUpdateEvent, onDeleteEvent, onClose
}: CalendarFullScreenViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [isPreviewingDescription, setIsPreviewingDescription] = useState(false);

  const resolvedInitialCategoryForForm = useMemo<Category>(() => {
    if (currentCategory !== "All Projects" && categories.includes(currentCategory)) {
        return currentCategory;
    }
    const firstSpecificCategory = categories.find(c => c !== "All Projects" && c !== undefined);
    if (firstSpecificCategory) {
        return firstSpecificCategory;
    }
    const firstCat = categories.length > 0 && categories[0] !== "All Projects" ? categories[0] : undefined;
    return firstCat || "Personal Life" as Category;
  }, [currentCategory, categories]);

  const [formData, setFormData] = useState<EventFormData>(() => {
    return {
        title: '',
        date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
        time: '12:00',
        category: resolvedInitialCategoryForForm,
        description: '',
        recurrenceRule: undefined,
    };
  });

  useEffect(() => {
    if (!showEventForm && !editingEvent) {
      const newDefaultDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      setFormData(prev => {
        if (prev.category !== resolvedInitialCategoryForForm || prev.date !== newDefaultDate) {
          return {
            title: '',
            description: '',
            recurrenceRule: undefined,
            time: '12:00',
            category: resolvedInitialCategoryForForm,
            date: newDefaultDate
          };
        }
        return prev;
      });
    }
  }, [selectedDate, resolvedInitialCategoryForForm, showEventForm, editingEvent]);


  const handleShowNewEventForm = () => {
    setEditingEvent(null);
    setIsPreviewingDescription(false);
    const newDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    setFormData({
      title: '',
      date: newDate,
      time: '12:00',
      category: resolvedInitialCategoryForForm,
      description: '',
      recurrenceRule: undefined,
    });
    setShowEventForm(true);
  };

  useEffect(() => {
    if (editingEvent) {
      const eventDateObj = parseISO(editingEvent.date);
      const isValidSpecificCategory = categories.includes(editingEvent.category as Category);
      const categoryToSetForForm: Category = isValidSpecificCategory
        ? editingEvent.category as Category
        : resolvedInitialCategoryForForm;

      setFormData({
        title: editingEvent.title,
        date: format(eventDateObj, 'yyyy-MM-dd'),
        time: format(eventDateObj, 'HH:mm'),
        category: categoryToSetForForm,
        description: editingEvent.description || '',
        recurrenceRule: editingEvent.recurrenceRule,
      });
      setShowEventForm(true);
      setIsPreviewingDescription(false);
    }
  }, [editingEvent, categories, resolvedInitialCategoryForForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = useCallback((newCategoryValue: string) => {
    setFormData(prevFormData => {
      if (newCategoryValue !== prevFormData.category) {
        const foundCategory = categories.find(cat => cat === newCategoryValue);
        if (foundCategory) {
          return { ...prevFormData, category: foundCategory };
        }
        return prevFormData;
      }
      return prevFormData;
    });
  }, [categories]);

  const handleRecurrenceChange = useCallback((newRule: RecurrenceRule | undefined) => {
    setFormData(prevFormData => {
      if (JSON.stringify(newRule) !== JSON.stringify(prevFormData.recurrenceRule)) {
        return { ...prevFormData, recurrenceRule: newRule };
      }
      return prevFormData;
    });
  }, []);

  const resetForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setIsPreviewingDescription(false);
    const newDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    setFormData({
      title: '',
      date: newDate,
      time: '12:00',
      category: resolvedInitialCategoryForForm,
      description: '',
      recurrenceRule: undefined,
    });
  };

  const handleSubmitEvent = () => {
    if (!formData.title || !formData.date || !formData.time) {
        return;
    }
    const dateTimeString = `${formData.date}T${formData.time}:00.000Z`;
    const eventDataSubmit = {
        title: formData.title,
        date: dateTimeString,
        category: formData.category,
        description: formData.description,
        recurrenceRule: formData.recurrenceRule,
    };
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventDataSubmit);
    } else {
      onAddEvent(eventDataSubmit);
    }
    resetForm();
  };

  const getNextOccurrence = (event: AppEvent, fromDate: Date): Date | null => {
    if (!event.recurrenceRule) return null;
    const rule = event.recurrenceRule;
    const baseDate = startOfDay(parseISO(event.date));
    const checkDate = startOfDay(fromDate);

    if (rule.endDate && checkDate > startOfDay(parseISO(rule.endDate))) return null;

    for(let i=0; i< 365; i++) { // Limit search to avoid infinite loops for misconfigured rules
        let currentIterDate: Date;
        switch(rule.type) {
            case 'daily':
                currentIterDate = add(baseDate, { days: rule.interval * i });
                break;
            case 'weekly':
                currentIterDate = add(baseDate, { weeks: rule.interval * i });
                if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                    const baseDayOfWeek = currentIterDate.getDay();
                    // Find the next valid day in this week or the start of the next interval's week
                    let dayOffset = Infinity;
                    for (const dow of rule.daysOfWeek) {
                        if (dow >= baseDayOfWeek) {
                            dayOffset = Math.min(dayOffset, dow - baseDayOfWeek);
                        } else { // Day has passed in the current week iteration, check for next week
                           dayOffset = Math.min(dayOffset, (dow - baseDayOfWeek) + 7);
                        }
                    }
                     if(dayOffset !== Infinity) currentIterDate = add(currentIterDate, { days: dayOffset });
                }
                break;
            case 'monthly':
                currentIterDate = add(baseDate, { months: rule.interval * i});
                // Adjust day if it exceeds the number of days in the target month
                if (currentIterDate.getDate() !== baseDate.getDate()) {
                    const lastDayOfMonth = new Date(currentIterDate.getFullYear(), currentIterDate.getMonth() + 1, 0).getDate();
                    currentIterDate.setDate(Math.min(baseDate.getDate(), lastDayOfMonth));
                }
                break;
            case 'yearly':
                currentIterDate = add(baseDate, { years: rule.interval * i});
                // Ensure month and day match, e.g. for Feb 29 on non-leap years
                if (currentIterDate.getMonth() !== baseDate.getMonth() || currentIterDate.getDate() !== baseDate.getDate()) {
                     const targetMonthDays = new Date(currentIterDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
                     currentIterDate = new Date(currentIterDate.getFullYear(), baseDate.getMonth(), Math.min(baseDate.getDate(), targetMonthDays));
                }
                break;
            default: return null;
        }
        currentIterDate = startOfDay(currentIterDate);

        if(currentIterDate >= checkDate) {
             if (rule.endDate && currentIterDate > startOfDay(parseISO(rule.endDate))) return null;
            return currentIterDate;
        }
    }
    return null;
  };

  const getEventsForDay = (day: Date): AppEvent[] => {
    const dayStart = startOfDay(day);
    return events.flatMap(event => {
      if (!event) return [];
      const eventBaseDate = startOfDay(parseISO(event.date));
      const results: AppEvent[] = [];
      if (isSameDay(eventBaseDate, dayStart)) {
        results.push(event);
      }
      if (event.recurrenceRule) {
        const next = getNextOccurrence(event, dayStart);
        if (next && isSameDay(next, dayStart) && !isSameDay(eventBaseDate, dayStart)) { // Only add if it's a recurring instance not the original
          results.push({
            ...event, // Spread original event to keep its ID
            date: format(dayStart, 'yyyy-MM-dd') + 'T' + format(parseISO(event.date), 'HH:mm:ss.SSS') + 'Z', // Set date to the current recurring day but keep original time
          });
        }
      }
      return results;
    }) // Deduplicate events by ID if the original and a recurrence fall on the same day
    .filter((event, index, self) => index === self.findIndex((e) => e.id === event.id ));
  };


  const DayCellContent: DateFormatter = (day, options): React.ReactNode => {
    const dayEvents = getEventsForDay(day);
    const hasEvent = dayEvents.length > 0;
    const firstEventTitle = hasEvent ? dayEvents[0].title : '';

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-start pt-1 overflow-hidden">
        <span className={cn("text-xs", hasEvent && "font-semibold text-base mb-0.5")}>
            {format(day, "d", { locale: options?.locale })}
        </span>
        {hasEvent && (
          <span className="text-[10px] leading-tight text-primary truncate w-full px-1 text-center">
            {firstEventTitle}
          </span>
        )}
        {dayEvents.length > 1 && ( // Show a small indicator for multiple events
           <span className="absolute top-1 right-1 text-[8px] bg-accent text-accent-foreground rounded-full w-3 h-3 flex items-center justify-center">{dayEvents.length}</span>
        )}
         {hasEvent && ! (dayEvents.length > 1) && ( // Dot for single event
          <span className={cn(
              "absolute bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-primary opacity-70"
          )} />
        )}
      </div>
    );
  };

  const eventsForSelectedDay = selectedDate ? getEventsForDay(selectedDate)
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];


  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-4 sm:p-6 flex flex-col", // Responsive padding
        "pt-[calc(5rem+2.75rem+1rem)] sm:pt-[calc(5rem+2.75rem+1.5rem)]" // Responsive top padding
    )}>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="font-orbitron text-2xl sm:text-3xl accent-text">Calendar</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-1 sm:p-2 rounded-md hover:bg-input-bg">
                <X className="w-6 sm:w-7 h-6 sm:h-7" />
            </Button>
        </div>

        {/* Layout for mobile: stack calendar and details. Desktop: side-by-side */}
        <div className="flex-grow flex flex-col md:flex-row gap-4 sm:gap-6 overflow-hidden">
            {/* Calendar Panel - takes full width on mobile, specific width on md+ */}
            <div className="w-full md:w-2/3 lg:w-3/4 bg-widget-background border border-border-main rounded-md p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start custom-scrollbar-fullscreen overflow-y-auto md:overflow-y-visible">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(day) => {
                        setSelectedDate(day);
                         if (day) setShowEventForm(false); // Close form when a new day is selected
                    }}
                    month={viewMonth}
                    onMonthChange={(month) => {
                        setViewMonth(month);
                    }}
                    className="w-full"
                    classNames={{
                        root: "w-full",
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4 w-full",
                        caption: "flex justify-center pt-1 relative items-center h-10 mb-2",
                        caption_label: "text-lg sm:text-xl font-orbitron accent-text",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-7 w-7 sm:h-8 sm:w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
                            "rounded-md hover:bg-accent/20 text-muted-foreground hover:text-accent-foreground transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full mb-1",
                        head_cell: "text-muted-foreground rounded-md w-[14.28%] text-[10px] sm:text-xs font-medium p-1 h-8 justify-center",
                        row: "flex w-full mt-1 sm:mt-2", // Responsive row margin
                        cell: cn(
                            "text-center text-sm p-0 relative w-[14.28%] h-16 sm:h-20 md:h-24 focus-within:relative focus-within:z-20", // Responsive cell height
                        ),
                        day: cn(
                            "w-full h-full p-0 font-normal rounded-md",
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "transition-colors flex flex-col items-center justify-start"
                        ),
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground ring-1 ring-primary/60",
                        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50 pointer-events-none",
                    }}
                    components={{
                        IconLeft: ({ ...props }) => <ChevronLeft {...props} className="h-4 w-4 sm:h-5 sm:w-5" />,
                        IconRight: ({ ...props }) => <ChevronRight {...props} className="h-4 w-4 sm:h-5 sm:w-5" />,
                    }}
                    formatters={{ formatDay: DayCellContent }}
                    showOutsideDays
                    fixedWeeks
                />
            </div>

            {/* Details/Form Panel - takes full width on mobile, specific width on md+ */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-widget-background border border-border-main rounded-md p-3 sm:p-4 flex flex-col space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar-fullscreen">
                <Button onClick={handleShowNewEventForm} className="w-full btn-primary text-sm sm:text-base">
                    <PlusCircle className="w-4 h-4 mr-2"/> Add Event
                </Button>

                {showEventForm && (
                    <div className="p-3 border border-border-main rounded-md bg-input-bg/70 space-y-3">
                        <h3 className="font-orbitron text-base sm:text-lg accent-text">{editingEvent ? 'Edit Event' : 'New Event'}</h3>
                        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} className="input-field text-sm sm:text-base" disabled={isPreviewingDescription}/>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input name="date" type="date" value={formData.date} onChange={handleInputChange} className="input-field text-sm flex-1" disabled={isPreviewingDescription}/>
                            <Input name="time" type="time" value={formData.time} onChange={handleInputChange} className="input-field text-sm flex-1" disabled={isPreviewingDescription}/>
                        </div>
                        <Select name="category" value={formData.category} onValueChange={handleCategoryChange} disabled={isPreviewingDescription}>
                            <SelectTrigger className="input-field text-sm"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main">
                                {categories.map(cat => {
                                    return <SelectItem key={cat} value={cat}>{cat}</SelectItem>;
                                })}
                            </SelectContent>
                        </Select>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="event-description" className="text-xs text-muted-foreground">Description (Markdown)</label>
                                <div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-6 px-1">Help</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                                    </Popover>
                                    <Button variant="ghost" size="icon" onClick={() => setIsPreviewingDescription(!isPreviewingDescription)} className="w-6 h-6 ml-1">
                                        {isPreviewingDescription ? <Pencil className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                                    </Button>
                                </div>
                            </div>
                            {isPreviewingDescription ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none p-2 min-h-[60px] border border-dashed border-border-main rounded-md bg-background/50 overflow-y-auto">
                                    <ReactMarkdown>{formData.description || "Nothing to preview..."}</ReactMarkdown>
                                </div>
                            ) : (
                                <Textarea id="event-description" name="description" placeholder="Details... (Markdown supported)" value={formData.description || ''} onChange={handleInputChange} className="input-field min-h-[60px] text-sm"/>
                            )}
                        </div>
                        {!isPreviewingDescription &&
                            <EventRecurrenceEditor
                                recurrence={formData.recurrenceRule}
                                onChange={handleRecurrenceChange}
                                startDate={formData.date}
                            />
                        }
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSubmitEvent} className="flex-grow btn-primary text-sm" disabled={isPreviewingDescription}>{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
                            <Button variant="outline" onClick={resetForm} className="border-border-main text-muted-foreground hover:bg-background text-sm">Cancel</Button>
                        </div>
                    </div>
                )}

                {!showEventForm && selectedDate && (
                    <div>
                        <h3 className="font-orbitron text-base sm:text-lg accent-text mb-2">
                            Events: {format(selectedDate, 'MMM d, yyyy')}
                        </h3>
                        {eventsForSelectedDay.length > 0 ? (
                            <ul className="space-y-2">
                                {eventsForSelectedDay.map((event, idx) => (
                                    <li key={`${event.id}-${idx}`} className="p-2.5 bg-input-bg/70 border border-border-main rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-grow min-w-0"> {/* Ensure text truncates */}
                                                <p className="font-semibold text-sm text-foreground truncate">{event.title}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {format(parseISO(event.date), 'p')} - {event.category}
                                                    {event.recurrenceRule && <Repeat className="w-3 h-3 inline ml-1.5 text-muted-foreground/70"/>}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 shrink-0 ml-1">
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    const originalEvent = events.find(e => e.id === event.id);
                                                    setEditingEvent(originalEvent || event);
                                                }} className="btn-icon w-6 h-6"><Edit className="w-3.5 h-3.5"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => onDeleteEvent(event.id)} className="btn-icon danger w-6 h-6"><Trash2 className="w-3.5 h-3.5"/></Button>
                                            </div>
                                        </div>
                                        {event.description && (
                                            <div className="prose prose-sm dark:prose-invert max-w-none mt-1 pt-1 border-t border-border-main/50 text-foreground overflow-hidden">
                                               <ReactMarkdown>{event.description}</ReactMarkdown>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No events for this day.</p>
                        )}
                    </div>
                )}
                 {!showEventForm && !selectedDate && (
                    <p className="text-sm text-muted-foreground text-center py-4">Select a date to see events.</p>
                )}
            </div>
        </div>
    </div>
  );
}
```

## src/components/views/TasksView.tsx
```typescript
// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
"use client";

import React, { useState, useEffect } from 'react';
import { Task, Category, RecurrenceRule, SubTask, Goal } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, CalendarDays, PlusCircle, Repeat, ListPlus, CircleDot, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isValid as isValidDateFn } from 'date-fns';

const NO_GOAL_VALUE = "_NO_GOAL_LINKED_";
const DISABLE_RECURRENCE_VALUE = "_DISABLE_RECURRENCE_";

interface TasksViewProps {
  tasks: Task[];
  goals: Goal[];
  categories: Category[];
  currentCategory: Category;
  onAddTask: (taskData: Pick<Task, 'text' | 'category' | 'dueDate' | 'recurrenceRule' | 'subTasks' | 'linkedGoalId' | 'contributionValue'>) => void;
  onToggleTask: (taskId: string, subTaskId?: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, taskUpdateData: Partial<Omit<Task, 'id'>>) => void;
  onClose: () => void;
}

const RecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
}> = ({ recurrence, onChange }) => {
  const [type, setType] = useState(recurrence?.type || '');
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    setType(recurrence?.type || '');
    setIntervalValue(recurrence?.interval || 1);
    setDaysOfWeek(recurrence?.daysOfWeek || []);
    setEndDate(recurrence?.endDate || '');
  },[recurrence])

  useEffect(() => {
    if (type && type !== DISABLE_RECURRENCE_VALUE && interval > 0) {
      const newRule: RecurrenceRule = { type: type as RecurrenceRule['type'], interval };
      if (type === 'weekly' && daysOfWeek.length > 0) newRule.daysOfWeek = daysOfWeek.sort((a,b)=> a-b);
      if (endDate) newRule.endDate = endDate;
      onChange(newRule);
    } else if (type === DISABLE_RECURRENCE_VALUE || type === '') {
      onChange(undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, interval, daysOfWeek, endDate]); 

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort());
  };
  const handleTypeChange = (val: string) => {
    if (val === DISABLE_RECURRENCE_VALUE) {
      setType(DISABLE_RECURRENCE_VALUE);
      onChange(undefined);
    } else {
      setType(val as RecurrenceRule['type']);
    }
  };

  if (!recurrence && type === '' && type !== DISABLE_RECURRENCE_VALUE) {
    return <Button variant="outline" onClick={() => setType('weekly')} className="input-field text-xs sm:text-sm justify-start font-normal h-auto py-2 sm:py-2.5"><Repeat className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-2 text-muted-foreground"/>Set Recurrence</Button>
  }
  return (
    <div className="space-y-2 sm:space-y-3 p-2 sm:p-3 border border-border-main rounded-md bg-input-bg/50">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-5 h-5 sm:w-6 sm:h-6" onClick={() => { onChange(undefined); setType(DISABLE_RECURRENCE_VALUE); }}><X className="w-3 h-3 sm:w-3.5 sm:h-3.5"/></Button>
      </div>
      <Select value={type || DISABLE_RECURRENCE_VALUE} onValueChange={handleTypeChange}>
        <SelectTrigger className="input-field text-xs h-8"><SelectValue placeholder="Select type..."/></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (on start date&apos;s day)</SelectItem>
          <SelectItem value="yearly">Yearly (on start date)</SelectItem>
          <SelectItem value={DISABLE_RECURRENCE_VALUE}>Disable Recurrence</SelectItem>
        </SelectContent>
      </Select>
      {type && type !== DISABLE_RECURRENCE_VALUE && <>
        <Input type="number" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval (e.g., 1 for every, 2 for every other)" title="Repeat every X (days/weeks/months/years)" className="input-field text-xs h-8" />
        {type === 'weekly' && (
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-7">
            {weekDays.map((day, i) => (
                <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-[10px] flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
                {day}
                </Button>
            ))}
            </div>
        )}
        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" title="Recurrence End Date" className="input-field text-xs h-8" />
      </>}
    </div>
  );
};

export function TasksView({ tasks, goals, categories, currentCategory, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, onClose }: TasksViewProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>(currentCategory === "All Projects" && categories.length > 0 ? categories[0] : currentCategory);
  const [newRecurrenceRule, setNewRecurrenceRule] = useState<RecurrenceRule | undefined>(undefined);
  const [newSubTasks, setNewSubTasks] = useState<Omit<SubTask, 'id' | 'completed'>[]>([]);
  const [newLinkedGoalId, setNewLinkedGoalId] = useState<string | undefined>(undefined);
  const [newContributionValue, setNewContributionValue] = useState<number>(1);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    if (currentCategory === "All Projects" && categories.length > 0 && categories[0]) {
        setNewTaskCategory(categories[0]);
    } else if (categories.includes(currentCategory)) {
        setNewTaskCategory(currentCategory);
    } else if (categories.length > 0 && categories[0]) {
        setNewTaskCategory(categories[0]);
    }
  }, [currentCategory, categories]);

  const resetNewTaskForm = () => {
    setNewTaskText('');
    setNewTaskDueDate('');
    setNewRecurrenceRule(undefined);
    setNewSubTasks([]);
    setNewLinkedGoalId(undefined);
    setNewContributionValue(1);
    if (currentCategory === "All Projects" && categories.length > 0 && categories[0]) setNewTaskCategory(categories[0]);
    else if (categories.includes(currentCategory)) setNewTaskCategory(currentCategory);
    else if (categories.length > 0 && categories[0]) setNewTaskCategory(categories[0]);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const taskData: Pick<Task, 'text' | 'category' | 'dueDate' | 'recurrenceRule' | 'subTasks' | 'linkedGoalId' | 'contributionValue'> = {
        text: newTaskText.trim(),
        category: newTaskCategory,
        dueDate: newTaskDueDate || undefined,
        recurrenceRule: newRecurrenceRule,
        subTasks: newSubTasks.filter(st => st.text.trim() !== '').map(st => ({id: uuidv4(), text: st.text, completed: false})),
        linkedGoalId: newLinkedGoalId,
        contributionValue: newLinkedGoalId ? newContributionValue : undefined,
      };
      onAddTask(taskData);
      resetNewTaskForm();
    }
  };

  const openEditModal = (task: Task) => { setEditingTask(task); setIsEditModalOpen(true); };
  const closeEditModal = () => { setEditingTask(null); setIsEditModalOpen(false); };

  const handleSaveEditedTask = (formData: {text: string; dueDate?: string; category: Category; recurrenceRule?: RecurrenceRule; subTasks?: SubTask[]; linkedGoalId?: string; contributionValue?: number;}) => {
    if (editingTask) {
        onUpdateTask(editingTask.id, {
            text: formData.text,
            dueDate: formData.dueDate,
            category: formData.category,
            recurrenceRule: formData.recurrenceRule,
            subTasks: formData.subTasks,
            linkedGoalId: formData.linkedGoalId,
            contributionValue: formData.linkedGoalId ? formData.contributionValue : undefined,
        });
        closeEditModal();
    }
  };

  const handleAddSubTaskToNew = () => setNewSubTasks([...newSubTasks, { text: '' }]);
  const handleNewSubTaskChange = (index: number, text: string) => {
    const updated = [...newSubTasks]; updated[index].text = text; setNewSubTasks(updated);
  };
  const handleRemoveSubTaskFromNew = (index: number) => {
    const updated = [...newSubTasks]; updated.splice(index, 1); setNewSubTasks(updated);
  };

  const filteredTasks = tasks
    .filter(task => (currentCategory === "All Projects" || task.category === currentCategory) && (showCompleted || !task.completed))
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const dateA = a.dueDate && isValidDateFn(parseISO(a.dueDate)) ? parseISO(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate && isValidDateFn(parseISO(b.dueDate)) ? parseISO(b.dueDate).getTime() : Infinity;
      if (dateA !== dateB) return dateA - dateB;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

  return (
    <div className={cn("fixed inset-0 z-[85] bg-background p-4 sm:p-6 flex flex-col", "pt-[calc(5rem+2.75rem+1rem)] sm:pt-[calc(5rem+2.75rem+1.5rem)]")}>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="font-orbitron text-2xl sm:text-3xl accent-text">Tasks</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-1 sm:p-2 rounded-md hover:bg-input-bg">
          <X className="w-6 sm:w-7 h-6 sm:h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-widget-background border border-border-main rounded-md p-4 sm:p-6 custom-scrollbar-fullscreen space-y-4 sm:space-y-6">
        <div className="space-y-3 p-3 sm:p-4 bg-input-bg border border-border-main rounded-md">
          <Input type="text" placeholder="Add new task..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="input-field text-base p-2 sm:p-3"/>
          <div className="pl-4 space-y-2">
            {newSubTasks.map((sub, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CircleDot className="w-3 h-3 text-muted-foreground/50 shrink-0"/>
                  <Input value={sub.text} onChange={(e) => handleNewSubTaskChange(index, e.target.value)} placeholder="Sub-task description" className="input-field text-xs sm:text-sm p-1 sm:p-1.5 h-7 sm:h-8 flex-grow"/>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveSubTaskFromNew(index)} className="w-6 h-6 sm:w-7 sm:h-7"><Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground hover:text-destructive"/></Button>
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddSubTaskToNew} className="text-xs border-border-main hover:bg-widget-background h-7 px-2"><ListPlus className="w-3 h-3 mr-1.5"/>Add sub-task</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-end pt-2">
            <Input type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} className="input-field text-xs sm:text-sm h-auto py-2 sm:py-2.5" title="Due Date"/>
            <Select value={newTaskCategory || (categories.length > 0 ? categories[0] : '')} onValueChange={(val) => setNewTaskCategory(val as Category)}>
              <SelectTrigger className="input-field text-xs sm:text-sm h-auto py-2 sm:py-2.5"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent className="bg-widget-background border-border-main text-text-main">
                {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-center pt-2">
            <Select value={newLinkedGoalId || NO_GOAL_VALUE} onValueChange={(val) => setNewLinkedGoalId(val === NO_GOAL_VALUE ? undefined : val)}>
                <SelectTrigger className="input-field text-xs sm:text-sm h-auto py-2 sm:py-2.5">
                    <SelectValue placeholder="Link to Goal (Optional)" />
                </SelectTrigger>
                <SelectContent className="bg-widget-background border-border-main text-text-main">
                    <SelectItem value={NO_GOAL_VALUE} className="text-muted-foreground">No Linked Goal</SelectItem>
                    {goals.filter(g => g.targetValue > (g.currentValue || 0)).map(goal => <SelectItem key={goal.id} value={goal.id}>{goal.name}</SelectItem>)}
                </SelectContent>
            </Select>
            {newLinkedGoalId && (
                <Input type="number" placeholder="Contribution Value" value={newContributionValue} onChange={(e) => setNewContributionValue(parseInt(e.target.value) || 1)} className="input-field text-xs sm:text-sm h-auto py-2 sm:py-2.5" min="0" />
            )}
          </div>
          <RecurrenceEditor recurrence={newRecurrenceRule} onChange={setNewRecurrenceRule} />
          <Button onClick={handleAddTask} className="btn-primary w-full mt-3 text-sm h-auto py-2 sm:py-2.5"><PlusCircle className="w-4 h-4 mr-2"/> Add Task</Button>
        </div>

        <div className="flex justify-end items-center">
           <label htmlFor="task-show-completed-fs" className="flex items-center text-xs text-muted-foreground cursor-pointer">
             <Checkbox id="task-show-completed-fs" checked={showCompleted} onCheckedChange={(checked) => setShowCompleted(Boolean(checked))} className="mr-1.5 h-3.5 w-3.5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"/> Show Completed
            </label>
        </div>

        <ul className="space-y-2 sm:space-y-2.5">
          {filteredTasks.map(task => {
            const linkedGoalName = task.linkedGoalId ? goals.find(g => g.id === task.linkedGoalId)?.name : null;
            return (
            <li key={task.id} className={cn("bg-input-bg border border-border-main rounded-md p-2.5 sm:p-3", task.completed && "opacity-60")}>
                <div className="flex justify-between items-start">
                    <div className="flex items-start flex-grow min-w-0">
                        <Checkbox id={`task-fs-${task.id}`} checked={task.completed} onCheckedChange={() => onToggleTask(task.id)} className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 mr-2 sm:mr-3 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"/>
                        <div className="flex-grow">
                            <span className={cn("text-sm sm:text-base block", task.completed && "line-through")}>{task.text}</span>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 flex items-center flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-0.5">
                                <span>{task.category}</span>
                                {task.dueDate && isValidDateFn(parseISO(task.dueDate)) && (<><span className="text-muted-foreground/50">•</span><span className="flex items-center"><CalendarDays className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline mr-1" />{format(parseISO(task.dueDate), 'MMM d, yyyy')}</span></>)}
                                {task.recurrenceRule && (<><span className="text-muted-foreground/50">•</span><span className="flex items-center"><Repeat className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline mr-1" />{task.recurrenceRule.type}</span></>)}
                                {linkedGoalName && (<><span className="text-muted-foreground/50">•</span><span className="flex items-center text-primary/80"><Link2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline mr-1" />{linkedGoalName} (+{task.contributionValue || 0})</span></>)}
                            </p>
                        </div>
                  </div>
                  <div className="flex items-center space-x-0 sm:space-x-0.5 shrink-0 ml-1 sm:ml-2">
                     <Button variant="ghost" size="icon" onClick={() => openEditModal(task)} className="btn-icon w-6 h-6 sm:w-7 sm:h-7"><Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Button>
                     <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="btn-icon danger w-6 h-6 sm:w-7 sm:h-7"><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Button>
                  </div>
                </div>
                {task.subTasks && task.subTasks.length > 0 && (
                    <div className="pl-6 sm:pl-8 mt-1.5 sm:mt-2 space-y-1 sm:space-y-1.5">
                        {task.subTasks.map(sub => (
                            <div key={sub.id} className="flex items-center text-xs sm:text-sm">
                                <Checkbox id={`subtask-fs-${task.id}-${sub.id}`} checked={sub.completed} onCheckedChange={() => onToggleTask(task.id, sub.id)} className="h-3.5 w-3.5 mr-2 border-muted-foreground data-[state=checked]:bg-primary/70 data-[state=checked]:border-primary/70 data-[state=checked]:text-primary-foreground"/>
                                <label htmlFor={`subtask-fs-${task.id}-${sub.id}`} className={cn("flex-grow cursor-pointer", sub.completed && "line-through text-muted-foreground")}>{sub.text}</label>
                            </div>
                        ))}
                    </div>
                )}
            </li>
          )})}
           {filteredTasks.length === 0 && (<p className="text-center text-muted-foreground py-10 text-sm sm:text-base">{showCompleted ? "No tasks here." : "No active tasks. Way to go!"}</p>)}
        </ul>
      </div>
      {isEditModalOpen && editingTask && (<EditTaskModal task={editingTask} goals={goals} categories={categories} onClose={closeEditModal} onSave={handleSaveEditedTask} />)}
    </div>
  );
}

interface EditTaskModalProps {
    task: Task;
    goals: Goal[];
    categories: Category[];
    onClose: () => void;
    onSave: (formData: {text: string; dueDate?: string; category: Category; recurrenceRule?: RecurrenceRule; subTasks?: SubTask[]; linkedGoalId?: string; contributionValue?: number;}) => void;
}
function EditTaskModal({ task, goals, categories, onClose, onSave }: EditTaskModalProps) {
    const [text, setText] = useState(task.text);
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [category, setCategory] = useState<Category>(task.category as Category);
    const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule | undefined>(task.recurrenceRule);
    const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks ? JSON.parse(JSON.stringify(task.subTasks)) : []);
    const [linkedGoalId, setLinkedGoalId] = useState<string | undefined>(task.linkedGoalId);
    const [contributionValue, setContributionValue] = useState<number>(task.contributionValue !== undefined ? task.contributionValue : 1);


    const handleAddSubTask = () => setSubTasks([...subTasks, { id: uuidv4(), text: '', completed: false }]);
    const handleSubTaskTextChange = (id: string, newText: string) => { setSubTasks(subTasks.map(st => st.id === id ? { ...st, text: newText } : st)); };
    const handleSubTaskToggle = (id: string) => { setSubTasks(subTasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st)); };
    const handleRemoveSubTask = (id: string) => setSubTasks(subTasks.filter(st => st.id !== id));

    const handleSubmit = () => {
        if(text.trim()) {
            const categoryToSave = categories.includes(category) && category ? category : (categories[0] || "Personal Life" as Category);
            onSave({ text: text.trim(), dueDate: dueDate || undefined, category: categoryToSave, recurrenceRule, subTasks: subTasks.filter(st=> st.text.trim() !== ''), linkedGoalId, contributionValue: linkedGoalId ? contributionValue : undefined });
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div className="bg-widget-background border border-border-main rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg shadow-2xl space-y-3 sm:space-y-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-border-main">
                    <h3 className="font-orbitron text-lg sm:text-xl accent-text">Edit Task</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text"><X className="w-4 h-4 sm:w-5 sm:h-5"/></Button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2 custom-scrollbar-fullscreen">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Task Description</label>
                        <Input value={text} onChange={e => setText(e.target.value)} placeholder="Task description" className="input-field p-2 sm:p-3 text-sm sm:text-base mt-1"/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Sub-tasks</label>
                        {subTasks.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2">
                            <Checkbox id={`edit-sub-${sub.id}`} checked={sub.completed} onCheckedChange={() => handleSubTaskToggle(sub.id)} className="h-4 w-4 border-muted-foreground"/>
                            <Input value={sub.text} onChange={e => handleSubTaskTextChange(sub.id, e.target.value)} className="input-field flex-grow text-xs sm:text-sm p-1 h-7 sm:h-8" placeholder="Sub-task description"/>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveSubTask(sub.id)} className="h-6 w-6 sm:h-7 sm:w-7"><Trash2 className="h-3 w-3 sm:h-3.5 sm:h-3.5 text-muted-foreground hover:text-destructive"/></Button>
                        </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={handleAddSubTask} className="text-xs border-border-main hover:bg-input-bg h-7 px-2"><ListPlus className="w-3 h-3 mr-1.5"/>Add sub-task</Button>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Details</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-1">
                            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-field p-2 sm:p-3 h-auto text-xs sm:text-sm" title="Due Date"/>
                            <Select value={category} onValueChange={val => setCategory(val as Category)}>
                                <SelectTrigger className="input-field p-2 sm:p-3 h-auto text-xs sm:text-sm"><SelectValue/></SelectTrigger>
                                <SelectContent className="bg-widget-background border-border-main">
                                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-center">
                        <Select value={linkedGoalId || NO_GOAL_VALUE} onValueChange={(val) => setLinkedGoalId(val === NO_GOAL_VALUE ? undefined : val)}>
                            <SelectTrigger className="input-field text-xs sm:text-sm h-auto py-2 sm:py-2.5"> <SelectValue placeholder="Link to Goal (Optional)" /></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main text-text-main">
                                <SelectItem value={NO_GOAL_VALUE} className="text-muted-foreground">No Linked Goal</SelectItem>
                                {goals.filter(g => g.id === task.linkedGoalId || g.targetValue > (g.currentValue || 0)).map(goal => <SelectItem key={goal.id} value={goal.id}>{goal.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {linkedGoalId && (
                             <Input type="number" placeholder="Contribution" title="Contribution Value" value={contributionValue} onChange={(e) => setContributionValue(parseInt(e.target.value) || 0)} className="input-field text-xs sm:text-sm h-auto py-2 sm:py-2.5" min="0" />
                        )}
                    </div>
                    <RecurrenceEditor recurrence={recurrenceRule} onChange={setRecurrenceRule}/>
                </div>

                <div className="flex justify-end pt-3 sm:pt-4 border-t border-border-main space-x-2 shrink-0">
                    <Button variant="outline" onClick={onClose} className="border-border-main text-muted-foreground hover:bg-input-bg text-xs sm:text-sm">Cancel</Button>
                    <Button onClick={handleSubmit} className="btn-primary text-xs sm:text-sm">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
```

## src/components/layout/Header.tsx
```typescript
// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
"use client";

import React, { useState, useEffect, useRef } from 'react'; 
import { LogIn, PaletteIcon, Search as SearchIcon, X as XIcon, CalendarIcon, ListChecks, Target, StickyNote, UserCircle, ChevronDown, Cog, Menu } from 'lucide-react'; // Added Menu
import { AIDALogoIcon } from './AIDALogoIcon';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeCustomizer } from './ThemeCustomizer';
import { SearchResultItem, Project, Category } from '@/types'; 
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


const getIconForType = (type: SearchResultItem['type']) => {
  switch (type) {
    case 'task': return <ListChecks className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'goal': return <Target className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'note': return <StickyNote className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'event': return <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />;
    default: return null;
  }
};

interface HeaderProps {
  currentProjectName?: Category;
  onProjectChange?: (projectName: Category) => void;
  availableProjects?: Project[];
  onManageProjects?: () => void;
}


export function Header({
  currentProjectName,
  onProjectChange,
  availableProjects = [],
  onManageProjects
}: HeaderProps) {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPopoverRef = useRef<HTMLDivElement>(null);

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const projectPillRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const currentPathname = usePathname();
  const router = useRouter();


  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearchPopoverOpen(false);
      return;
    }
    setIsSearchLoading(true);
    setIsSearchPopoverOpen(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearchPopoverOpen(false);
      }
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchPopoverRef.current && !searchPopoverRef.current.contains(event.target as Node) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchPopoverOpen(false);
      }
      if (
        projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node) &&
        projectPillRef.current && !projectPillRef.current.contains(event.target as Node)
      ) {
        setIsProjectDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigateToItem = (item: SearchResultItem) => {
    if (item.path) {
       router.push(`/#view=${item.type}&id=${item.id}`); 
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchPopoverOpen(false);
    setIsMobileMenuOpen(false);
  };

  const showSearch = status === "authenticated" && !["/login", "/register", "/landing", "/profile"].includes(currentPathname);
  const showProjectSelector = status === "authenticated" && onProjectChange && currentProjectName && availableProjects && !["/login", "/register", "/landing", "/profile"].includes(currentPathname);
  const allProjectsOption: Category = "All Projects";


  const ProjectSelectorPill = () => (
    <div className="relative">
        <div
            ref={projectPillRef}
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className={cn(
                "bg-widget-bg border border-border",
                "rounded-full px-3 py-1 sm:px-4 sm:py-1.5", 
                "text-xs font-medium cursor-pointer text-foreground",
                "flex items-center min-w-[150px] sm:min-w-[180px] max-w-[200px] sm:max-w-[220px] justify-between", 
                "transition-colors duration-200 hover:border-primary hover:bg-accent"
            )}
            >
            <span className="truncate">{currentProjectName}</span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground ml-1 shrink-0" />
        </div>

        {isProjectDropdownOpen && (
        <div
            ref={projectDropdownRef}
            className={cn(
            "absolute mt-2 bg-popover border border-border rounded-md",
            "w-[200px] sm:w-[220px] max-h-[300px] overflow-y-auto text-popover-foreground",
            "shadow-[0_8px_25px_rgba(0,0,0,0.4)] z-[105]", 
            "transition-all duration-200 ease-out",
            isProjectDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2.5"
            )}
            style={{ top: 'calc(100% + 0.3rem)', left: '50%', transform: 'translateX(-50%)' }} 
        >
            <div 
                className={cn(
                    "px-3 py-2 cursor-pointer text-xs",
                    currentProjectName === allProjectsOption 
                    ? "bg-accent text-accent-foreground font-semibold" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => { if(onProjectChange) onProjectChange(allProjectsOption); setIsProjectDropdownOpen(false); setIsMobileMenuOpen(false);}}
            >
            {allProjectsOption}
            </div>
            {availableProjects.filter(p => p.name !== allProjectsOption).map(proj => (
            <div
                key={proj.id}
                className={cn(
                "px-3 py-2 cursor-pointer text-xs",
                currentProjectName === proj.name 
                    ? "bg-accent text-accent-foreground font-semibold" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => { if(onProjectChange) onProjectChange(proj.name); setIsProjectDropdownOpen(false); setIsMobileMenuOpen(false);}}
            >
                {proj.name}
            </div>
            ))}
        </div>
        )}
    </div>
  );

  const SearchBar = () => (
    <div className="relative">
        <div className="relative flex items-center">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim().length >=2) setIsSearchPopoverOpen(true);}}
                className="pl-9 pr-8 h-9 w-full sm:w-48 md:w-64 input-field rounded-full bg-input-bg border-border-main focus:bg-widget-background focus:w-full sm:focus:w-64 md:focus:w-72 transition-all"
            />
            {searchQuery && (
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearchPopoverOpen(false); }}
            >
                <XIcon className="h-4 w-4"/>
            </Button>
            )}
        </div>
        {isSearchPopoverOpen && (searchQuery.trim().length >= 2) && (
            <div
            ref={searchPopoverRef}
            className="absolute top-full mt-2 w-full sm:w-72 md:w-96 max-h-[60vh] overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[100] p-1 space-y-0.5 right-0 sm:right-auto sm:left-0"
            >
            {isSearchLoading && <p className="p-3 text-sm text-muted-foreground text-center">Searching...</p>}
            {!isSearchLoading && searchResults.length === 0 && (
                <p className="p-3 text-sm text-muted-foreground text-center">No results found for &quot;{searchQuery}&quot;.</p>
            )}
            {!isSearchLoading && searchResults.map(item => (
                <div
                key={`${item.type}-${item.id}`}
                className="p-2.5 hover:bg-accent rounded cursor-pointer flex items-start"
                onClick={() => handleNavigateToItem(item)}
                >
                {getIconForType(item.type)}
                <div className="flex-grow">
                    <p className="text-sm font-medium text-popover-foreground leading-tight truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                    {item.type} in <span className="font-medium">{item.category}</span>
                    {item.date && ` - ${new Date(item.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}`}
                    </p>
                </div>
                </div>
            ))}
            </div>
        )}
    </div>
  );

  const AuthAndThemeControls = () => (
    <>
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Customize Theme">
                <PaletteIcon className="w-5 h-5" />
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
            <ThemeCustomizer />
            </PopoverContent>
        </Popover>
        
        {status === "loading" ? (
            <div className="w-9 h-9 bg-muted animate-pulse rounded-full"></div>
        ) : session?.user ? (
            <Link href="/profile" passHref>
                <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-accent-foreground rounded-full"
                title="My Profile"
                onClick={() => setIsMobileMenuOpen(false)}
                >
                <UserCircle className="w-6 h-6" />
                </Button>
            </Link>
        ) : (
            <Link href="/login">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Sign In" onClick={() => setIsMobileMenuOpen(false)}> 
                <LogIn className="w-5 h-5" />
            </Button>
            </Link>
        )}
    </>
  );


  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[95]",
        "flex items-center justify-between",
        "px-4 sm:px-6 py-3 sm:py-4", // Responsive padding
        "bg-background border-b border-border-main",
      )}
      style={{ height: 'auto', minHeight: '4.5rem' }} // Adjusted height
    >
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Link href={session ? "/" : "/landing"} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
            <AIDALogoIcon className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-200" />
            <h1 className="font-orbitron text-2xl sm:text-3xl font-bold tracking-wider accent-text group-hover:brightness-110 transition-all duration-200">AIDA</h1>
        </Link>
      </div>
      
      {/* Desktop: Project Selector in the middle */}
      {showProjectSelector && (
        <div className="hidden md:flex flex-grow justify-center items-center">
            <ProjectSelectorPill />
            {onManageProjects && (
                <button 
                    title="Manage Projects" 
                    onClick={onManageProjects}
                    className="ml-2 p-1.5 rounded-full hover:bg-input-bg text-muted-foreground hover:text-accent-foreground"
                >
                    <Cog className="w-4 h-4" />
                </button>
            )}
        </div>
      )}

      {/* Desktop: Search and Auth/Theme controls */}
      <div className="hidden md:flex items-center gap-2 sm:gap-3">
        {showSearch && <SearchBar />}
        <AuthAndThemeControls />
      </div>

      {/* Mobile: Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover z-[110]">
            {showSearch && (
              <>
                <div className="p-2">
                   <SearchBar />
                </div>
                <DropdownMenuSeparator />
              </>
            )}
             {showProjectSelector && (
                <>
                    <div className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">Project</div>
                    <div className="flex justify-center p-2"> <ProjectSelectorPill/> </div>
                    {onManageProjects && (
                         <DropdownMenuItem onClick={onManageProjects} className="text-xs">
                            <Cog className="w-3.5 h-3.5 mr-2"/> Manage Projects
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                </>
            )}
            <div className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">Account & Theme</div>
            <div className="flex items-center justify-around p-2">
                <AuthAndThemeControls />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

## src/components/views/GoalsView.tsx
```typescript
// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
"use client";

import React, { useState, useEffect } from 'react';
import { Goal, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalsViewProps {
  goals: Goal[];
  categories: Category[];
  currentCategory: Category;
  onAddGoal: (name: string, targetValue: number, unit: string, category: Category) => void;
  onUpdateGoal: (goalId: string, name?: string, targetValue?: number, unit?: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onClose: () => void;
}

export function GoalsView({ goals, categories, currentCategory, onAddGoal, onUpdateGoal, onDeleteGoal, onClose }: GoalsViewProps) {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalUnit, setNewGoalUnit] = useState('km');
  const [newGoalCategory, setNewGoalCategory] = useState<Category>(currentCategory);

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editGoalName, setEditGoalName] = useState('');
  const [editGoalTarget, setEditGoalTarget] = useState('');
  const [editGoalUnit, setEditGoalUnit] = useState('');

  useEffect(() => {
    if (currentCategory === "All Projects" && categories.length > 0 && categories[0]) {
        setNewGoalCategory(categories[0]);
    } else if (categories.includes(currentCategory)) {
        setNewGoalCategory(currentCategory);
    } else if (categories.length > 0 && categories[0]) {
        setNewGoalCategory(categories[0]);
    }
  }, [currentCategory, categories]);

  const handleAddGoal = () => {
    if (newGoalName.trim() && parseFloat(newGoalTarget) > 0) {
      onAddGoal(newGoalName.trim(), parseFloat(newGoalTarget), newGoalUnit, newGoalCategory);
      setNewGoalName('');
      setNewGoalTarget('');
      setNewGoalUnit('km');
    }
  };

  const startEdit = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditGoalName(goal.name);
    setEditGoalTarget(goal.targetValue.toString());
    setEditGoalUnit(goal.unit);
  };

  const handleUpdateGoal = () => {
    if (editingGoalId) {
      onUpdateGoal(
        editingGoalId,
        editGoalName.trim() || undefined,
        parseFloat(editGoalTarget) > 0 ? parseFloat(editGoalTarget) : undefined,
        editGoalUnit.trim() || undefined
      );
      setEditingGoalId(null);
    }
  };

  const filteredGoals = goals.filter(goal => currentCategory === "All Projects" || goal.category === currentCategory);

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-4 sm:p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1rem)] sm:pt-[calc(5rem+2.75rem+1.5rem)]"
    )}>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="font-orbitron text-2xl sm:text-3xl accent-text">Goals</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-1 sm:p-2 rounded-md hover:bg-input-bg">
          <X className="w-6 sm:w-7 h-6 sm:h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-widget-background border border-border-main rounded-md p-4 sm:p-6 custom-scrollbar-fullscreen space-y-4 sm:space-y-6">
        <div className="space-y-3 p-3 sm:p-4 bg-input-bg border border-border-main rounded-md">
          <Input
            placeholder="Goal name (e.g., Read 10 books)"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            className="input-field text-sm sm:text-base p-2 sm:p-3"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Input
              type="number"
              placeholder="Target (e.g., 10)"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="input-field text-xs sm:text-sm p-2 sm:p-3"
            />
            <Input
              placeholder="Unit (e.g., books, km, %)"
              value={newGoalUnit}
              onChange={(e) => setNewGoalUnit(e.target.value)}
              className="input-field text-xs sm:text-sm p-2 sm:p-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 items-end">
            <div className="sm:col-span-2">
                <label htmlFor="goal-category-select" className="sr-only">Category</label>
                <Select value={newGoalCategory || (categories.length > 0 ? categories[0] : '')} onValueChange={(val) => setNewGoalCategory(val as Category)}>
                    <SelectTrigger id="goal-category-select" className="input-field text-xs sm:text-sm h-auto py-2 sm:py-2.5">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-widget-background border-border-main text-text-main">
                        {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddGoal} className="btn-primary sm:col-span-3 text-xs sm:text-sm h-auto py-2 sm:py-2.5">
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"/> Add New Goal
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: To add tasks that contribute to this goal, create or edit tasks in the &apos;Tasks&apos; view and link them to this goal.
          </p>
        </div>

        <ul className="space-y-3">
          {filteredGoals.map(goal => {
            const displayCurrentValue = goal.currentValue || 0;
            const percentage = goal.targetValue > 0 && displayCurrentValue !== undefined
                ? Math.min(100, Math.round((displayCurrentValue / goal.targetValue) * 100))
                : 0;
            return (
            <li key={goal.id} className="bg-input-bg border border-border-main rounded-md p-2.5 sm:p-3 hover:border-accent/30 transition-colors">
              {editingGoalId === goal.id ? (
                <div className="space-y-2">
                  <Input value={editGoalName} onChange={e => setEditGoalName(e.target.value)} placeholder="Goal Name" className="input-field p-2 text-xs sm:text-sm"/>
                  <div className="grid grid-cols-2 gap-2">
                      <Input type="number" value={editGoalTarget} onChange={e => setEditGoalTarget(e.target.value)} placeholder="Target" className="input-field p-2 text-xs"/>
                      <Input value={editGoalUnit} onChange={e => setEditGoalUnit(e.target.value)} placeholder="Unit" className="input-field p-2 text-xs"/>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={handleUpdateGoal} size="sm" className="btn-primary text-xs px-3 py-1.5">Save</Button>
                    <Button onClick={() => setEditingGoalId(null)} variant="outline" size="sm" className="border-border-main text-muted-foreground hover:bg-background text-xs px-3 py-1.5">Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-text-main">{goal.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {goal.category} • Target: {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-0 sm:gap-0.5 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(goal)} className="btn-icon w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground hover:accent-text">
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteGoal(goal.id)} className="btn-icon danger w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-1.5 sm:mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                        <span>{displayCurrentValue} {goal.unit}</span>
                        <span className="accent-text font-medium">
                            {percentage}%
                        </span>
                    </div>
                    <Progress
                        value={percentage}
                        className="h-1.5 sm:h-2 bg-background/70 [&>[data-slot=progress-indicator]]:bg-accent-color-val"
                    />
                  </div>
                </>
              )}
            </li>
          )})}
          {filteredGoals.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm sm:text-base">No goals in this category yet. Set some aspirations!</p>
          )}
        </ul>
      </div>
    </div>
  );
}
```

## src/components/views/NotesView.tsx
```typescript
// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Note, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, PlusCircle, Edit2, Trash2 } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface NotesViewProps {
  notes: Note[]; 
  noteToEdit?: Note; 
  categories: Category[]; 
  currentCategory: Category; 
  onAddNote: (title: string | undefined, content: string, category: Category) => void;
  onUpdateNote: (noteId: string, title: string | undefined, content: string, category: Category) => void; 
  onDeleteNote: (noteId: string) => void; 
  onClose: () => void; 
}

export function NotesView({ 
    notes,
    noteToEdit, 
    categories, 
    currentCategory, 
    onAddNote, 
    onUpdateNote, 
    onDeleteNote,
    onClose,
}: NotesViewProps) {
  
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorCategory, setEditorCategory] = useState<Category>(currentCategory);
  
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'editor'>(noteToEdit ? 'editor' : 'list');
  const [currentEditingNoteId, setCurrentEditingNoteId] = useState<string | null>(null);

  const actualCategories = categories.filter(c => c && c !== "All Projects");

  const resetEditorFields = useCallback(() => {
    setEditorTitle('');
    setEditorContent('');
    const defaultNewNoteCategory = actualCategories.includes(currentCategory) 
      ? currentCategory 
      : (actualCategories[0] || "Personal Life");
    setEditorCategory(defaultNewNoteCategory);
    setCurrentEditingNoteId(null);
  }, [actualCategories, currentCategory]);

  useEffect(() => {
    if (noteToEdit) {
      setEditorTitle(noteToEdit.title || '');
      setEditorContent(noteToEdit.content);
      const validCategory = actualCategories.includes(noteToEdit.category as Category) 
        ? noteToEdit.category as Category
        : (actualCategories[0] || "Personal Life"); 
      setEditorCategory(validCategory);
      setCurrentEditingNoteId(noteToEdit.id);
      setInternalViewMode('editor');
    } else {
      if (internalViewMode === 'editor' && !currentEditingNoteId) {
        resetEditorFields();
      } else {
         setInternalViewMode('list');
      }
    }
  }, [noteToEdit, actualCategories, internalViewMode, currentEditingNoteId, resetEditorFields]);

  const handleSaveNote = () => {
    if (editorContent.trim() || editorTitle.trim()) { 
      const categoryToSave = actualCategories.includes(editorCategory) ? editorCategory : (actualCategories[0] || "Personal Life");
      if (currentEditingNoteId) { 
        onUpdateNote(currentEditingNoteId, editorTitle.trim() || undefined, editorContent.trim(), categoryToSave);
      } else { 
        onAddNote(editorTitle.trim() || undefined, editorContent.trim(), categoryToSave);
      }
      resetEditorFields();
      setInternalViewMode('list'); 
    } else {
      console.warn("Cannot save empty note.");
    }
  };

  const openEditorForNewNote = () => {
    resetEditorFields();
    setInternalViewMode('editor');
  };

  const openEditorForExistingNote = (note: Note) => {
    setEditorTitle(note.title || '');
    setEditorContent(note.content);
    setEditorCategory(note.category as Category);
    setCurrentEditingNoteId(note.id);
    setInternalViewMode('editor');
  };

  const handleDeleteAndRefreshList = (noteId: string) => {
    onDeleteNote(noteId);
  };

  const notesForCurrentProject = notes
    .filter((note: Note) => currentCategory === "All Projects" || note.category === currentCategory)
    .sort((a: Note, b: Note) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());


  if (internalViewMode === 'editor') {
    return (
      <div className={cn("fixed inset-0 z-[85] bg-background text-foreground p-0 flex flex-col", "pt-[calc(5rem+2.75rem)]")}>
        <div className="flex items-center justify-between py-2.5 sm:py-3 px-4 md:px-6 border-b border-border-main shrink-0 sticky top-0 bg-background z-10">
          <h2 className="font-orbitron text-xl sm:text-2xl accent-text">
            {currentEditingNoteId ? 'Edit Note' : 'Create Note'}
          </h2>
          <div className="flex items-center gap-2">
            <Button onClick={handleSaveNote} className="btn-primary" size="sm">
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Save
            </Button>
            <Button variant="outline" size="sm" onClick={() => { resetEditorFields(); setInternalViewMode('list');}} className="border-border-main">
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"/> Cancel
            </Button>
          </div>
        </div>
        <div className="flex-grow p-4 md:p-6 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar-fullscreen flex flex-col">
          <Input
            placeholder="Note title (optional)"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            className="input-field text-base sm:text-lg p-2.5 sm:p-3 shrink-0" 
          />
          <Select value={editorCategory || (actualCategories.length > 0 ? actualCategories[0] : '')} onValueChange={(val) => setEditorCategory(val as Category)}>
            <SelectTrigger className="input-field text-xs sm:text-sm h-auto py-1.5 sm:py-2 w-auto min-w-[140px] max-w-[180px] sm:min-w-[150px] sm:max-w-[200px] shrink-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-widget-background border-border-main text-text-main">
              {actualCategories.map((cat: Category) => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Type your note content here..."
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            className="input-field text-sm sm:text-base p-2.5 sm:p-3 rounded-md flex-grow w-full custom-scrollbar-fullscreen resize-none" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("fixed inset-0 z-[85] bg-background text-foreground p-0 flex flex-col", "pt-[calc(5rem+2.75rem)]")}>
        <div className="flex items-center justify-between py-2.5 sm:py-3 px-4 md:px-6 border-b border-border-main shrink-0 sticky top-0 bg-background z-10">
            <h2 className="font-orbitron text-xl sm:text-2xl accent-text truncate pr-2">Notes ({currentCategory})</h2>
            <div className="flex items-center gap-2 shrink-0">
                <Button onClick={openEditorForNewNote} className="btn-primary" size="sm">
                    <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> New Note
                </Button>
                 <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text">
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
            </div>
        </div>
        <div className="flex-grow p-4 md:p-6 overflow-y-auto custom-scrollbar-fullscreen">
            {notesForCurrentProject.length > 0 ? (
                <ul className="space-y-2.5 sm:space-y-3">
                {notesForCurrentProject.map((note: Note) => (
                    <li key={note.id} className="bg-input-bg border border-border-main rounded-md p-2.5 sm:p-3 hover:border-accent/30 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex-grow min-w-0">
                                {note.title && <h4 className="text-sm sm:text-base font-semibold text-text-main truncate">{note.title}</h4>}
                                <p className="text-xs text-muted-foreground truncate">
                                    {note.category} • Edited: {format(new Date(note.lastEdited), 'MMM d, yyyy p')}
                                </p>
                            </div>
                            <div className="flex items-center gap-0 sm:gap-0.5 shrink-0 ml-1">
                                <Button variant="ghost" size="icon" onClick={() => openEditorForExistingNote(note)} className="btn-icon w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground hover:accent-text">
                                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteAndRefreshList(note.id)} className="btn-icon danger w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-text-main/90 line-clamp-2 sm:line-clamp-3">{note.content}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-center text-muted-foreground py-10 text-sm sm:text-base">No notes in &quot;{currentCategory}&quot;. Jot something down!</p>
            )}
        </div>
    </div>
  );
}
```