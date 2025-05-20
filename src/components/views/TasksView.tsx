"use client";

import React, { useState, useEffect } from 'react';
import { Task, Category, RecurrenceRule, SubTask } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; 
import { X, Edit, Trash2, CalendarDays, PlusCircle, Repeat, GripVertical, ListPlus, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; 
import { format, parseISO, isValid as isValidDateFn } from 'date-fns';

interface TasksViewProps {
  tasks: Task[];
  categories: Category[];
  currentCategory: Category;
  onAddTask: (taskData: Omit<Task, 'id' | 'completed'>) => void;
  onToggleTask: (taskId: string, subTaskId?: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, taskUpdateData: Partial<Omit<Task, 'id'>>) => void;
  onClose: () => void;
}

// Simplified Recurrence Editor Component (can be expanded)
const RecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
}> = ({ recurrence, onChange }) => {
  const [type, setType] = useState(recurrence?.type || '');
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (type && interval > 0) {
      const newRule: RecurrenceRule = { type, interval };
      if (type === 'weekly' && daysOfWeek.length > 0) newRule.daysOfWeek = daysOfWeek;
      if (endDate) newRule.endDate = endDate;
      onChange(newRule);
    } else if (type === '') { // User explicitly cleared the type (or wants to disable recurrence)
      onChange(undefined); 
    }
  }, [type, interval, daysOfWeek, endDate, onChange]);

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort());
  };
  
  const handleTypeChange = (val: string) => {
    if (val === '') { // "Disable Recurrence" option
      setType('');
      onChange(undefined);
    } else {
      setType(val as RecurrenceRule['type']);
    }
  };


  if (!recurrence && type === '') { // Initial state to enable recurrence
    return <Button variant="outline" onClick={() => setType('weekly')} className="input-field text-sm justify-start font-normal h-auto py-2.5"><Repeat className="w-3.5 h-3.5 mr-2 text-muted-foreground"/>Set Recurrence</Button>
  }

  return (
    <div className="space-y-3 p-3 border border-border-main rounded-md bg-input-bg/50">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => { onChange(undefined); setType(''); }}><X className="w-3.5 h-3.5"/></Button>
      </div>
      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger className="input-field text-xs h-8"><SelectValue placeholder="Select type..."/></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (on start date's day)</SelectItem>
          <SelectItem value="yearly">Yearly (on start date)</SelectItem>
          <SelectItem value="">Disable Recurrence</SelectItem>
        </SelectContent>
      </Select>
      {type && <>
        <Input type="number" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval (e.g., 1 for every, 2 for every other)" title="Repeat every X (days/weeks/months/years)" className="input-field text-xs h-8" />
        {type === 'weekly' && (
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-7">
            {weekDays.map((day, i) => (
                <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-[10px] flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
                {day}
                </Button>
            ))}
            </div>
        )}
        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" title="Recurrence End Date" className="input-field text-xs h-8" />
      </>}
    </div>
  );
};


