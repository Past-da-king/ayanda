import React from 'react';
import { Task, Event as AppEvent } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';
import { format, parseISO, addDays, startOfDay, isSameDay, isTomorrow as dateFnsIsTomorrow } from 'date-fns';

// Helper to get next occurrence for summary
const getNextOccurrenceForSummary = (item: Task | AppEvent, fromDate: Date = new Date()): Date | null => {
  const baseItemDate = item.dueDate ? parseISO(item.dueDate) : parseISO(item.date); // Task has dueDate, Event has date
  if (!item.recurrenceRule) {
    return startOfDay(baseItemDate) >= startOfDay(fromDate) ? baseItemDate : null;
  }

  const rule = item.recurrenceRule;
  let checkDate = startOfDay(baseItemDate); // Start from the item's original start date/time
  
  if (checkDate >= startOfDay(fromDate)) {
     // If rule is weekly, check if baseDate's day is in daysOfWeek, if not, find first valid day from baseDate
     if(rule.type === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length > 0 && !rule.daysOfWeek.includes(checkDate.getDay())) {
        // Find next valid day based on rule starting from checkDate
        for(let i = 0; i < 7; i++) { // Check next 7 days
            let futureDay = addDays(checkDate, i);
            if(rule.daysOfWeek.includes(futureDay.getDay())) {
                if(rule.endDate && futureDay > parseISO(rule.endDate)) return null;
                return futureDay;
            }
        }
        // If no day found in current week, it means we need to advance to next interval. Handled by loop below.
     } else {
        if(rule.endDate && checkDate > parseISO(rule.endDate)) return null;
        return checkDate; // Base date itself is a valid upcoming or current occurrence
     }
  }
  
  // Search for next occurrence after fromDate
  for(let i=0; i < (rule.count || 365); i++) { // Limit search
      let next: Date;
      switch(rule.type) {
          case 'daily': 
              next = addDays(checkDate, rule.interval * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) ); // ensure we are looking forward
              break;
          case 'weekly':
              next = addDays(checkDate, (rule.interval * 7 * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) ));
              if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                  let currentDay = next.getDay();
                  let targetDay = rule.daysOfWeek.find(d => d >= currentDay) ?? rule.daysOfWeek[0];
                  let diff = targetDay - currentDay;
                  if (diff < 0) { // Target day passed for this iteration
                      next = addDays(next, (7 - currentDay) + targetDay); // Go to next week's target day
                  } else {
                      next = addDays(next, diff);
                  }
              }
              break;
          case 'monthly': next = add(checkDate, { months: rule.interval * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) }); break;
          case 'yearly': next = add(checkDate, { years: rule.interval * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) }); break;
          default: return null;
      }
      next = startOfDay(next);

      if(next >= startOfDay(fromDate)) {
          if (rule.endDate && next > startOfDay(parseISO(rule.endDate))) return null;
          return next;
      }
      checkDate = next; // Update checkDate for next iteration, ensures we move forward from the found date
  }
  return null;
};


interface DueSoonWidgetProps {
  tasks?: Task[];
  events?: AppEvent[];
  currentProjectId: string | null;
  onNavigateToItem: (type: 'tasks' | 'calendar', id: string) => void;
}

export function DueSoonWidget({ tasks = [], events = [], currentProjectId, onNavigateToItem }: DueSoonWidgetProps) {
  const upcomingItems: { type: 'Task' | 'Event'; name: string; date: Date; id: string; isToday: boolean; isTomorrow: boolean; originalCategory: string; }[] = [];
  const today = startOfDay(new Date());
  const tomorrow = startOfDay(addDays(today, 1));
  const endOfThreeDays = startOfDay(addDays(today, 3)); // Include today, tomorrow, and day after tomorrow

  const processItems = <T extends Task | AppEvent>(
    items: T[],
    itemType: 'Task' | 'Event'
  ) => {
    items
      .filter(item => {
        if (itemType === 'Task' && (item as Task).completed) return false;
        return (currentProjectId === null || item.category === currentProjectId);
      })
      .forEach(item => {
        const itemDateStr = itemType === 'Task' ? (item as Task).dueDate : (item as AppEvent).date;
        if (!itemDateStr) return;

        let nextOccurrenceDate = getNextOccurrenceForSummary(item, today);
        
        if (nextOccurrenceDate && nextOccurrenceDate < endOfThreeDays) {
          upcomingItems.push({
            type: itemType,
            name: itemType === 'Task' ? (item as Task).text : (item as AppEvent).title,
            date: nextOccurrenceDate,
            id: item.id,
            isToday: isSameDay(nextOccurrenceDate, today),
            isTomorrow: dateFnsIsTomorrow(nextOccurrenceDate),
            originalCategory: item.category,
          });
        }
      });
  };

  if (Array.isArray(tasks)) processItems(tasks, 'Task');
  if (Array.isArray(events)) processItems(events, 'Event');
  
  // Deduplicate if recurring item's next occurrence is same as another unique item on same day
  const uniqueUpcomingItems = upcomingItems.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.id === item.id && t.type === item.type && t.date.getTime() === item.date.getTime()
    ))
  );


  uniqueUpcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());
  const displayedItems = uniqueUpcomingItems.slice(0, 5); // Show up to 5

  return (
    <DashboardCardWrapper 
        title="DUE SOON" 
        allowExpand={false} // This widget summarizes, click items to navigate
        className="lg:col-span-2" // Assuming it takes more space
        id="due-soon-widget-summary"
        contentClassName="space-y-2"
    >
      {displayedItems.length > 0 ? (
        <ul className="space-y-2">
          {displayedItems.map(item => {
            let dateString = format(item.date, 'EEE, MMM d');
            if (item.isToday) dateString = "Today";
            else if (item.isTomorrow) dateString = "Tomorrow";
            
            return (
              <li 
                key={`${item.type}-${item.id}-${item.date.toISOString()}`} 
                className={cn(
                  "widget-item cursor-pointer", // Make it clickable
                  item.isToday ? "bg-amber-500/10 !border-l-amber-400" : "!border-l-sky-400/50"
                )}
                onClick={() => onNavigateToItem(item.type === 'Task' ? 'tasks' : 'calendar', item.id)}
                title={`${item.type}: ${item.name} - ${dateString} (${item.originalCategory})`}
              >
                <div className="flex justify-between items-center">
                    <p className="text-sm truncate flex-grow" >{item.type}: {item.name}</p>
                    <p className="text-xs text-muted-foreground shrink-0 ml-2">{dateString}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground p-2 text-center">Nothing due in the next 3 days.</p>
      )}
    </DashboardCardWrapper>
  );
}


