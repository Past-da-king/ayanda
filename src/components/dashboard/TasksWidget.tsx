import React, { useState } from 'react';
import { Task } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

interface TasksWidgetProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, subTaskId?: string) => void; // Modified to handle subtask toggle
  onNavigate: () => void;
  className?: string;
}

export function TasksWidget({ tasks, onTaskToggle, onNavigate, className }: TasksWidgetProps) {
  const displayedTasks = tasks.filter(t => !t.completed).slice(0, 10); 
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <DashboardCardWrapper 
        title="TASKS" 
        onNavigate={onNavigate} 
        className={cn(
            "flex flex-col", 
            className 
        )} 
        id="tasks-widget-summary"
        contentClassName="space-y-2 flex-grow" 
    >
      {displayedTasks.length > 0 ? (
        <ul className="space-y-1.5">
          {displayedTasks.map((task) => (
            <li 
              key={task.id} 
              className={cn(
                "widget-item !p-2.5", // Adjusted padding
                "flex flex-col" // Allow subtasks to stack
              )}
            >
              <div className="flex justify-between items-center w-full">
                <Checkbox
                  id={`task-widget-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => onTaskToggle(task.id)}
                  className={cn(
                    "form-checkbox h-4 w-4 shrink-0 mr-2.5",
                    "border-[var(--text-muted-color-val)] rounded",
                    "focus:ring-offset-0 focus:ring-1 focus:ring-[var(--accent-color-val)]",
                    "data-[state=checked]:bg-[var(--accent-color-val)] data-[state=checked]:border-[var(--accent-color-val)] data-[state=checked]:text-[var(--background-color-val)]"
                  )}
                  aria-label={`Mark task ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
                />
                <span 
                  className="overflow-hidden text-ellipsis whitespace-nowrap flex-grow cursor-pointer text-sm" 
                  title={task.text}
                  onClick={onNavigate} // Navigate when text is clicked too
                >
                  {task.text}
                </span>
                {task.subTasks && task.subTasks.length > 0 && (
                   <Button variant="ghost" size="icon" onClick={() => toggleExpand(task.id)} className="ml-1 w-6 h-6 p-0 shrink-0 text-muted-foreground hover:text-accent-foreground">
                     {expandedTasks[task.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                   </Button>
                )}
              </div>
              {expandedTasks[task.id] && task.subTasks && task.subTasks.length > 0 && (
                <ul className="mt-1.5 pl-6 space-y-1">
                  {task.subTasks.map((sub) => (
                    <li key={sub.id} className="flex items-center text-xs">
                       <Checkbox
                          id={`subtask-widget-${task.id}-${sub.id}`}
                          checked={sub.completed}
                          onCheckedChange={() => onTaskToggle(task.id, sub.id)} // Pass sub.id
                          className={cn(
                            "form-checkbox h-3.5 w-3.5 shrink-0 mr-2",
                            "border-[var(--text-muted-color-val)]/70 rounded-[3px]",
                            "focus:ring-offset-0 focus:ring-1 focus:ring-[var(--accent-color-val)]",
                            "data-[state=checked]:bg-[var(--accent-color-val)]/80 data-[state=checked]:border-[var(--accent-color-val)]/80 data-[state=checked]:text-[var(--background-color-val)]"
                          )}
                          aria-label={`Mark subtask ${sub.text} as ${sub.completed ? 'incomplete' : 'complete'}`}
                        />
                      <span className={cn("text-muted-foreground", sub.completed && "line-through opacity-70")}>{sub.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2 text-center">No active tasks.</p>
      )}
    </DashboardCardWrapper>
  );
}



