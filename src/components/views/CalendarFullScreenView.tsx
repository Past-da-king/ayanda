"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Event as AppEvent, Category, RecurrenceRule } from '@/types';
import { cn } from '@/lib/utils';
import { X, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { DateFormatter, DayPicker } from "react-day-picker"; // Import DayPicker for its types
import { format, parseISO, isValid as isValidDate, add, startOfDay } from 'date-fns';

// Simplified Recurrence Editor Component for Events (can be expanded or shared)
const EventRecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
  startDate: string; // YYYY-MM-DD format from the event form
}> = ({ recurrence, onChange, startDate }) => {
  const [type, setType] = useState(recurrence?.type || ''); // Start empty to enable
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (type && interval > 0) {
      const newRule: RecurrenceRule = { type, interval };
      if (type === 'weekly' && daysOfWeek.length > 0) newRule.daysOfWeek = daysOfWeek;
      else if (type === 'weekly' && startDate) { // Default day of week for weekly if none selected
         const startDay = parseISO(startDate + 'T00:00:00Z').getDay(); // Get day of week from start date
         newRule.daysOfWeek = [startDay];
      }
      if (endDate) newRule.endDate = endDate;
      onChange(newRule);
    } else {
      onChange(undefined); 
    }
  }, [type, interval, daysOfWeek, endDate, onChange, startDate]);

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]);
  };
  
  if (type === '') { // Initial state to enable recurrence
    return <Button variant="outline" size="sm" onClick={() => setType('weekly')} className="w-full input-field text-xs justify-start font-normal"><Repeat className="w-3 h-3 mr-1.5"/>Set Recurrence</Button>
  }

  return (
    <div className="space-y-2 p-3 border border-border-main rounded-md bg-input-bg/50 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => { onChange(undefined); setType(''); }}><X className="w-3 h-3"/></Button>
      </div>
      <Select value={type} onValueChange={(val) => setType(val as RecurrenceRule['type'])}>
        <SelectTrigger className="input-field text-xs h-8"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (on start date's day)</SelectItem>
          <SelectItem value="yearly">Yearly (on start date)</SelectItem>
        </SelectContent>
      </Select>
      <Input type="number" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval" className="input-field text-xs h-8" />
      {type === 'weekly' && (
        <div className="flex space-x-1">
          {weekDays.map((day, i) => (
            <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-[11px] flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
              {day}
            </Button>
          ))}
        </div>
      )}
      <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" title="Recurrence End Date" className="input-field text-xs h-8" />
    </div>
  );
};


