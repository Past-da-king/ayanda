"use client"; 

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Event as AppEvent, Category, RecurrenceRule } from '@/types';
import { cn } from '@/lib/utils';
import { X, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Repeat, Eye, Pencil } from 'lucide-react';
import { DateFormatter } from "react-day-picker"; 
import { format, parseISO, isValid as isValidDate, add, startOfDay } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const MarkdownCheatsheet: React.FC = () => (
  <div className="p-3 text-xs space-y-1 text-muted-foreground bg-popover border border-border rounded-md shadow-md w-64">
    <p><strong># H1</strong>, <strong>## H2</strong>, <strong>### H3</strong></p>
    <p><strong>**bold**</strong> or __bold__</p>
    <p><em>*italic*</em> or _italic_</p>
    <p>~<sub>~</sub>Strikethrough~<sub>~</sub></p>
    <p>Unordered List: <br />- Item 1<br />- Item 2</p>
    <p>Ordered List: <br />1. Item 1<br />2. Item 2</p>
    <p>Checklist: <br />- [ ] To do<br />- [x] Done</p>
    <p>[Link Text](https://url.com)</p>
    <p>`Inline code`</p>
    <p>```<br />Code block<br />```</p>
  </div>
);

const EventRecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
  startDate: string; 
}> = ({ recurrence, onChange, startDate }) => {
  console.log('[EventRecurrenceEditor] Rendering/Mounting. Props:', { recurrence, startDate });
  const [type, setType] = useState<RecurrenceRule['type'] | ''>(recurrence?.type || ''); 
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize state from props only on mount or if prop changes significantly
  useEffect(() => {
    console.log('[EventRecurrenceEditor] Initializing state from props. Prop recurrence:', recurrence);
    setType(recurrence?.type || '');
    setIntervalValue(recurrence?.interval || 1);
    setDaysOfWeek(recurrence?.daysOfWeek || []);
    setEndDate(recurrence?.endDate || '');
  }, [recurrence]); // Only re-initialize if the `recurrence` prop itself changes reference or value

  useEffect(() => {
    console.log('[EventRecurrenceEditor] Rule calculation useEffect triggered. Internal State:', { type, interval, daysOfWeek, endDate, startDate });
    console.log('[EventRecurrenceEditor] Current prop `recurrence` for comparison:', recurrence);

    let newRuleCalculated: RecurrenceRule | undefined = undefined;

    if (type && interval > 0) {
        newRuleCalculated = { type, interval };
        if (type === 'weekly') {
            if (daysOfWeek.length > 0) {
                newRuleCalculated.daysOfWeek = [...daysOfWeek].sort((a, b) => a - b);
            } else if (startDate && isValidDate(parseISO(startDate))) {
                const startDay = parseISO(startDate + 'T00:00:00Z').getDay();
                newRuleCalculated.daysOfWeek = [startDay];
            }
        }
        if (endDate && isValidDate(parseISO(endDate))) {
            newRuleCalculated.endDate = endDate;
        } else if (newRuleCalculated?.endDate) { // Clear it if endDate is now invalid or empty but was set
            delete newRuleCalculated.endDate;
        }
    }
    // If type is empty or interval invalid, newRuleCalculated remains undefined.

    const currentRecurrencePropString = JSON.stringify(recurrence); // Stringify the prop
    const newCalculatedRuleString = JSON.stringify(newRuleCalculated);

    console.log('[EventRecurrenceEditor] Comparing rules:', { currentRecurrencePropString, newCalculatedRuleString });

    if (newCalculatedRuleString !== currentRecurrencePropString) {
        console.log('[EventRecurrenceEditor] Calculated rule differs from prop. Calling onChange with:', newRuleCalculated);
        onChange(newRuleCalculated);
    } else {
        console.log('[EventRecurrenceEditor] Calculated rule matches prop. Not calling onChange.');
    }
  }, [type, interval, daysOfWeek, endDate, startDate, recurrence, onChange]); // `recurrence` prop added as dependency

  const handleTypeChangeInternal = (selectedValue: string) => {
    console.log('[EventRecurrenceEditor] Select type changed to:', selectedValue);
    if (["daily", "weekly", "monthly", "yearly", ""].includes(selectedValue)) { // Allow "" to clear type
        setType(selectedValue as RecurrenceRule['type'] | '');
    }
  };

  const toggleDay = (dayIndex: number) => {
    console.log('[EventRecurrenceEditor] Toggling day:', dayIndex);
    setDaysOfWeek(prev => {
        const newDays = prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex];
        console.log('[EventRecurrenceEditor] New daysOfWeek state:', newDays);
        return newDays;
    });
  };
  
  if (!type && !recurrence) { // Show "Set Recurrence" button only if no type is set AND no recurrence prop exists
    return <Button variant="outline" size="sm" onClick={() => handleTypeChangeInternal('weekly')} className="w-full input-field text-xs justify-start font-normal"><Repeat className="w-3 h-3 mr-1.5"/>Set Recurrence</Button>
  }

  return (
    <div className="space-y-2 p-3 border border-border-main rounded-md bg-input-bg/50 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => handleTypeChangeInternal('')}><X className="w-3 h-3"/></Button>
      </div>
      <Select 
        value={type} 
        onValueChange={handleTypeChangeInternal}
      >
        <SelectTrigger className="input-field text-xs h-8"><SelectValue placeholder="No Recurrence" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (on start date's day)</SelectItem>
          <SelectItem value="yearly">Yearly (on start date)</SelectItem>
          <SelectItem value="">Disable Recurrence</SelectItem>
        </SelectContent>
      </Select>
      {type && ( // Only show interval, days, end date if a type is selected
        <>
            <Input type="number" min="1" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval" className="input-field text-xs h-8" />
            {type === 'weekly' && (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                {weekDays.map((day, i) => (
                    <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-[10px] flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
                    {day}
                    </Button>
                ))}
                </div>
            )}
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" title="Recurrence End Date" className="input-field text-xs h-8" />
        </>
      )}
    </div>
  );
};

