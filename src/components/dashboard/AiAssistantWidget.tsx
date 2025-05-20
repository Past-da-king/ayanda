"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Star, MessageSquarePlus, XSquare, ChevronDown, ChevronUp, Mic } from 'lucide-react'; // Added Mic icon
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export interface ExecutedOperationInfo {
  type: string;
  summary: string;
  success: boolean;
  error?: string;
}
export interface AiChatMessage { // Exporting for page.tsx
  sender: 'user' | 'ai' | 'system'; // Added 'system' for audio placeholder
  message: string;
  timestamp?: Date;
  executedOps?: ExecutedOperationInfo[];
  isAudioPlaceholder?: boolean; // Flag for audio placeholder
}

interface AiAssistantWidgetProps {
  initialMessage: string | null;
  isChatModeActive: boolean;
  onToggleChatMode: () => void;
  chatHistory: AiChatMessage[];
  isProcessingAi: boolean; 
}

const DEFAULT_MESSAGE = "Hi there! How can I help you make the most of your day?";

const ExecutedOpsDisplay: React.FC<{ ops: ExecutedOperationInfo[] }> = ({ ops }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!ops || ops.length === 0) return null;

  return (
    <div className="mt-2 pt-2 border-t border-border-main/20 text-xs">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-muted-foreground/80 hover:text-accent-foreground w-full text-left mb-1 focus:outline-none"
      >
        {isExpanded ? <ChevronUp className="w-3 h-3 mr-1 shrink-0" /> : <ChevronDown className="w-3 h-3 mr-1 shrink-0" />}
        <span className="font-medium">
            { ops.length === 1 && ops[0].success ? `${ops[0].type.replace(" Added", "")}: '${ops[0].summary.substring(0,20)}...' processed.` : 
              `${ops.length} action(s) processed.`
            }
        </span>
      </button>
      {isExpanded && (
        <ul className="list-none pl-4 space-y-0.5 text-muted-foreground/90">
          {ops.map((op, idx) => (
            <li key={idx} className={cn("text-[11px]",op.success ? "" : "text-destructive")}>
              <span className="font-semibold">{op.type}:</span> {op.summary} {op.success ? <span className="text-green-400/80">(Success)</span> : <span className="text-red-400/80">(Failed: {op.error || 'Unknown error'})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export function AiAssistantWidget({
  initialMessage,
  isChatModeActive,
  onToggleChatMode,
  chatHistory,
  isProcessingAi, 
}: AiAssistantWidgetProps) {
  const displayMessage = initialMessage || DEFAULT_MESSAGE;
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isChatModeActive) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatModeActive]);

  if (!isChatModeActive) {
    return (
      <DashboardCardWrapper
        title="AIDA"
        icon={<Star className="w-5 h-5 accent-text" />}
        allowExpand={true}
        onNavigate={onToggleChatMode}
        id="ai-assistant-widget"
        className="min-h-[120px] lg:min-h-[140px]"
        contentClassName="!p-3 flex items-center"
        customExpandIcon={<MessageSquarePlus className="w-5 h-5"/>}
        customExpandTooltip="Open Chat Mode"
      >
        <div className="flex items-start gap-2.5">
          <p className="text-sm text-[var(--text-color-val)] leading-relaxed">
            {displayMessage}
          </p>
        </div>
      </DashboardCardWrapper>
    );
  }

  return (
    <div className="flex flex-col h-full w-full"> 
      <div className="flex justify-between items-center p-4 border-b border-border-main shrink-0">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 accent-text" /> 
          <h2 className="font-orbitron text-xl accent-text">AIDA Chat</h2>
        </div>
        <button
          onClick={onToggleChatMode}
          className="p-1 bg-transparent border-none text-muted-foreground hover:accent-text"
          title="Close Chat"
          aria-label="Close Chat"
        >
          <XSquare className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar-fullscreen pb-24"> 
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col max-w-[85%] w-fit",
              chat.sender === 'user' || chat.isAudioPlaceholder ? "self-end items-end ml-auto" : "self-start items-start mr-auto"
            )}
          >
            <div
              className={cn(
                "p-3 rounded-lg shadow-sm",
                chat.sender === 'user' ? "bg-primary text-primary-foreground" 
                                       : chat.isAudioPlaceholder ? "bg-primary/70 text-primary-foreground italic" // Style for audio placeholder
                                       : "bg-input-bg text-foreground border border-border-main/20"
              )}
            >
              {chat.isAudioPlaceholder ? (
                <div className="flex items-center gap-2 text-sm">
                  <Mic className="w-4 h-4 shrink-0" /> 
                  <span>{chat.message}</span>
                </div>
              ) : chat.sender === 'ai' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
                  <ReactMarkdown>{chat.message}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
              )}
              {chat.sender === 'ai' && chat.executedOps && chat.executedOps.length > 0 && (
                <ExecutedOpsDisplay ops={chat.executedOps} />
              )}
            </div>
            {chat.timestamp && (
                <p className="text-[10px] text-muted-foreground/70 mt-0.5 px-1">
                    {format(chat.timestamp, 'p')}
                </p>
            )}
          </div>
        ))}
        {isProcessingAi && chatHistory.length > 0 && (chatHistory[chatHistory.length-1].sender === 'user' || chatHistory[chatHistory.length-1].isAudioPlaceholder) && (
          <div className="self-start flex items-center gap-2 p-3 text-muted-foreground">
            <Star className="w-5 h-5 animate-pulse text-accent-color-val" />
            <span className="text-sm italic">AIDA is thinking...</span>
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>
    </div>
  );
}
