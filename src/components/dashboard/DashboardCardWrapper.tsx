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
  className?: string;
  contentClassName?: string;
  onNavigate?: () => void; // Renamed from onMoreOptions / onClick for clarity
  // onExpand?: () => void; // if onNavigate is used for card click, this could be specific to expand icon
  id?: string; // For targeting specific widgets if needed
  allowExpand?: boolean; // To control if expand icon is shown
}

export function DashboardCardWrapper({ 
  title, 
  children, 
  className, 
  contentClassName, 
  onNavigate, 
  id,
  allowExpand = true 
}: DashboardCardWrapperProps) {
  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if icon is clicked
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div 
      id={id}
      className={cn(
        "bg-[var(--widget-background-val)] border border-[var(--border-color-val)]",
        "shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-[0.75rem]", // border-radius from target
        "flex flex-col",
        "transition-transform duration-200 ease-out hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(0,220,255,0.07)]", // hover effects
        onNavigate && allowExpand === false ? "cursor-pointer" : "", // Only make card itself clickable if no expand icon, or if expand icon does same
        className
      )}
      onClick={onNavigate && allowExpand === false ? handleCardClick : undefined} // Click on card only if not using expand icon for nav
    >
      {/* Widget Header */}
      <div className={cn(
        "border-b border-[var(--border-color-val)]",
        "px-4 py-3", // padding 0.75rem 1rem
        "mb-3", // margin-bottom 0.75rem
        "flex justify-between items-center"
      )}>
        <h2 className="font-orbitron text-lg accent-text">{title}</h2>
        {allowExpand && onNavigate && (
          <button 
            onClick={handleExpandClick} 
            className="p-0 bg-transparent border-none text-[var(--text-muted-color-val)] hover:accent-text" 
            title={`Expand ${title}`}
            aria-label={`Expand ${title}`}
          >
            <ExpandIcon />
          </button>
        )}
      </div>

      {/* Widget Content Summary */}
      <div className={cn(
        "flex-grow overflow-y-auto", // flex-grow for filling space
        "px-4 pb-3", // padding 0 1rem 0.75rem 1rem
        "widget-content-summary-scrollbars", // For custom scrollbar styling if needed beyond global
        contentClassName
      )}>
        {children}
      </div>
    </div>
  );
}
