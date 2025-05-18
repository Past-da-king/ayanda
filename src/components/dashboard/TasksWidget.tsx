import React from 'react';
import { Task } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';

interface TasksWidgetProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onNavigate: () => void;
  className?: string; // Add className prop
}

export function TasksWidget({ tasks, onTaskToggle, onNavigate, className }: TasksWidgetProps) {
  const displayedTasks = tasks.filter(t => !t.completed).slice(0, 10); // Show a few more tasks

  return (
    <DashboardCardWrapper 
        title="TASKS" 
        onNavigate={onNavigate} 
        // The height is now more dynamic due to flex layout with AiAssistantWidget
        className={cn(
            "flex flex-col", // Ensure it's a flex container to allow content to grow
            className // Apply passed className (e.g., flex-grow)
        )} 
        id="tasks-widget-summary"
        contentClassName="space-y-2 flex-grow" // flex-grow for the content area within the card
    >
      {displayedTasks.length > 0 ? (
        <ul className="space-y-2">
          {displayedTasks.map((task) => (
            <li 
              key={task.id} 
              className={cn(
                "widget-item",
                "flex justify-between items-center"
              )}
            >
              <span 
                className="mr-2 overflow-hidden text-ellipsis whitespace-nowrap flex-grow" 
                title={task.text}
              >
                {task.text}
              </span>
              <Checkbox
                id={`task-widget-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => onTaskToggle(task.id)}
                className={cn(
                  "form-checkbox h-4 w-4 shrink-0",
                  "border-[var(--text-muted-color-val)] rounded",
                  "focus:ring-offset-0 focus:ring-1 focus:ring-[var(--accent-color-val)]",
                  "data-[state=checked]:bg-[var(--accent-color-val)] data-[state=checked]:border-[var(--accent-color-val)] data-[state=checked]:text-[var(--background-color-val)]"
                )}
                aria-label={`Mark task ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2">No active tasks.</p>
      )}
    </DashboardCardWrapper>
  );
}

