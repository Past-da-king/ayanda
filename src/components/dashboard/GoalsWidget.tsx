import React from 'react';
import { Goal } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Progress } from "@/components/ui/progress";

interface GoalsWidgetProps {
  goals: Goal[];
  onNavigate: () => void;
}

export function GoalsWidget({ goals, onNavigate }: GoalsWidgetProps) {
  const displayedGoal = goals.length > 0 ? goals[0] : null;

  return (
    <DashboardCardWrapper 
        title="GOALS" 
        onClick={onNavigate} 
        className="min-h-[280px] lg:min-h-[300px]" // Made taller
    >
      {displayedGoal ? (
        <div className="space-y-2 mt-1">
          <p className="text-sm font-medium text-foreground">{displayedGoal.name}</p>
          <Progress 
            value={(displayedGoal.currentValue / displayedGoal.targetValue) * 100} 
            className="h-2.5 bg-input" // Slightly thicker progress bar
            indicatorClassName="bg-primary"
          />
          <p className="text-xs text-muted-foreground">
            {displayedGoal.currentValue}{displayedGoal.unit} / {displayedGoal.targetValue}{displayedGoal.unit} ({Math.round((displayedGoal.currentValue / displayedGoal.targetValue) * 100)}%)
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mt-1">No goals set yet. Add one!</p>
      )}
    </DashboardCardWrapper>
  );
}
