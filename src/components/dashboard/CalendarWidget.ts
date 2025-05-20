"use client"; 

import React, { useState, useEffect } from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { Event as AppEvent } from '@/types';

interface CalendarWidgetProps {
  events: AppEvent[];
  onNavigate: () => void;
}

// Helper component to render day cell with potential event dot
const DayCell = ({ date, events, dayHasEvents }: { date: Date | undefined; events: AppEvent[]; dayHasEvents: (date: Date, allEvents: AppEvent[]) => boolean }) => {
  if (!date) return null; // Handle case where date might be undefined (though Calendar usually provides it)

  const hasEvent = dayHasEvents(date, events);
  return (
    <>
      {date.getDate()} {/* This is the number of the day */}
      {hasEvent && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--accent-color-val)]/80 rounded-full"></span>
      )}
    </>
  );
};


export function CalendarWidget({ events, onNavigate }: CalendarWidgetProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [currentMonthForTitle, setCurrentMonthForTitle] = useState('');

  useEffect(() => {
    const dateToUse = selectedDay || new Date();
    setCurrentMonthForTitle(dateToUse.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase());
  }, [selectedDay]);

  const dayHasEvents = (date: Date, allEvents: AppEvent[]): boolean => {
    if (!date || !Array.isArray(allEvents)) return false;
    return allEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  };

  return (
    <DashboardCardWrapper 
        title={currentMonthForTitle}
        onNavigate={onNavigate} 
        id="calendar-widget-summary"
        className="min-h-[280px] lg:min-h-[300px] flex flex-col"
        contentClassName="!p-2 flex flex-col flex-grow items-center justify-center"
    >
      <Calendar
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        month={selectedDay || new Date()}
        className="p-0 w-full max-w-[260px]"
        classNames={{
          months: "flex flex-col items-center",
          month: "space-y-2 w-full px-1",
          caption: "flex justify-center pt-0.5 relative items-center text-sm mb-1",
          caption_label: "text-sm font-medium accent-text sr-only",
          nav: "space-x-1",
          nav_button: "h-6 w-6 p-0 opacity-0 cursor-default",
          
          table: "w-full border-collapse",
          head_row: "flex w-full justify-around mb-1",
          head_cell: cn(
            "text-[var(--text-muted-color-val)] rounded-md",
            "flex items-center justify-center font-normal text-[0.75rem] p-0",
            "h-7 w-full max-w-[2.25rem]"
          ),
          row: "flex w-full mt-1 justify-around",
          cell: cn(
            "text-center p-0 relative focus-within:relative focus-within:z-20 rounded-md",
            "flex flex-col items-center justify-center",
            "h-9 w-full max-w-[2.25rem]" 
          ),
          day: cn(
            "h-full w-full p-0 font-normal aria-selected:opacity-100 rounded-md",
            "hover:bg-[var(--accent-color-val)]/10 flex items-center justify-center relative text-xs sm:text-sm"
          ),
          day_selected: "bg-[var(--accent-color-val)] text-[var(--background-color-val)] hover:bg-[var(--accent-color-val)] hover:text-[var(--background-color-val)] focus:bg-[var(--accent-color-val)] focus:text-[var(--background-color-val)]",
          day_today: "ring-1 ring-[var(--accent-color-val)]/60 text-[var(--accent-color-val)] rounded-md font-semibold",
          day_outside: "text-[var(--text-muted-color-val)]/40 opacity-40",
          day_disabled: "text-[var(--text-muted-color-val)]/30 opacity-30",
        }}
        formatters={{
            // Pass the date to the DayCell formatter.
            // The `date` parameter provided by `formatDay` here is the one we need.
            formatDay: (date) => <DayCell date={date} events={events} dayHasEvents={dayHasEvents} />,
        }}
        showOutsideDays={true}
        numberOfMonths={1}
        disableNavigation
        fixedWeeks
      />
    </DashboardCardWrapper>
  );
}


