"use client";

import React, { useState } from 'react';
import { Task, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, CalendarDays, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TasksViewProps {
  tasks: Task[];
  categories: Category[];
  currentCategory: Category;
  onAddTask: (taskText: string, dueDate: string | undefined, category: Category) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, newText: string, newDueDate?: string) => void;
  onClose: () => void;
}

export function TasksView({ tasks, categories, currentCategory, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, onClose }: TasksViewProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>(currentCategory);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), newTaskDueDate || undefined, newTaskCategory);
      setNewTaskText('');
      setNewTaskDueDate('');
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
    setEditDueDate(task.dueDate || '');
  };

  const handleUpdateTask = () => {
    if (editingTaskId && editText.trim()) {
      onUpdateTask(editingTaskId, editText.trim(), editDueDate || undefined);
      setEditingTaskId(null);
      setEditText('');
      setEditDueDate('');
    }
  };

  const filteredTasks = tasks.filter(task => task.category === currentCategory && (showCompleted || !task.completed));

  return (
    <div className="p-6 pt-8 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[rgb(var(--foreground-rgb))]">Tasks</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[rgb(var(--secondary-text-rgb))] hover:text-[rgb(var(--foreground-rgb))]">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Add Task Form */}
      <div className="space-y-2 p-4 bg-[rgb(var(--card-background-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-lg">
        <Input
          type="text"
          placeholder="Add new task and press Enter..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]"
        />
        <div className="flex gap-2">
          <Input
            type="date" // HTML5 date picker
            placeholder="mm/dd/yyyy"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))] w-1/2"
          />
          <Select value={newTaskCategory} onValueChange={(val) => setNewTaskCategory(val as Category)}>
            <SelectTrigger className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))] w-1/2">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[rgb(var(--card-background-rgb))] border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]">
              {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgb(var(--input-background-rgb))] focus:!bg-[rgb(var(--input-background-rgb))]">{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
         <Button onClick={handleAddTask} className="w-full bg-[rgb(var(--primary-accent))] text-[rgb(var(--primary-accent-foreground))] hover:bg-[rgba(var(--primary-accent),0.9)] mt-2">Add Task</Button>
      </div>

      <div className="flex justify-end items-center">
         <label htmlFor="showCompletedTasks" className="text-sm text-[rgb(var(--secondary-text-rgb))] mr-2">Show Completed</label>
         <Checkbox
            id="showCompletedTasks"
            checked={showCompleted}
            onCheckedChange={(checked) => setShowCompleted(Boolean(checked))}
            className="border-[rgb(var(--input-border-rgb))] data-[state=checked]:bg-[rgb(var(--primary-accent))] data-[state=checked]:text-[rgb(var(--primary-accent-foreground))]"
          />
      </div>

      {/* Tasks List */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-1">
        {filteredTasks.map(task => (
          <div key={task.id} className="p-3 bg-[rgb(var(--card-background-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-md flex items-start gap-3">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggleTask(task.id)}
              className="mt-1 border-[rgb(var(--input-border-rgb))] data-[state=checked]:bg-[rgb(var(--primary-accent))] data-[state=checked]:text-[rgb(var(--primary-accent-foreground))]"
            />
            {editingTaskId === task.id ? (
              <div className="flex-grow space-y-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]"
                />
                <Input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]"
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateTask} size="sm" className="bg-[rgb(var(--primary-accent))] text-[rgb(var(--primary-accent-foreground))]">Save</Button>
                  <Button onClick={() => setEditingTaskId(null)} variant="outline" size="sm" className="border-[rgb(var(--card-border-rgb))]">Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex-grow">
                <label
                  htmlFor={`task-${task.id}`}
                  className={cn(
                    "block text-sm text-[rgb(var(--foreground-rgb))]",
                    task.completed && "line-through text-[rgb(var(--secondary-text-rgb))]"
                  )}
                >
                  {task.text}
                </label>
                {task.dueDate && (
                  <p className="text-xs text-[rgb(var(--secondary-text-rgb))] flex items-center gap-1 mt-1">
                    <CalendarDays className="w-3 h-3" />
                    Due: {new Date(task.dueDate).toLocaleDateString()} {task.category !== currentCategory && `(${task.category})`}
                  </p>
                )}
                 {!task.dueDate && task.category !== currentCategory && (
                    <p className="text-xs text-[rgb(var(--secondary-text-rgb))] mt-1">Category: {task.category}</p>
                )}
              </div>
            )}
            {!editingTaskId && (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(task)} className="text-[rgb(var(--secondary-text-rgb))] hover:text-[rgb(var(--primary-accent))] w-7 h-7">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="text-[rgb(var(--secondary-text-rgb))] hover:text-red-500 w-7 h-7">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
         {filteredTasks.length === 0 && (
          <p className="text-center text-[rgb(var(--secondary-text-rgb))] py-4">
            {showCompleted ? "No tasks in this category." : "No active tasks in this category. Great job!"}
          </p>
        )}
      </div>
    </div>
  );
}
