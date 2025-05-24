// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
"use client";

import React, { useState } from 'react';
import { Goal, Category } from '@/types'; // Removed Task
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalsViewProps {
  goals: Goal[];
  categories: Category[];
  currentCategory: Category;
  onAddGoal: (name: string, targetValue: number, unit: string, category: Category) => void;
  onUpdateGoal: (goalId: string, name?: string, targetValue?: number, unit?: string) => void; // currentValue removed
  onDeleteGoal: (goalId: string) => void;
  onClose: () => void;
}

export function GoalsView({ goals, categories, currentCategory, onAddGoal, onUpdateGoal, onDeleteGoal, onClose }: GoalsViewProps) {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalUnit, setNewGoalUnit] = useState('km');
  const [newGoalCategory, setNewGoalCategory] = useState<Category>(currentCategory);

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editGoalName, setEditGoalName] = useState('');
  // editGoalCurrent is removed as currentValue is calculated
  const [editGoalTarget, setEditGoalTarget] = useState('');
  const [editGoalUnit, setEditGoalUnit] = useState('');

  const handleAddGoal = () => {
    if (newGoalName.trim() && parseFloat(newGoalTarget) > 0) {
      onAddGoal(newGoalName.trim(), parseFloat(newGoalTarget), newGoalUnit, newGoalCategory);
      setNewGoalName('');
      setNewGoalTarget('');
      setNewGoalUnit('km');
    }
  };

  const startEdit = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditGoalName(goal.name);
    // setEditGoalCurrent is removed
    setEditGoalTarget(goal.targetValue.toString());
    setEditGoalUnit(goal.unit);
  };

  const handleUpdateGoal = () => {
    if (editingGoalId) {
      onUpdateGoal( // currentValue is removed from signature
        editingGoalId,
        editGoalName.trim() || undefined,
        parseFloat(editGoalTarget) > 0 ? parseFloat(editGoalTarget) : undefined,
        editGoalUnit.trim() || undefined
      );
      setEditingGoalId(null);
    }
  };

  const filteredGoals = goals.filter(goal => currentCategory === "All Projects" || goal.category === currentCategory);

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-[var(--background-color-val)] p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Goals</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--text-muted-color-val)] hover:accent-text p-2 rounded-md hover:bg-[var(--input-bg-val)]">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        <div className="space-y-3 p-4 bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md">
          <Input
            placeholder="Goal name (e.g., Read 10 books)"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            className="input-field text-base p-3"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Target (e.g., 10)"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="input-field text-sm p-3"
            />
            <Input
              placeholder="Unit (e.g., books, km, %)"
              value={newGoalUnit}
              onChange={(e) => setNewGoalUnit(e.target.value)}
              className="input-field text-sm p-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-2">
                <label htmlFor="goal-category-select" className="sr-only">Category</label>
                <Select value={newGoalCategory} onValueChange={(val) => setNewGoalCategory(val as Category)}>
                    <SelectTrigger id="goal-category-select" className="input-field text-sm h-auto py-2.5">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--widget-background-val)] border-[var(--border-color-val)] text-[var(--text-color-val)]">
                        {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddGoal} className="btn-primary sm:col-span-3 text-sm h-auto py-2.5">
                <PlusCircle className="w-4 h-4 mr-2"/> Add New Goal
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: To add tasks that contribute to this goal, create or edit tasks in the &apos;Tasks&apos; view and link them to this goal.
          </p>
        </div>

        <ul className="space-y-3">
          {filteredGoals.map(goal => {
            // currentValue is now a calculated property from the fetched goal data
            const displayCurrentValue = goal.currentValue || 0;
            const percentage = goal.targetValue > 0 && displayCurrentValue !== undefined
                ? Math.min(100, Math.round((displayCurrentValue / goal.targetValue) * 100))
                : 0;
            return (
            <li key={goal.id} className="bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md p-3 hover:border-[var(--accent-color-val)]/30 transition-colors">
              {editingGoalId === goal.id ? (
                <div className="space-y-2">
                  <Input value={editGoalName} onChange={e => setEditGoalName(e.target.value)} placeholder="Goal Name" className="input-field p-2 text-sm"/>
                  <div className="grid grid-cols-2 gap-2"> {/* Adjusted from 3 to 2 cols */}
                      {/* Current value input removed */}
                      <Input type="number" value={editGoalTarget} onChange={e => setEditGoalTarget(e.target.value)} placeholder="Target" className="input-field p-2 text-xs"/>
                      <Input value={editGoalUnit} onChange={e => setEditGoalUnit(e.target.value)} placeholder="Unit" className="input-field p-2 text-xs"/>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={handleUpdateGoal} size="sm" className="btn-primary text-xs px-3 py-1.5">Save</Button>
                    <Button onClick={() => setEditingGoalId(null)} variant="outline" size="sm" className="border-[var(--border-color-val)] text-[var(--text-muted-color-val)] hover:bg-[var(--background-color-val)] text-xs px-3 py-1.5">Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-color-val)]">{goal.name}</h3>
                      <p className="text-xs text-[var(--text-muted-color-val)]">
                        {goal.category} • Target: {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(goal)} className="btn-icon w-7 h-7 text-[var(--text-muted-color-val)] hover:accent-text">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteGoal(goal.id)} className="btn-icon danger w-7 h-7 text-[var(--text-muted-color-val)] hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-[var(--text-muted-color-val)] mb-0.5">
                        <span>{displayCurrentValue} {goal.unit}</span>
                        <span className="accent-text font-medium">
                            {percentage}%
                        </span>
                    </div>
                    <Progress
                        value={percentage}
                        className="h-2 bg-[var(--background-color-val)]/70 [&>[data-slot=progress-indicator]]:bg-[var(--accent-color-val)]"
                    />
                  </div>
                </>
              )}
            </li>
          )})}
          {filteredGoals.length === 0 && (
            <p className="text-center text-[var(--text-muted-color-val)] py-10">No goals in this category yet. Set some aspirations!</p>
          )}
        </ul>
      </div>
    </div>
  );
}
