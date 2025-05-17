"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar"; // This should import your shadcn/ui calendar
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event as AppEvent, Category } from '@/types';
import { cn } from '@/lib/utils';
import { X, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateFormatter } from 'react-day-picker';

interface CalendarFullScreenViewProps {
  events: AppEvent[];
  categories: Category[];
  currentCategory: Category;
  onAddEvent: (title: string, date: string, category: Category, description?: string) => void;
  onUpdateEvent: (eventId: string, title: string, date: string, category: Category, description?: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  category: Category;
  description?: string;
}

export function CalendarFullScreenView({
  events,
  categories,
  currentCategory,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onClose
}: CalendarFullScreenViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    category: currentCategory,
    description: ''
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0],
        category: currentCategory === "All Projects" && categories.length > 0 ? categories[0] : currentCategory
      }));
    }
  }, [selectedDate, currentCategory, categories]);

  useEffect(() => {
    if (editingEvent) {
      const eventDate = new Date(editingEvent.date);
      setFormData({
        title: editingEvent.title,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().substring(0, 5),
        category: editingEvent.category,
        description: editingEvent.description || ''
      });
      setShowEventForm(true);
    }
  }, [editingEvent]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as Category }));
  };

  const handleSubmitEvent = () => {
    if (!formData.title || !formData.date || !formData.time) return;
    const dateTimeString = `${formData.date}T${formData.time}:00.000Z`; 
    
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, formData.title, dateTimeString, formData.category, formData.description);
    } else {
      onAddEvent(formData.title, dateTimeString, formData.category, formData.description);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: '12:00',
      category: currentCategory === "All Projects" && categories.length > 0 ? categories[0] : currentCategory,
      description: ''
    });
  };

  const openEditForm = (event: AppEvent) => {
    setEditingEvent(event);
  };
  
  const dayHasEvents = useCallback((date: Date, allEvents: AppEvent[]): boolean => {
    if (!date) return false;
    return allEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  }, []);

  // DayCellContent now renders directly into the day cell
  // The `day` className on the Calendar component will handle the base styling of the cell
  // The `day_selected`, `day_today` etc. will handle the stateful styling
  const DayCellContent: DateFormatter = useCallback((day) => {
    const currentDayHasEvents = dayHasEvents(day, events);
    // Return just the number, and the dot if events exist.
    // The parent cell will handle background, borders, etc.
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {day.getDate()}
        {currentDayHasEvents && (
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 bg-primary rounded-full" />
        )}
      </div>
    );
  }, [events, dayHasEvents]);
  
  const eventsForSelectedDay = selectedDate ? events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === selectedDate.getFullYear() &&
           eventDate.getMonth() === selectedDate.getMonth() &&
           eventDate.getDate() === selectedDate.getDate();
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-[var(--background-color-val)] p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" 
    )}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-3xl accent-text">Calendar</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--text-muted-color-val)] hover:accent-text p-2 rounded-md hover:bg-[var(--input-bg-val)]">
                <X className="w-7 h-7" />
            </Button>
        </div>

        <div className="flex-grow flex gap-6 overflow-hidden">
            <div className="w-2/3 lg:w-3/4 bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-md p-6 flex flex-col items-center justify-start custom-scrollbar-fullscreen">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={viewMonth}
                    onMonthChange={setViewMonth}
                    className="w-full max-w-2xl" 
                    classNames={{
                        // These classNames are based on the shadcn/ui Calendar component's structure
                        // If you're using a raw react-day-picker, some might need adjustment
                        // but shadcn/ui one is pre-styled.
                        root: "w-full", 
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center h-10 mb-2", // Added mb-2
                        caption_label: "text-xl font-orbitron accent-text",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
                            "rounded-md hover:bg-accent/20 text-muted-foreground hover:text-accent-foreground transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" // Standard focus
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full mb-1", // shadcn uses mb-1
                        head_cell: "text-muted-foreground rounded-md w-[14.28%] text-xs font-medium p-1 h-8 justify-center", // Approx 1/7 width

                        row: "flex w-full mt-2", // shadcn uses mt-2
                        cell: "text-center text-sm p-0 relative w-[14.28%] h-16 sm:h-20 focus-within:relative focus-within:z-20", // Approx 1/7 width
                        
                        day: cn(
                            "w-full h-full p-0 font-normal rounded-md",
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", // Standard hover/focus
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Standard focus
                            "transition-colors"
                            // "aria-selected:opacity-100" // This is usually handled by day_selected
                        ),
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground ring-1 ring-primary/60", // Adjusted 'today' style to match typical shadcn
                        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50 pointer-events-none",
                        day_hidden: "invisible",
                        // No 'day_range_start', 'day_range_end', 'day_range_middle' for single mode
                    }}
                    components={{
                        IconLeft: ({ ...props }) => <ChevronLeft {...props} className="h-5 w-5" />,
                        IconRight: ({ ...props }) => <ChevronRight {...props} className="h-5 w-5" />,
                    }}
                    formatters={{ formatDay: DayCellContent }}
                    showOutsideDays
                    fixedWeeks
                />
            </div>

            {/* Events List / Form section remains the same */}
            <div className="w-1/3 lg:w-1/4 bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-md p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar-fullscreen">
                <Button onClick={() => { setEditingEvent(null); setShowEventForm(true); }} className="w-full btn btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2"/> Add Event
                </Button>

                {showEventForm && (
                    <div className="p-3 border border-[var(--border-color-val)] rounded-md bg-[var(--input-bg-val)] space-y-3">
                        <h3 className="font-orbitron text-lg accent-text">{editingEvent ? 'Edit Event' : 'New Event'}</h3>
                        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} className="input-field"/>
                        <div className="flex gap-2">
                            <Input name="date" type="date" value={formData.date} onChange={handleInputChange} className="input-field"/>
                            <Input name="time" type="time" value={formData.time} onChange={handleInputChange} className="input-field"/>
                        </div>
                        <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="input-field"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent className="bg-[var(--widget-background-val)] border-[var(--border-color-val)]">
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Textarea name="description" placeholder="Description (optional)" value={formData.description} onChange={handleInputChange} className="input-field min-h-[60px]"/>
                        <div className="flex gap-2">
                            <Button onClick={handleSubmitEvent} className="flex-grow btn-primary">{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
                            <Button variant="outline" onClick={resetForm} className="border-[var(--border-color-val)] text-[var(--text-muted-color-val)] hover:bg-[var(--background-color-val)]">Cancel</Button>
                        </div>
                    </div>
                )}

                {!showEventForm && selectedDate && (
                    <div>
                        <h3 className="font-orbitron text-lg accent-text mb-2">
                            Events for: {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </h3>
                        {eventsForSelectedDay.length > 0 ? (
                            <ul className="space-y-2">
                                {eventsForSelectedDay.map(event => (
                                    <li key={event.id} className="p-2.5 bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.category}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button variant="ghost" size="icon" onClick={() => openEditForm(event)} className="btn-icon w-6 h-6"><Edit className="w-3.5 h-3.5"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => onDeleteEvent(event.id)} className="btn-icon danger w-6 h-6"><Trash2 className="w-3.5 h-3.5"/></Button>
                                            </div>
                                        </div>
                                        {event.description && <p className="text-xs text-foreground mt-1 pt-1 border-t border-[var(--border-color-val)]/50">{event.description}</p>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No events for this day.</p>
                        )}
                    </div>
                )}
                 {!showEventForm && !selectedDate && (
                    <p className="text-sm text-muted-foreground text-center py-4">Select a date to see events.</p>
                )}
            </div>
        </div>
    </div>
  );
}