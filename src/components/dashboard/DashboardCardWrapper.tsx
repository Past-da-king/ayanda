import React from 'react';
import { cn } from '@/lib/utils';

// Expand icon SVG from the target HTML
const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
  </svg>
);

interface DashboardCardWrapperProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode; // Optional icon for the title
  className?: string;
  contentClassName?: string;
  onNavigate?: () => void; 
  id?: string; 
  allowExpand?: boolean; 
  customExpandIcon?: React.ReactNode;
  customExpandTooltip?: string;
}

export function DashboardCardWrapper({ 
  title, 
  children, 
  icon,
  className, 
  contentClassName, 
  onNavigate, 
  id,
  allowExpand = true,
  customExpandIcon,
  customExpandTooltip
}: DashboardCardWrapperProps) {
  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div 
      id={id}
      className={cn(
        "bg-[var(--widget-background-val)] border border-[var(--border-color-val)]",
        "shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-[0.75rem]", 
        "flex flex-col",
        "transition-transform duration-200 ease-out hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(0,220,255,0.07)]", 
        onNavigate && allowExpand === false ? "cursor-pointer" : "", 
        className
      )}
      onClick={onNavigate && allowExpand === false ? handleCardClick : undefined} 
    >
      <div className={cn(
        "border-b border-[var(--border-color-val)]",
        "px-4 py-3", 
        "mb-3", 
        "flex justify-between items-center"
      )}>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-orbitron text-lg accent-text">{title}</h2>
        </div>
        {allowExpand && onNavigate && (
          <button 
            onClick={handleExpandClick} 
            className="p-0 bg-transparent border-none text-[var(--text-muted-color-val)] hover:accent-text" 
            title={customExpandTooltip || `Expand ${title}`}
            aria-label={customExpandTooltip || `Expand ${title}`}
          >
            {customExpandIcon || <ExpandIcon />}
          </button>
        )}
      </div>

      <div className={cn(
        "flex-grow overflow-y-auto", 
        "px-4 pb-3", 
        "widget-content-summary-scrollbars", 
        contentClassName
      )}>
        {children}
      </div>
    </div>
  );
}


