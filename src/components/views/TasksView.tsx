"use client";

import React, { useState } from 'react';
import { Task, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, CalendarDays, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TasksViewProps {
  tasks: Task[];
  categories: Category[];
  currentCategory: Category;
  onAddTask: (taskText: string, dueDate: string | undefined, category: Category) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, newText: string, newDueDate?: string, newCategory?: Category) => void;
  onClose: () => void;
}

export function TasksView({ tasks, categories, currentCategory, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, onClose }: TasksViewProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>(currentCategory);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Store full task for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [showCompleted, setShowCompleted] = useState(false);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), newTaskDueDate || undefined, newTaskCategory);
      setNewTaskText('');
      setNewTaskDueDate('');
      // Keep newTaskCategory as is, or reset to currentCategory
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

  const handleSaveEditedTask = (formData: {text: string; dueDate?: string; category: Category}) => {
    if (editingTask) {
        onUpdateTask(editingTask.id, formData.text, formData.dueDate, formData.category);
        closeEditModal();
    }
  };


  const filteredTasks = tasks
    .filter(task => (currentCategory === "All Projects" || task.category === currentCategory) && (showCompleted || !task.completed))
    .sort((a,b) => (a.completed ? 1 : -1) || (a.dueDate && b.dueDate ? new Date(a.dueDate+"T00:00:00Z").getTime() - new Date(b.dueDate+"T00:00:00Z").getTime() : (a.dueDate ? -1 : (b.dueDate ? 1 : 0))));

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-[var(--background-color-val)] p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" // Padding for header & project bar
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Tasks</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--text-muted-color-val)] hover:accent-text p-2 rounded-md hover:bg-[var(--input-bg-val)]">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Task Form */}
        <div className="space-y-3 p-4 bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md">
          <Input
            type="text"
            placeholder="Add new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="input-field text-base p-3" // Target style
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="input-field text-sm"
            />
            <Select value={newTaskCategory} onValueChange={(val) => setNewTaskCategory(val as Category)}>
              <SelectTrigger className="input-field text-sm h-auto py-2.5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--widget-background-val)] border-[var(--border-color-val)] text-[var(--text-color-val)]">
                {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleAddTask} className="btn btn-primary sm:col-span-1 text-sm h-auto py-2.5"> {/* Target style */}
                <PlusCircle className="w-4 h-4 mr-2"/> Add Task
            </Button>
          </div>
        </div>

        <div className="flex justify-end items-center">
           <label htmlFor="task-show-completed-fs" className="flex items-center text-xs text-[var(--text-muted-color-val)] cursor-pointer">
             <Checkbox
                id="task-show-completed-fs"
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(Boolean(checked))}
                className="mr-1.5 h-3.5 w-3.5 border-[var(--text-muted-color-val)] data-[state=checked]:bg-[var(--accent-color-val)] data-[state=checked]:border-[var(--accent-color-val)] data-[state=checked]:text-[var(--background-color-val)]"
              /> Show Completed
            </label>
        </div>

        {/* Tasks List */}
        <ul className="space-y-2.5">
          {filteredTasks.map(task => (
            <li key={task.id} className={cn("widget-item p-3 flex justify-between items-start", task.completed && "opacity-60")}>
                <div className="flex items-start flex-grow min-w-0"> {/* Added min-w-0 for truncation */}
                    <Checkbox
                      id={`task-fs-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => onToggleTask(task.id)}
                      className="form-checkbox h-5 w-5 shrink-0 mt-0.5 mr-3 border-[var(--text-muted-color-val)] data-[state=checked]:bg-[var(--accent-color-val)] data-[state=checked]:border-[var(--accent-color-val)] data-[state=checked]:text-[var(--background-color-val)]"
                    />
                    <div className="flex-grow">
                        <span className={cn("text-base block", task.completed && "line-through")}>{task.text}</span>
                        <p className="text-xs text-[var(--text-muted-color-val)] mt-0.5">
                            {task.category}
                            {task.dueDate && (
                                <>
                                    <span className="mx-1">•</span>
                                    <CalendarDays className="w-3 h-3 inline mr-1" />
                                    {new Date(task.dueDate + "T00:00:00Z").toLocaleDateString()}
                                </>
                            )}
                        </p>
                    </div>
              </div>
              <div className="flex items-center space-x-1 shrink-0 ml-2">
                 <Button variant="ghost" size="icon" onClick={() => openEditModal(task)} className="btn-icon w-7 h-7"><Edit className="w-4 h-4" /></Button>
                 <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="btn-icon danger w-7 h-7"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </li>
          ))}
           {filteredTasks.length === 0 && (
            <p className="text-center text-[var(--text-muted-color-val)] py-10">No tasks found for this view.</p>
          )}
        </ul>
      </div>

      {/* Edit Task Modal */}
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

// Separate EditTaskModal component (can be in the same file or separate)
interface EditTaskModalProps {
    task: Task;
    categories: Category[];
    onClose: () => void;
    onSave: (formData: {text: string; dueDate?: string; category: Category}) => void;
}
function EditTaskModal({ task, categories, onClose, onSave }: EditTaskModalProps) {
    const [text, setText] = useState(task.text);
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [category, setCategory] = useState(task.category);

    const handleSubmit = () => {
        if(text.trim()) {
            onSave({ text: text.trim(), dueDate: dueDate || undefined, category });
        }
    };
    return (
        <div className="fixed inset-0 bg-[var(--background-color-val)]/80 backdrop-blur-sm flex items-center justify-center z-[110]" onClick={onClose}>
            <div className="bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-lg p-6 w-full max-w-lg shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color-val)]">
                    <h3 className="font-orbitron text-xl accent-text">Edit Task</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--text-muted-color-val)] hover:accent-text"><X className="w-5 h-5"/></Button>
                </div>
                <Input value={text} onChange={e => setText(e.target.value)} placeholder="Task description" className="input-field p-3"/>
                <div className="grid grid-cols-2 gap-3">
                    <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-field p-3"/>
                    <Select value={category} onValueChange={val => setCategory(val as Category)}>
                        <SelectTrigger className="input-field p-3 h-auto"><SelectValue/></SelectTrigger>
                        <SelectContent className="bg-[var(--widget-background-val)] border-[var(--border-color-val)]">
                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end pt-4 border-t border-[var(--border-color-val)] space-x-2">
                    <Button variant="outline" onClick={onClose} className="border-[var(--border-color-val)] text-[var(--text-muted-color-val)] hover:bg-[var(--input-bg-val)]">Cancel</Button>
                    <Button onClick={handleSubmit} className="btn-primary">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
