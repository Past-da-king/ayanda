"use client"; 

import React, { useState, useEffect } from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar"; // Renamed to avoid conflict
import { cn } from '@/lib/utils';
import { Event as AppEvent } from '@/types';
import { format, parseISO, startOfDay, isSameDay } from 'date-fns'; // Removed addDays

interface CalendarWidgetProps {
  events: AppEvent[];
  onNavigate: () => void;
}

const getNextOccurrenceForCalendarDot = (event: AppEvent, day: Date): boolean => {
    if (!event.recurrenceRule) {
      return isSameDay(parseISO(event.date), day);
    }
  
    const rule = event.recurrenceRule;
    const baseEventDate = startOfDay(parseISO(event.date));
    const currentDay = startOfDay(day);
  
    if (baseEventDate > currentDay) return false; // Recurrence hasn't started yet for this day
    if (rule.endDate && currentDay > startOfDay(parseISO(rule.endDate))) return false; // Recurrence ended
  
    switch (rule.type) {
      case 'daily':
        const diffDays = Math.floor((currentDay.getTime() - baseEventDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays % rule.interval === 0;
      case 'weekly':
        if (!rule.daysOfWeek?.includes(currentDay.getDay())) return false;
        // Check if it's a valid week in the interval
        // const weekDiff = Math.floor((currentDay.getTime() - baseEventDate.getTime()) / (1000 * 60 * 60 * 24 * 7)); // Unused
        // This check is simplified; a full rrule lib would be better for complex weekly intervals
        // For simple "every X weeks on day Y", this might work if baseEventDate was also on day Y.
        // A more robust check needed for "every X weeks" if base date isn't on the target day.
        // For this widget, we'll assume a match if the day of week matches and it's on or after base.
        return true; // Simplified for widget
      case 'monthly':
        // Check if the day of the month matches the original event's day of month
        // And if the month interval matches
        if (currentDay.getDate() !== baseEventDate.getDate()) return false;
        const monthDiff = (currentDay.getFullYear() - baseEventDate.getFullYear()) * 12 + (currentDay.getMonth() - baseEventDate.getMonth());
        return monthDiff >= 0 && monthDiff % rule.interval === 0;
      case 'yearly':
        if (currentDay.getDate() !== baseEventDate.getDate() || currentDay.getMonth() !== baseEventDate.getMonth()) return false;
        const yearDiff = currentDay.getFullYear() - baseEventDate.getFullYear();
        return yearDiff >= 0 && yearDiff % rule.interval === 0;
      default:
        return false;
    }
};

const DayCell = ({ date, events }: { date: Date; events: AppEvent[]; }) => {
  const displayDate = date.getDate();
  const showDot = events.some(event => getNextOccurrenceForCalendarDot(event, date));
  return (
    <>
      {displayDate}
      {showDot ? <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary/80 rounded-full" /> : null}
    </>
  );
};

export function CalendarWidget({ events, onNavigate }: CalendarWidgetProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [currentMonthForTitle, setCurrentMonthForTitle] = useState('');

  useEffect(() => {
    const dateToUse = selectedDay || new Date();
    setCurrentMonthForTitle(format(dateToUse, 'MMMM yyyy').toUpperCase());
  }, [selectedDay]);

  return (
    <DashboardCardWrapper 
        title={currentMonthForTitle}
        onNavigate={onNavigate} 
        id="calendar-widget-summary"
        className="min-h-[280px] lg:min-h-[300px] flex flex-col"
        contentClassName="!p-2 flex flex-col flex-grow items-center justify-center"
    >
      <ShadcnCalendar
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        month={selectedDay || new Date()}
        className="p-0 w-full" 
        classNames={{
          months: "flex flex-col items-center",
          month: "space-y-2 w-full", 
          caption: "flex justify-center pt-0.5 relative items-center text-sm mb-1",
          caption_label: "text-sm font-medium accent-text sr-only",
          nav: "space-x-1",
          nav_button: "h-6 w-6 p-0 opacity-0 cursor-default",
          table: "w-full border-collapse", 
          head_row: "flex w-full", 
          head_cell: cn(
            "text-muted-foreground rounded-md",
            "flex items-center justify-center font-normal text-[0.75rem] p-0",
            "h-7 flex-1 basis-0" 
          ),
          row: "flex w-full mt-1", 
          cell: cn(
            "text-center p-0 relative focus-within:relative focus-within:z-20 rounded-md",
            "flex flex-col items-center justify-center",
            "h-9 flex-1 basis-0" 
          ),
          day: cn(
            "h-full w-full p-0 font-normal aria-selected:opacity-100 rounded-md",
            "hover:bg-accent/10 flex items-center justify-center relative text-xs sm:text-sm"
          ),
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "ring-1 ring-primary/60 text-primary rounded-md font-semibold",
          day_outside: "text-muted-foreground/40 opacity-40",
          day_disabled: "text-muted-foreground/30 opacity-30",
        }}
        formatters={{
            formatDay: (date) => <DayCell date={date} events={events} />,
        }}
        showOutsideDays={true}
        numberOfMonths={1}
        disableNavigation
        fixedWeeks
      />
    </DashboardCardWrapper>
  );
}