interface CalendarFullScreenViewProps {
  events: AppEvent[];
  categories: Category[]; 
  currentCategory: Category; 
  onAddEvent: (eventData: Omit<AppEvent, 'id' | 'userId'>) => void;
  onUpdateEvent: (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id' | 'userId'>>) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  date: string; 
  time: string; 
  category: Category; 
  description?: string;
  recurrenceRule?: RecurrenceRule;
}

export function CalendarFullScreenView({
  events, categories, currentCategory, onAddEvent, onUpdateEvent, onDeleteEvent, onClose
}: CalendarFullScreenViewProps) {
  console.log('[CalendarFullScreenView] Rendering. Props:', { currentCategory, categoriesCount: categories.length, eventsCount: events.length });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [isPreviewingDescription, setIsPreviewingDescription] = useState(false);
  
  const resolvedInitialCategoryForForm = useMemo(() => {
    console.log('[useMemo resolvedInitialCategoryForForm] Calculating. currentCategory:', currentCategory, 'categories:', categories);
    if (currentCategory !== "All Projects" && categories.includes(currentCategory)) {
        return currentCategory;
    }
    const firstSpecificCategory = categories.find(c => c !== "All Projects" && c !== undefined);
    if (firstSpecificCategory) {
        return firstSpecificCategory;
    }
    const firstCat = categories.length > 0 && categories[0] !== "All Projects" ? categories[0] : undefined;
    return firstCat || "Personal Life" as Category; 
  }, [currentCategory, categories]);

  const [formData, setFormData] = useState<EventFormData>(() => {
    console.log('[useState formData init] resolvedInitialCategoryForForm:', resolvedInitialCategoryForForm);
    return {
        title: '',
        date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
        time: '12:00',
        category: resolvedInitialCategoryForForm, 
        description: '',
        recurrenceRule: undefined,
    };
  });
  console.log('[CalendarFullScreenView] Current formData state:', formData, 'showEventForm:', showEventForm);


  useEffect(() => {
    console.log('[useEffect updateDefaultsForNonForm] Deps changed:', { selectedDate, resolvedInitialCategoryForForm, showEventForm, editingEvent });
    if (!showEventForm && !editingEvent) { // Only run if form is not shown and not editing
      const newDefaultCategory = resolvedInitialCategoryForForm;
      const newDefaultDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      
      setFormData(prev => {
        console.log('[useEffect updateDefaultsForNonForm] Inside setFormData. prev:', prev, 'New defaults:', { newDefaultCategory, newDefaultDate });
        // Only update if the underlying defaults (date from calendar, or project category) changed
        if (prev.category !== newDefaultCategory || prev.date !== newDefaultDate) {
          console.log('[useEffect updateDefaultsForNonForm] Updating formData based on new defaults for non-form state.');
          return { 
            title: '', 
            description: '', 
            recurrenceRule: undefined, 
            time: '12:00', 
            category: newDefaultCategory, 
            date: newDefaultDate 
          };
        }
        console.log('[useEffect updateDefaultsForNonForm] formData matches new defaults, not updating.');
        return prev; 
      });
    }
  }, [selectedDate, resolvedInitialCategoryForForm, showEventForm, editingEvent]);


  const handleShowNewEventForm = () => {
    console.log('[handleShowNewEventForm] Clicked. Current selectedDate:', selectedDate, 'resolvedInitialCategoryForForm:', resolvedInitialCategoryForForm);
    setEditingEvent(null);
    setIsPreviewingDescription(false);
    const newDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    const initialCategory = resolvedInitialCategoryForForm; // Capture before setting form data

    setFormData({ // Set fresh state for a new event
      title: '',
      date: newDate,
      time: '12:00',
      category: initialCategory, 
      description: '',
      recurrenceRule: undefined, // Explicitly reset recurrenceRule
    });
    console.log('[handleShowNewEventForm] Called setFormData. New data:', {date: newDate, category: initialCategory, recurrenceRule: undefined });
    setShowEventForm(true);
    console.log('[handleShowNewEventForm] Called setShowEventForm(true)');
  };

  useEffect(() => {
    console.log('[useEffect editingEvent] editingEvent changed:', editingEvent);
    if (editingEvent) {
      const eventDateObj = parseISO(editingEvent.date);
      setFormData({
        title: editingEvent.title,
        date: format(eventDateObj, 'yyyy-MM-dd'),
        time: format(eventDateObj, 'HH:mm'),
        category: editingEvent.category, 
        description: editingEvent.description || '',
        recurrenceRule: editingEvent.recurrenceRule, // Load existing recurrenceRule
      });
      setShowEventForm(true);
      setIsPreviewingDescription(false);
      console.log('[useEffect editingEvent] Set formData for editing and showed form. RecurrenceRule:', editingEvent.recurrenceRule);
    }
  }, [editingEvent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('[handleInputChange]', { name, value });
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = useCallback((newCategoryValue: string) => {
    console.log('[handleCategoryChange] Received newCategoryValue:', newCategoryValue);
    setFormData(prevFormData => {
      console.log('[handleCategoryChange] Inside setFormData. prevFormData.category:', prevFormData.category, 'newCategoryValue:', newCategoryValue);
      if (newCategoryValue !== prevFormData.category) {
        const foundCategory = categories.find(cat => cat === newCategoryValue);
        if (foundCategory) {
          console.log('[handleCategoryChange] Category changing. Updating formData.');
          return { ...prevFormData, category: foundCategory };
        } else {
          console.warn('[handleCategoryChange] New category value not found in available categories:', newCategoryValue);
          return prevFormData; 
        }
      }
      console.log('[handleCategoryChange] Category is the same, not updating formData.');
      return prevFormData; 
    });
  }, [categories]); 

  const handleRecurrenceChange = useCallback((newRule: RecurrenceRule | undefined) => {
    console.log('[handleRecurrenceChange] Received newRule:', newRule, 'Current formData.recurrenceRule:', formData.recurrenceRule);
    setFormData(prevFormData => {
      const prevRuleString = JSON.stringify(prevFormData.recurrenceRule);
      const newRuleString = JSON.stringify(newRule);
      console.log('[handleRecurrenceChange] Inside setFormData. Comparing rules:', { prevRuleString, newRuleString });
      if (newRuleString !== prevRuleString) {
        console.log('[handleRecurrenceChange] Recurrence rule is different. Updating formData.');
        return { ...prevFormData, recurrenceRule: newRule };
      }
      console.log('[handleRecurrenceChange] Recurrence rule is the same, not updating formData.');
      return prevFormData;
    });
  }, []); // Removed formData from deps, as we use functional update.

  const resetForm = () => {
    console.log('[resetForm] Resetting form.');
    setShowEventForm(false);
    setEditingEvent(null);
    setIsPreviewingDescription(false);
    const newDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    setFormData({ 
      title: '',
      date: newDate,
      time: '12:00',
      category: resolvedInitialCategoryForForm, 
      description: '',
      recurrenceRule: undefined,
    });
    console.log('[resetForm] Form reset with date:', newDate, 'category:', resolvedInitialCategoryForForm);
  };

  const handleSubmitEvent = () => {
    console.log('[handleSubmitEvent] Submitting event. formData:', formData);
    if (!formData.title || !formData.date || !formData.time) {
        console.warn('[handleSubmitEvent] Form validation failed: title, date, or time missing.');
        return;
    }
    const dateTimeString = `${formData.date}T${formData.time}:00.000Z`; 
    
    const eventDataSubmit = {
        title: formData.title,
        date: dateTimeString,
        category: formData.category, 
        description: formData.description,
        recurrenceRule: formData.recurrenceRule,
    };

    if (editingEvent) {
      console.log('[handleSubmitEvent] Updating event ID:', editingEvent.id);
      onUpdateEvent(editingEvent.id, eventDataSubmit);
    } else {
      console.log('[handleSubmitEvent] Adding new event.');
      onAddEvent(eventDataSubmit);
    }
    resetForm();
  };
  
  const getNextOccurrence = (event: AppEvent, fromDate: Date): Date | null => {
    if (!event.recurrenceRule) return null;
    const rule = event.recurrenceRule;
    let baseDate = startOfDay(parseISO(event.date)); 
    let checkDate = startOfDay(fromDate); 

    if (rule.endDate && checkDate > startOfDay(parseISO(rule.endDate))) return null;

    for(let i=0; i< 365; i++) { 
        let currentIterDate: Date;
        switch(rule.type) {
            case 'daily': 
                currentIterDate = add(baseDate, { days: rule.interval * i });
                break;
            case 'weekly':
                currentIterDate = add(baseDate, { weeks: rule.interval * i });
                if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                    let baseDayOfWeek = currentIterDate.getDay();
                    let targetDayInWeek = rule.daysOfWeek.find(d => d >= baseDayOfWeek);
                    if (targetDayInWeek !== undefined) {
                        currentIterDate = add(currentIterDate, { days: targetDayInWeek - baseDayOfWeek });
                    } else { // Target day(s) are in the next week cycle for this iteration
                        currentIterDate = add(baseDate, { weeks: rule.interval * (i + 1) }); // Move to the start of next interval
                        // Then find the first dayOfWeek in that new week
                        currentIterDate = add(currentIterDate, { days: rule.daysOfWeek[0] - currentIterDate.getDay() }); 
                    }
                }
                break;
            case 'monthly': 
                currentIterDate = add(baseDate, { months: rule.interval * i}); 
                // Adjust day if it exceeds the number of days in the target month
                if (currentIterDate.getDate() !== baseDate.getDate()) { 
                    const lastDayOfMonth = new Date(currentIterDate.getFullYear(), currentIterDate.getMonth() + 1, 0).getDate();
                    if (baseDate.getDate() > lastDayOfMonth) { // Original day is e.g. 31st, but current month only has 30
                        currentIterDate.setDate(lastDayOfMonth);
                    } else { // Original day is valid for current month (e.g. 15th)
                         currentIterDate.setDate(baseDate.getDate());
                    }
                }
                break;
            case 'yearly': 
                currentIterDate = add(baseDate, { years: rule.interval * i}); 
                // Ensure month and day are consistent if Feb 29 is involved.
                if (currentIterDate.getMonth() !== baseDate.getMonth() || currentIterDate.getDate() !== baseDate.getDate()) {
                    currentIterDate = new Date(currentIterDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
                }
                break;
            default: return null;
        }
        currentIterDate = startOfDay(currentIterDate);

        if(currentIterDate >= checkDate) { 
             if (rule.endDate && currentIterDate > startOfDay(parseISO(rule.endDate))) return null; 
            return currentIterDate;
        }
    }
    return null;
  };

  const DayCellContent: DateFormatter = useCallback((day, options) => { 
    const dayStart = startOfDay(day);
    let hasBaseEvent = false;
    let hasRecurringInstance = false;

    events.forEach(event => {
        if (!event) return;
        const eventBaseDate = startOfDay(parseISO(event.date));
        if (eventBaseDate.getTime() === dayStart.getTime()) {
            hasBaseEvent = true;
        }
        if (event.recurrenceRule) {
            // Check occurrences on or after the day itself, but only up to the day to avoid future dots.
            const next = getNextOccurrence(event, dayStart); 
            if (next && startOfDay(next).getTime() === dayStart.getTime()) {
                hasRecurringInstance = true;
            }
        }
    });

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {format(day, "d", { locale: options?.locale })} 
        {(hasBaseEvent || hasRecurringInstance) && (
          <span className={cn(
              "absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full",
              hasBaseEvent && hasRecurringInstance ? "bg-gradient-to-r from-primary to-destructive" :
              hasBaseEvent ? "bg-primary" : 
              hasRecurringInstance ? "bg-primary/50" : "" // Ensure it's actually there
          )} />
        )}
      </div>
    );
  }, [events]); 
  
  const eventsForSelectedDay = selectedDate ? events.flatMap(event => {
    if (!event) return [];
    const eventDateObj = parseISO(event.date);
    const selectedDayStart = startOfDay(selectedDate);
    const eventDayStart = startOfDay(eventDateObj);
    
    const results: AppEvent[] = [];
    // Add if it's a base event on this day
    if (eventDayStart.getTime() === selectedDayStart.getTime()) {
        results.push(event); 
    }
    
    // Add if it's a recurring instance on this day
    if (event.recurrenceRule) {
        const next = getNextOccurrence(event, selectedDayStart); // Check for occurrence ON selectedDayStart
        if (next && startOfDay(next).getTime() === selectedDayStart.getTime()) {
            // Avoid duplicating if the base event is also the recurring instance
            if (eventDayStart.getTime() !== selectedDayStart.getTime()) { 
                results.push({
                    ...event, // Original ID and recurrence rule
                    date: format(selectedDate, 'yyyy-MM-dd') + 'T' + format(eventDateObj, 'HH:mm:ss.SSS') + 'Z', // Date of this instance
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
                    onSelect={(day) => {
                        console.log('[Calendar onSelect] Day selected:', day);
                        setSelectedDate(day);
                    }}
                    month={viewMonth}
                    onMonthChange={(month) => {
                        console.log('[Calendar onMonthChange] Month changed to:', month);
                        setViewMonth(month);
                    }}
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
                <Button onClick={handleShowNewEventForm} className="w-full btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2"/> Add Event
                </Button>

                {showEventForm && (
                    <div className="p-3 border border-border-main rounded-md bg-input-bg/70 space-y-3">
                        <h3 className="font-orbitron text-lg accent-text">{editingEvent ? 'Edit Event' : 'New Event'}</h3>
                        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} className="input-field" disabled={isPreviewingDescription}/>
                        <div className="flex gap-2">
                            <Input name="date" type="date" value={formData.date} onChange={handleInputChange} className="input-field" disabled={isPreviewingDescription}/>
                            <Input name="time" type="time" value={formData.time} onChange={handleInputChange} className="input-field" disabled={isPreviewingDescription}/>
                        </div>
                        {console.log('[Select render] Value being passed to Select:', formData.category, 'Available categories for dropdown:', categories)}
                        <Select name="category" value={formData.category} onValueChange={handleCategoryChange} disabled={isPreviewingDescription}>
                            <SelectTrigger className="input-field"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main">
                                {categories.map(cat => {
                                    return <SelectItem key={cat} value={cat}>{cat}</SelectItem>;
                                })}
                            </SelectContent>
                        </Select>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="event-description" className="text-xs text-muted-foreground">Description (Markdown)</label>
                                <div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-6 px-1">Help</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                                    </Popover>
                                    <Button variant="ghost" size="icon" onClick={() => setIsPreviewingDescription(!isPreviewingDescription)} className="w-6 h-6 ml-1">
                                        {isPreviewingDescription ? <Pencil className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                                    </Button>
                                </div>
                            </div>
                            {isPreviewingDescription ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none p-2 min-h-[60px] border border-dashed border-border-main rounded-md bg-background/50">
                                    <ReactMarkdown>{formData.description || "Nothing to preview..."}</ReactMarkdown>
                                </div>
                            ) : (
                                <Textarea id="event-description" name="description" placeholder="Details... (Markdown supported)" value={formData.description || ''} onChange={handleInputChange} className="input-field min-h-[60px]"/>
                            )}
                        </div>
                        {!isPreviewingDescription && 
                            <EventRecurrenceEditor 
                                recurrence={formData.recurrenceRule} 
                                onChange={handleRecurrenceChange} 
                                startDate={formData.date}
                            />
                        }
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSubmitEvent} className="flex-grow btn-primary" disabled={isPreviewingDescription}>{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
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
                                {eventsForSelectedDay.map((event, idx) => ( 
                                    <li key={`${event.id}-${idx}`} className="p-2.5 bg-input-bg/70 border border-border-main rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(parseISO(event.date), 'p')} - {event.category}
                                                    {event.recurrenceRule && <Repeat className="w-3 h-3 inline ml-1.5 text-muted-foreground/70"/>}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button variant="ghost" size="icon" onClick={() => { 
                                                    console.log('[Edit Button Click] Setting editingEvent for ID:', event.id);
                                                    const originalEvent = events.find(e => e.id === event.id); // Find the original to get full recurrenceRule if it's a projected instance
                                                    setEditingEvent(originalEvent || event);
                                                }} className="btn-icon w-6 h-6"><Edit className="w-3.5 h-3.5"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => onDeleteEvent(event.id)} className="btn-icon danger w-6 h-6"><Trash2 className="w-3.5 h-3.5"/></Button>
                                            </div>
                                        </div>
                                        {event.description && (
                                            <div className="prose prose-sm dark:prose-invert max-w-none mt-1 pt-1 border-t border-border-main/50 text-foreground">
                                               <ReactMarkdown>{event.description}</ReactMarkdown>
                                            </div>
                                        )}
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
