import React from 'react';
import { Note } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
// import { cn } from '@/lib/utils';

interface QuickNotesWidgetProps {
  notes: Note[]; // Pre-filtered and sorted notes
  onNavigate: () => void;
}

export function QuickNotesWidget({ notes, onNavigate }: QuickNotesWidgetProps) {
  const displayedNotes = notes.slice(0, 3); // Show max 3 in summary

  return (
    <DashboardCardWrapper 
        title="QUICK NOTES" 
        onNavigate={onNavigate} 
        id="notes-widget-summary"
        contentClassName="space-y-2" // space-y from target
    >
      {displayedNotes.length > 0 ? (
         <ul className="space-y-2"> {/* Added ul for semantics */}
          {displayedNotes.map((note) => (
            <li key={note.id} className="widget-item"> {/* widget-item class */}
              <p className="font-medium text-sm truncate" title={note.title || 'Untitled Note'}>
                {note.title || 'Untitled Note'}
              </p>
              <p className="text-xs text-[var(--text-muted-color-val)] truncate">
                {note.content.substring(0, 60)}{note.content.length > 60 ? '...' : ''}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2">No notes available.</p>
      )}
    </DashboardCardWrapper>
  );
}

