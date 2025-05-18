"use client";

import React from 'react';
import { Star, Info } from 'lucide-react'; // Using Lucide Star
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';

interface AiAssistantWidgetProps {
  message: string | null; // Message from AI, or null for default
  // type?: 'info' | 'success' | 'error' | 'suggestion'; // Could be used for icon/color later
}

const DEFAULT_MESSAGE = "Hi there! How can I help you make the most of your day?";

export function AiAssistantWidget({ message }: AiAssistantWidgetProps) {
  const displayMessage = message || DEFAULT_MESSAGE;

  // const getIconForType = () => { // Example if we add type later
  //   switch (type) {
  //     case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
  //     default: return <Info className="w-5 h-5 accent-text" />;
  //   }
  // };

  return (
    <DashboardCardWrapper
      title="AIDA" // AI Name
      icon={<Star className="w-5 h-5 accent-text" />} // Star Icon
      allowExpand={false} // This widget likely doesn't need an expand view
      id="ai-assistant-widget"
      className="min-h-[120px] lg:min-h-[140px]" // Explicitly shorter height than other widgets
      contentClassName="!p-3 flex items-center" // Adjusted padding for content
    >
      <div className="flex items-start gap-2.5">
        {/* Optional: Icon based on message type could go here */}
        {/* <div className="shrink-0 mt-0.5">{getIconForType()}</div> */}
        <p className="text-sm text-[var(--text-color-val)] leading-relaxed">
          {displayMessage}
        </p>
      </div>
    </DashboardCardWrapper>
  );
}
