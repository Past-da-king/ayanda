"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Star, MessageSquarePlus, XSquare, ChevronDown, ChevronUp } from 'lucide-react'; // Changed Bot to Star, added Chevrons
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

// This interface should ideally be in types/index.ts and imported
// Duplicating for clarity if it's only used here and page.tsx for aiChatHistory
export interface ExecutedOperationInfo {
  type: string;
  summary: string;
  success: boolean;
  error?: string;
}
interface AiChatMessage { 
  sender: 'user' | 'ai';
  message: string;
  timestamp?: Date;
  executedOps?: ExecutedOperationInfo[]; // To store actions taken by AI for this response
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

  const successfulOps = ops.filter(op => op.success);
  const failedOps = ops.filter(op => !op.success);

  return (
    <div className="mt-2 pt-2 border-t border-border-main/30 text-xs">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-muted-foreground hover:text-accent-foreground w-full text-left mb-1"
      >
        {isExpanded ? <ChevronUp className="w-3 h-3 mr-1 shrink-0" /> : <ChevronDown className="w-3 h-3 mr-1 shrink-0" />}
        <span>
            {successfulOps.length > 0 && `Performed: ${successfulOps.map(op => op.type.replace(" Added", "")).join(', ')}.`}
            {failedOps.length > 0 && <span className="text-destructive"> Some actions failed.</span>}
        </span>
      </button>
      {isExpanded && (
        <ul className="list-disc pl-5 space-y-0.5 text-muted-foreground">
          {ops.map((op, idx) => (
            <li key={idx} className={cn(op.success ? "" : "text-destructive")}>
              {op.type}: {op.summary} {op.success ? ' (Success)' : ` (Failed: ${op.error || 'Unknown error'})`}
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
        icon={<Star className="w-5 h-5 accent-text" />} // Using Star for AIDA icon
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
    <div className="flex flex-col h-full w-full bg-widget-background border border-border-main rounded-md shadow-xl">
      <div className="flex justify-between items-center p-4 border-b border-border-main shrink-0">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 accent-text" /> {/* AIDA icon */}
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

      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar-fullscreen">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col max-w-[85%] w-fit", // Ensures bubbles don't stretch full width
              chat.sender === 'user' ? "self-end items-end" : "self-start items-start" // Alignment
            )}
          >
            <div
              className={cn(
                "p-3 rounded-lg shadow",
                chat.sender === 'user' ? "bg-primary/90 text-primary-foreground" : "bg-input-bg text-foreground"
              )}
            >
              {chat.sender === 'ai' ? (
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
        {isProcessingAi && chatHistory.length > 0 && chatHistory[chatHistory.length-1].sender === 'user' && (
          <div className="self-start flex items-center gap-2 p-3 text-muted-foreground">
            <Star className="w-5 h-5 animate-pulse text-accent-color-val" /> {/* Changed Bot to Star */}
            <span className="text-sm italic">AIDA is thinking...</span>
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>
    </div>
  );
}
