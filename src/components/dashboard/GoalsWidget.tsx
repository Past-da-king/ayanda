import React from 'react';
import { Goal } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
// import { cn } from '@/lib/utils';

interface GoalsWidgetProps {
  goals: Goal[]; // Pre-filtered goals
  onNavigate: () => void;
}

export function GoalsWidget({ goals, onNavigate }: GoalsWidgetProps) {
  const displayedGoals = goals.slice(0, 3); // Show max 3 in summary

  return (
    <DashboardCardWrapper
        title="GOALS"
        onNavigate={onNavigate}
        id="goals-widget-summary"
        contentClassName="space-y-3" // space-y from target
    >
      {displayedGoals.length > 0 ? (
        <ul className="space-y-3"> {/* Added ul for semantics */}
          {displayedGoals.map((goal) => {
            const currentValue = goal.currentValue ?? 0; // Provide default if undefined
            const percentage = goal.targetValue > 0 ? Math.min(100, Math.round((currentValue / goal.targetValue) * 100)) : 0;
            return (
              <li key={goal.id} className="widget-item"> {/* widget-item class */}
                <p className="text-sm truncate" title={goal.name}>
                  {goal.name} - <span className="font-semibold accent-text">{percentage}%</span>
                </p>
                <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5">
                  <div
                    className="bg-[var(--accent-color-val)] h-1.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2">No goals set.</p>
      )}
    </DashboardCardWrapper>
  );
}