export function TasksView({ tasks, categories, currentCategory, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, onClose }: TasksViewProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>(currentCategory === "All Projects" && categories.length > 0 ? categories[0] : currentCategory);
  const [newRecurrenceRule, setNewRecurrenceRule] = useState<RecurrenceRule | undefined>(undefined);
  const [newSubTasks, setNewSubTasks] = useState<Omit<SubTask, 'id' | 'completed'>[]>([]);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => { 
    if (currentCategory === "All Projects" && categories.length > 0) {
        setNewTaskCategory(categories[0]);
    } else if (categories.includes(currentCategory)) {
        setNewTaskCategory(currentCategory);
    } else if (categories.length > 0) {
        setNewTaskCategory(categories[0]);
    }
  }, [currentCategory, categories]);

  const resetNewTaskForm = () => {
    setNewTaskText('');
    setNewTaskDueDate('');
    setNewRecurrenceRule(undefined);
    setNewSubTasks([]);
    if (currentCategory === "All Projects" && categories.length > 0) setNewTaskCategory(categories[0]);
    else if (categories.includes(currentCategory)) setNewTaskCategory(currentCategory);
    else if (categories.length > 0) setNewTaskCategory(categories[0]);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const taskData: Omit<Task, 'id' | 'completed'> = {
        text: newTaskText.trim(),
        category: newTaskCategory,
        dueDate: newTaskDueDate || undefined,
        recurrenceRule: newRecurrenceRule,
        subTasks: newSubTasks.filter(st => st.text.trim() !== '').map(st => ({id: uuidv4(), text: st.text, completed: false})),
      };
      onAddTask(taskData);
      resetNewTaskForm();
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditingTask(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEditedTask = (formData: {text: string; dueDate?: string; category: Category; recurrenceRule?: RecurrenceRule; subTasks?: SubTask[]}) => {
    if (editingTask) {
        onUpdateTask(editingTask.id, {
            text: formData.text,
            dueDate: formData.dueDate,
            category: formData.category,
            recurrenceRule: formData.recurrenceRule,
            subTasks: formData.subTasks, // Backend will assign IDs if new
        });
        closeEditModal();
    }
  };

  const handleAddSubTaskToNew = () => setNewSubTasks([...newSubTasks, { text: '' }]);
  const handleNewSubTaskChange = (index: number, text: string) => {
    const updated = [...newSubTasks];
    updated[index].text = text;
    setNewSubTasks(updated);
  };
  const handleRemoveSubTaskFromNew = (index: number) => {
    const updated = [...newSubTasks];
    updated.splice(index, 1);
    setNewSubTasks(updated);
  };

  const filteredTasks = tasks
    .filter(task => (currentCategory === "All Projects" || task.category === currentCategory) && (showCompleted || !task.completed))
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const dateA = a.dueDate && isValidDateFn(parseISO(a.dueDate)) ? parseISO(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate && isValidDateFn(parseISO(b.dueDate)) ? parseISO(b.dueDate).getTime() : Infinity;
      if (dateA !== dateB) return dateA - dateB;
      return (b.createdAt || '').localeCompare(a.createdAt || ''); // Fallback sort by creation time
    });

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Tasks</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-widget-background border border-border-main rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Task Form */}
        <div className="space-y-3 p-4 bg-input-bg border border-border-main rounded-md">
          <Input
            type="text"
            placeholder="Add new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="input-field text-base p-3"
          />
          {/* Subtasks for New Task */}
          <div className="pl-4 space-y-2">
            {newSubTasks.map((sub, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CircleDot className="w-3 h-3 text-muted-foreground/50 shrink-0"/>
                  <Input 
                    value={sub.text} 
                    onChange={(e) => handleNewSubTaskChange(index, e.target.value)} 
                    placeholder="Sub-task description"
                    className="input-field text-sm p-1.5 h-8 flex-grow"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveSubTaskFromNew(index)} className="w-7 h-7"><Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive"/></Button>
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddSubTaskToNew} className="text-xs border-border-main hover:bg-widget-background"><ListPlus className="w-3 h-3 mr-1.5"/>Add sub-task</Button>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end pt-2">
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="input-field text-sm h-auto py-2.5"
              title="Due Date"
            />
            <RecurrenceEditor recurrence={newRecurrenceRule} onChange={setNewRecurrenceRule} />

            <Select value={newTaskCategory} onValueChange={(val) => setNewTaskCategory(val as Category)}>
              <SelectTrigger className="input-field text-sm h-auto py-2.5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-widget-background border-border-main text-text-main">
                {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <Button onClick={handleAddTask} className="btn-primary w-full mt-3 text-sm h-auto py-2.5">
                <PlusCircle className="w-4 h-4 mr-2"/> Add Task
            </Button>
        </div>

        <div className="flex justify-end items-center">
           <label htmlFor="task-show-completed-fs" className="flex items-center text-xs text-muted-foreground cursor-pointer">
             <Checkbox
                id="task-show-completed-fs"
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(Boolean(checked))}
                className="mr-1.5 h-3.5 w-3.5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
              /> Show Completed
            </label>
        </div>

        <ul className="space-y-2.5">
          {filteredTasks.map(task => (
            <li key={task.id} className={cn(
                "bg-input-bg border border-border-main rounded-md p-3", 
                task.completed && "opacity-60"
            )}>
                <div className="flex justify-between items-start">
                    <div className="flex items-start flex-grow min-w-0">
                        <Checkbox
                          id={`task-fs-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => onToggleTask(task.id)}
                          className="form-checkbox h-5 w-5 shrink-0 mt-0.5 mr-3 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                        />
                        <div className="flex-grow">
                            <span className={cn("text-base block", task.completed && "line-through")}>{task.text}</span>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center flex-wrap gap-x-2 gap-y-0.5">
                                <span>{task.category}</span>
                                {task.dueDate && isValidDateFn(parseISO(task.dueDate)) && (
                                    <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="flex items-center"><CalendarDays className="w-3 h-3 inline mr-1" />
                                        {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                                    </>
                                )}
                                {task.recurrenceRule && (
                                    <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="flex items-center"><Repeat className="w-3 h-3 inline mr-1" />
                                        {task.recurrenceRule.type}</span>
                                    </>
                                )}
                            </p>
                        </div>
                  </div>
                  <div className="flex items-center space-x-0.5 shrink-0 ml-2">
                     <Button variant="ghost" size="icon" onClick={() => openEditModal(task)} className="btn-icon w-7 h-7"><Edit className="w-4 h-4" /></Button>
                     <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="btn-icon danger w-7 h-7"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                {/* Display Subtasks */}
                {task.subTasks && task.subTasks.length > 0 && (
                    <div className="pl-8 mt-2 space-y-1.5">
                        {task.subTasks.map(sub => (
                            <div key={sub.id} className="flex items-center text-sm">
                                <Checkbox 
                                    id={`subtask-fs-${task.id}-${sub.id}`}
                                    checked={sub.completed}
                                    onCheckedChange={() => onToggleTask(task.id, sub.id)}
                                    className="h-4 w-4 mr-2 border-muted-foreground data-[state=checked]:bg-primary/70 data-[state=checked]:border-primary/70 data-[state=checked]:text-primary-foreground"
                                />
                                <label htmlFor={`subtask-fs-${task.id}-${sub.id}`} className={cn("flex-grow cursor-pointer", sub.completed && "line-through text-muted-foreground")}>{sub.text}</label>
                            </div>
                        ))}
                    </div>
                )}
            </li>
          ))}
           {filteredTasks.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
                {showCompleted ? "No tasks here." : "No active tasks. Way to go!"}
            </p>
          )}
        </ul>
      </div>

      {isEditModalOpen && editingTask && (
        <EditTaskModal 
            task={editingTask} 
            categories={categories}
            onClose={closeEditModal} 
            onSave={handleSaveEditedTask} 
        />
      )}
    </div>
  );
}

interface EditTaskModalProps {
    task: Task;
    categories: Category[];
    onClose: () => void;
    onSave: (formData: {text: string; dueDate?: string; category: Category; recurrenceRule?: RecurrenceRule; subTasks?: SubTask[]}) => void;
}
function EditTaskModal({ task, categories, onClose, onSave }: EditTaskModalProps) {
    const [text, setText] = useState(task.text);
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [category, setCategory] = useState(task.category);
    const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule | undefined>(task.recurrenceRule);
    const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks ? JSON.parse(JSON.stringify(task.subTasks)) : []); // Deep copy

    const handleAddSubTask = () => setSubTasks([...subTasks, { id: uuidv4(), text: '', completed: false }]);
    const handleSubTaskTextChange = (id: string, newText: string) => {
        setSubTasks(subTasks.map(st => st.id === id ? { ...st, text: newText } : st));
    };
    const handleSubTaskToggle = (id: string) => {
        setSubTasks(subTasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
    };
    const handleRemoveSubTask = (id: string) => setSubTasks(subTasks.filter(st => st.id !== id));

    const handleSubmit = () => {
        if(text.trim()) {
            onSave({ text: text.trim(), dueDate: dueDate || undefined, category, recurrenceRule, subTasks: subTasks.filter(st=> st.text.trim() !== '') });
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[110]" onClick={onClose}>
            <div className="bg-widget-background border border-border-main rounded-lg p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-border-main">
                    <h3 className="font-orbitron text-xl accent-text">Edit Task</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text"><X className="w-5 h-5"/></Button>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar-fullscreen">
                    <label className="text-xs font-medium text-muted-foreground">Task Description</label>
                    <Input value={text} onChange={e => setText(e.target.value)} placeholder="Task description" className="input-field p-3"/>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Sub-tasks</label>
                        {subTasks.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2">
                            <Checkbox id={`edit-sub-${sub.id}`} checked={sub.completed} onCheckedChange={() => handleSubTaskToggle(sub.id)} className="h-4 w-4 border-muted-foreground"/>
                            <Input value={sub.text} onChange={e => handleSubTaskTextChange(sub.id, e.target.value)} className="input-field flex-grow text-sm p-1 h-8" placeholder="Sub-task description"/>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveSubTask(sub.id)} className="h-7 w-7"><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive"/></Button>
                        </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={handleAddSubTask} className="text-xs border-border-main hover:bg-input-bg"><ListPlus className="w-3 h-3 mr-1.5"/>Add sub-task</Button>
                    </div>

                    <label className="text-xs font-medium text-muted-foreground">Details</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-field p-3 h-auto" title="Due Date"/>
                        <Select value={category} onValueChange={val => setCategory(val as Category)}>
                            <SelectTrigger className="input-field p-3 h-auto"><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main">
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <RecurrenceEditor recurrence={recurrenceRule} onChange={setRecurrenceRule}/>
                </div>

                <div className="flex justify-end pt-4 border-t border-border-main space-x-2 shrink-0">
                    <Button variant="outline" onClick={onClose} className="border-border-main text-muted-foreground hover:bg-input-bg">Cancel</Button>
                    <Button onClick={handleSubmit} className="btn-primary">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}


