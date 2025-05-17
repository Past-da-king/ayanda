"use client"; // Required for shadcn/ui Calendar

import React from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Calendar } from "@/components/ui/calendar"; // Import shadcn/ui Calendar

export function CalendarWidget() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 4, 17)); // Set to May 17, 2025

  return (
    <DashboardCardWrapper title="MAY 2025" className="min-h-[280px] lg:min-h-[300px]">
      <div className="pt-1">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={new Date(2025, 4)} // Start view in May 2025
          className="p-0 [&_td]:w-9 [&_td]:h-9 [&_th]:w-9 [&_button]:w-full [&_button]:h-full"
          classNames={{
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
            day_today: "bg-accent text-accent-foreground rounded-md", // Style for today if it's in view
            day_outside: "text-muted-foreground opacity-50",
            // navigation: "flex items-center",
            // nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          }}
        />
      </div>
    </DashboardCardWrapper>
  );
}