interface CalendarFullScreenViewProps {
  events: AppEvent[];
  categories: Category[];
  currentCategory: Category; // This is the project filter, form should use specific category
  onAddEvent: (eventData: Omit<AppEvent, 'id'>) => void;
  onUpdateEvent: (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id'>>) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  category: Category;
  description?: string;
  recurrenceRule?: RecurrenceRule;
}

export function CalendarFullScreenView({
  events, categories, currentCategory, onAddEvent, onUpdateEvent, onDeleteEvent, onClose
}: CalendarFullScreenViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  
  const initialFormCategory = () => {
    if (currentCategory !== "All Projects" && categories.includes(currentCategory)) return currentCategory;
    return categories.length > 0 ? categories[0] : "Personal Life" as Category;
  };

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    category: initialFormCategory(),
    description: '',
    recurrenceRule: undefined,
  });

  useEffect(() => {
    if (selectedDate && !showEventForm && !editingEvent) { // Only update form date if not actively editing/adding
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, 'yyyy-MM-dd'),
        category: initialFormCategory()
      }));
    }
  }, [selectedDate, showEventForm, editingEvent, currentCategory, categories]);


  useEffect(() => {
    if (editingEvent) {
      const eventDateObj = parseISO(editingEvent.date);
      setFormData({
        title: editingEvent.title,
        date: format(eventDateObj, 'yyyy-MM-dd'),
        time: format(eventDateObj, 'HH:mm'),
        category: editingEvent.category,
        description: editingEvent.description || '',
        recurrenceRule: editingEvent.recurrenceRule,
      });
      setShowEventForm(true);
    }
  }, [editingEvent]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as Category }));
  };
  const handleRecurrenceChange = (rule: RecurrenceRule | undefined) => {
    setFormData(prev => ({ ...prev, recurrenceRule: rule}));
  }

  const handleSubmitEvent = () => {
    if (!formData.title || !formData.date || !formData.time) return;
    const dateTimeString = `${formData.date}T${formData.time}:00.000Z`; // Assume local, convert to ISO for storage
    
    const eventData = {
        title: formData.title,
        date: dateTimeString,
        category: formData.category,
        description: formData.description,
        recurrenceRule: formData.recurrenceRule,
    };

    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventData);
    } else {
      onAddEvent(eventData);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      time: '12:00',
      category: initialFormCategory(),
      description: '',
      recurrenceRule: undefined,
    });
  };
  
  const getNextOccurrence = (event: AppEvent, fromDate: Date): Date | null => {
    if (!event.recurrenceRule) return null;
    const rule = event.recurrenceRule;
    let baseDate = startOfDay(parseISO(event.date)); // Start from the event's original start date/time
    let checkDate = startOfDay(fromDate); // Date to find next occurrence after

    if (baseDate > checkDate) { // If base is in future relative to checkDate's start of day, it's the next one
        // Only return if it matches rule if it's a weekly rule and daysOfWeek is set
        if(rule.type === 'weekly' && rule.daysOfWeek && !rule.daysOfWeek.includes(baseDate.getDay())) {
            // continue searching below
        } else {
            return baseDate;
        }
    }
    
    // Simplified calculation - this would be much more complex with rrule.js
    // This basic logic only handles simple daily/weekly for demonstration
    for(let i=0; i< 365; i++) { // Limit search to 1 year
        let next: Date;
        switch(rule.type) {
            case 'daily': 
                next = add(baseDate, { days: rule.interval * i });
                break;
            case 'weekly':
                next = add(baseDate, { weeks: rule.interval * i });
                 // Adjust to the correct day of the week if specified
                if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                    let currentDay = next.getDay();
                    let targetDay = rule.daysOfWeek.find(d => d >= currentDay) ?? rule.daysOfWeek[0];
                    let diff = targetDay - currentDay;
                    if (diff < 0 && i === 0 && baseDate <= checkDate) { // If first week and target day passed for baseDate
                        // Try next week's first available day
                         next = add(next, {days: 7 - currentDay + rule.daysOfWeek[0]});

                    } else if (diff < 0) { // Target day passed for this iteration
                         next = add(next, {days: (7 - currentDay) + targetDay}); // Go to next week's target day
                    }
                     else {
                        next = add(next, { days: diff });
                    }
                }
                break;
            // Basic monthly/yearly - just add interval months/years
            case 'monthly': next = add(baseDate, { months: rule.interval * i}); break;
            case 'yearly': next = add(baseDate, { years: rule.interval * i}); break;
            default: return null;
        }
        next = startOfDay(next); // Compare day-granularity

        if(next > checkDate) { // Must be strictly after the fromDate's start of day
             if (rule.endDate && next > startOfDay(parseISO(rule.endDate))) return null; // Past end date
            return next;
        }
    }
    return null;
  };


  const DayCellContent: DateFormatter = useCallback((day, options, { locale }) => {
    const dayStart = startOfDay(day);
    let hasBaseEvent = false;
    let hasRecurringInstance = false;

    events.forEach(event => {
        const eventBaseDate = startOfDay(parseISO(event.date));
        if (eventBaseDate.getTime() === dayStart.getTime()) {
            hasBaseEvent = true;
        }
        if (event.recurrenceRule) {
            const next = getNextOccurrence(event, add(dayStart, {days: -1})); // Check if next occurrence falls on 'day'
            if (next && startOfDay(next).getTime() === dayStart.getTime()) {
                hasRecurringInstance = true;
            }
        }
    });

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {format(day, "d", { locale })}
        {(hasBaseEvent || hasRecurringInstance) && (
          <span className={cn(
              "absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full",
              hasBaseEvent && hasRecurringInstance ? "bg-gradient-to-r from-primary to-destructive" :
              hasBaseEvent ? "bg-primary" : 
              "bg-primary/50" // Recurring instance only
          )} />
        )}
      </div>
    );
  }, [events]);
  
  const eventsForSelectedDay = selectedDate ? events.flatMap(event => {
    const eventDateObj = parseISO(event.date);
    const selectedDayStart = startOfDay(selectedDate);
    const eventDayStart = startOfDay(eventDateObj);
    
    const results: AppEvent[] = [];
    if (eventDayStart.getTime() === selectedDayStart.getTime()) {
        results.push(event); // Original event instance
    }
    // Check for recurring instances on selectedDate
    if (event.recurrenceRule) {
        const next = getNextOccurrence(event, add(selectedDayStart, {days: -1}));
        if (next && startOfDay(next).getTime() === selectedDayStart.getTime()) {
            // Create a synthetic event for this occurrence
            // This might be the same as the base event if it's the first occurrence
            if (eventDayStart.getTime() !== selectedDayStart.getTime()) { // Avoid duplicating if base matches
                results.push({
                    ...event,
                    date: format(selectedDate, 'yyyy-MM-dd') + 'T' + format(eventDateObj, 'HH:mm:ss.SSS') + 'Z', // Keep original time
                    // id: `${event.id}-clone-${format(selectedDate, 'yyyyMMdd')}` // Synthetic ID if needed for keys
                });
            }
        }
    }
    return results;

  }).filter((event, index, self) => index === self.findIndex((e) => e.id === event.id && e.date === event.date)) // Deduplicate
  .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];


  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" 
    )}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-3xl accent-text">Calendar</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
                <X className="w-7 h-7" />
            </Button>
        </div>

        <div className="flex-grow flex gap-6 overflow-hidden">
            <div className="w-2/3 lg:w-3/4 bg-widget-background border border-border-main rounded-md p-6 flex flex-col items-center justify-start custom-scrollbar-fullscreen">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={viewMonth}
                    onMonthChange={setViewMonth}
                    className="w-full max-w-2xl" 
                    classNames={{
                        root: "w-full", 
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center h-10 mb-2",
                        caption_label: "text-xl font-orbitron accent-text",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
                            "rounded-md hover:bg-accent/20 text-muted-foreground hover:text-accent-foreground transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full mb-1",
                        head_cell: "text-muted-foreground rounded-md w-[14.28%] text-xs font-medium p-1 h-8 justify-center",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative w-[14.28%] h-16 sm:h-20 focus-within:relative focus-within:z-20",
                        day: cn(
                            "w-full h-full p-0 font-normal rounded-md",
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "transition-colors"
                        ),
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground ring-1 ring-primary/60",
                        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50 pointer-events-none",
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

            <div className="w-1/3 lg:w-1/4 bg-widget-background border border-border-main rounded-md p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar-fullscreen">
                <Button onClick={() => { setEditingEvent(null); setShowEventForm(true); }} className="w-full btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2"/> Add Event
                </Button>

                {showEventForm && (
                    <div className="p-3 border border-border-main rounded-md bg-input-bg/70 space-y-3">
                        <h3 className="font-orbitron text-lg accent-text">{editingEvent ? 'Edit Event' : 'New Event'}</h3>
                        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} className="input-field"/>
                        <div className="flex gap-2">
                            <Input name="date" type="date" value={formData.date} onChange={handleInputChange} className="input-field"/>
                            <Input name="time" type="time" value={formData.time} onChange={handleInputChange} className="input-field"/>
                        </div>
                        <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="input-field"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main">
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Textarea name="description" placeholder="Description (optional)" value={formData.description || ''} onChange={handleInputChange} className="input-field min-h-[60px]"/>
                        <EventRecurrenceEditor recurrence={formData.recurrenceRule} onChange={handleRecurrenceChange} startDate={formData.date}/>
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSubmitEvent} className="flex-grow btn-primary">{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
                            <Button variant="outline" onClick={resetForm} className="border-border-main text-muted-foreground hover:bg-background">Cancel</Button>
                        </div>
                    </div>
                )}

                {!showEventForm && selectedDate && (
                    <div>
                        <h3 className="font-orbitron text-lg accent-text mb-2">
                            Events for: {format(selectedDate, 'MMM d, yyyy')}
                        </h3>
                        {eventsForSelectedDay.length > 0 ? (
                            <ul className="space-y-2">
                                {eventsForSelectedDay.map((event, idx) => ( // Using idx for key if synthetic events don't have unique ID
                                    <li key={event.id + '-' + idx} className="p-2.5 bg-input-bg/70 border border-border-main rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(parseISO(event.date), 'p')} - {event.category}
                                                    {event.recurrenceRule && <Repeat className="w-3 h-3 inline ml-1.5 text-muted-foreground/70"/>}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingEvent(events.find(e=>e.id === event.id) || event) }} className="btn-icon w-6 h-6"><Edit className="w-3.5 h-3.5"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => onDeleteEvent(event.id)} className="btn-icon danger w-6 h-6"><Trash2 className="w-3.5 h-3.5"/></Button>
                                            </div>
                                        </div>
                                        {event.description && <p className="text-xs text-foreground mt-1 pt-1 border-t border-border-main/50 whitespace-pre-wrap">{event.description}</p>}
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
