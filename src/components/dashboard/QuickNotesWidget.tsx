import React from 'react';
import { Note } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';

interface QuickNotesWidgetProps {
  notes: Note[];
  onNavigate: () => void;
}

export function QuickNotesWidget({ notes, onNavigate }: QuickNotesWidgetProps) {
  const displayedNote = notes.length > 0 ? notes[0] : null;

  return (
    <DashboardCardWrapper 
        title="QUICK NOTES" 
        onClick={onNavigate} 
        className="min-h-[280px] lg:min-h-[300px]" // Made taller
    >
      {displayedNote ? (
        <div className="mt-1">
          {displayedNote.title && <h4 className="text-sm font-semibold mb-1 truncate text-foreground">{displayedNote.title}</h4>}
          <p className="text-sm text-muted-foreground line-clamp-6"> {/* Allow more lines */}
            {displayedNote.content}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mt-1">No quick notes. Jot something down!</p>
      )}
    </DashboardCardWrapper>
  );
}
