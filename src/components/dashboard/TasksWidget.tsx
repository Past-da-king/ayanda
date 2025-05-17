import React from 'react';
import { Task } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';

interface TasksWidgetProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onNavigate: () => void;
}

export function TasksWidget({ tasks, onTaskToggle, onNavigate }: TasksWidgetProps) {
  const displayedTasks = tasks.filter(t => !t.completed).slice(0, 7); // Show more tasks if it's taller

  return (
    <DashboardCardWrapper 
        title="TASKS" 
        onNavigate={onNavigate} 
        // Approximate height for 2 rows: (Widget height (300px) * 2) + gap (20px) = ~620px
        // Or use a relative unit that works with the grid's row definition
        className="min-h-[calc(var(--widget-base-height,300px)*2+var(--grid-gap,1.25rem))] flex flex-col" // Target height
        id="tasks-widget-summary"
        contentClassName="space-y-2 flex-grow" // flex-grow to use available space
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
