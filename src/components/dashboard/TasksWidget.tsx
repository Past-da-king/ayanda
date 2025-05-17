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
  const displayedTasks = tasks.filter(t => !t.completed).slice(0, 4); // Show up to 4 tasks

  return (
    <DashboardCardWrapper 
        title="TASKS" 
        onClick={onNavigate} 
        className="min-h-[280px] lg:min-h-[300px]" // Made taller
    >
      {displayedTasks.length > 0 ? (
        <ul className="space-y-3 mt-1">
          {displayedTasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 text-sm">
              <Checkbox
                id={`task-widget-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => onTaskToggle(task.id)}
                className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                onClick={(e) => e.stopPropagation()}
              />
              <label
                htmlFor={`task-widget-${task.id}`}
                className={cn(
                  "flex-1 truncate",
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                )}
              >
                {task.text}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground mt-1">No active tasks. Well done!</p>
      )}
    </DashboardCardWrapper>
  );
}
