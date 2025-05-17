import React from 'react';
import { Task, Event as AppEvent } from '@/types'; // Now Event should be found
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';

interface DueSoonWidgetProps {
  tasks?: Task[]; // Mark as optional or ensure it's always an array
  events?: AppEvent[]; // Mark as optional or ensure it's always an array
  currentProjectId: string | null;
}

export function DueSoonWidget({ tasks = [], events = [], currentProjectId }: DueSoonWidgetProps) { // Default to empty arrays
  const upcomingItems: { type: string; name: string; date: Date; id: string; isToday: boolean; isTomorrow: boolean }[] = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const endOfThreeDays = new Date(today); endOfThreeDays.setDate(today.getDate() + 3);

  // Check if tasks is actually an array before calling .filter
  if (Array.isArray(tasks)) {
    tasks
      .filter(t => !t.completed && (currentProjectId === null || t.category === currentProjectId) && t.dueDate)
      .forEach(t => {
        // Ensure t.dueDate is not undefined/null before trying to use it
        if (t.dueDate) {
          const dueDate = new Date(t.dueDate + "T00:00:00Z"); // Added Z for UTC to be safe with date parsing
          if (!isNaN(dueDate.getTime()) && dueDate >= today && dueDate < endOfThreeDays) { // Check if date is valid
            upcomingItems.push({
              type: 'Task',
              name: t.text,
              date: dueDate,
              id: t.id,
              isToday: dueDate.getTime() === today.getTime(),
              isTomorrow: dueDate.getTime() === tomorrow.getTime(),
            });
          }
        }
      });
  }

  // Check if events is actually an array before calling .filter
  if (Array.isArray(events)) {
    events
      .filter(e => (currentProjectId === null || e.category === currentProjectId) && e.date) // Check e.date exists
      .forEach(e => {
        if (e.date) { // Double check e.date
          const eventDate = new Date(e.date); // Assuming e.date is a valid ISO string
          if (!isNaN(eventDate.getTime())) { // Check if date is valid
            const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()); // Compare date part only
            if (eventDateOnly >= today && eventDateOnly < endOfThreeDays) {
              upcomingItems.push({
                type: 'Event',
                name: e.title, // Using title as per defined Event type
                date: eventDateOnly,
                id: e.id,
                isToday: eventDateOnly.getTime() === today.getTime(),
                isTomorrow: eventDateOnly.getTime() === tomorrow.getTime(),
              });
            }
          }
        }
      });
  }

  upcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());
  const displayedItems = upcomingItems.slice(0, 4);

  return (
    <DashboardCardWrapper 
        title="DUE SOON" 
        allowExpand={false}
        className="lg:col-span-2"
        id="due-soon-widget-summary"
        contentClassName="space-y-2"
    >
      {displayedItems.length > 0 ? (
        <ul className="space-y-2">
          {displayedItems.map(item => {
            let dateString = item.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (item.isToday) dateString = "Today";
            else if (item.isTomorrow) dateString = "Tomorrow";
            
            return (
              <li 
                key={item.id} 
                className={cn(
                  "widget-item",
                  item.isToday ? "bg-amber-500/10 !border-l-amber-400" : "!border-l-sky-400/50"
                )}
              >
                <p className="text-sm truncate" title={item.name}>{item.type}: {item.name}</p>
                <p className="text-xs text-[var(--text-muted-color-val)]">{dateString}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2">Nothing due soon.</p>
      )}
    </DashboardCardWrapper>
  );
}
