// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
"use client";

import React, { useState, useEffect } from 'react';
import { Goal, Category } from '@/types';
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
  onUpdateGoal: (goalId: string, name?: string, targetValue?: number, unit?: string) => void;
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
  const [editGoalTarget, setEditGoalTarget] = useState('');
  const [editGoalUnit, setEditGoalUnit] = useState('');

  useEffect(() => {
    if (currentCategory === "All Projects" && categories.length > 0 && categories[0]) {
        setNewGoalCategory(categories[0]);
    } else if (categories.includes(currentCategory)) {
        setNewGoalCategory(currentCategory);
    } else if (categories.length > 0 && categories[0]) {
        setNewGoalCategory(categories[0]);
    }
  }, [currentCategory, categories]);

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
    setEditGoalTarget(goal.targetValue.toString());
    setEditGoalUnit(goal.unit);
  };

  const handleUpdateGoal = () => {
    if (editingGoalId) {
      onUpdateGoal(
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
        "fixed inset-0 z-[85] bg-background p-4 sm:p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1rem)] sm:pt-[calc(5rem+2.75rem+1.5rem)]"
    )}>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="font-orbitron text-2xl sm:text-3xl accent-text">Goals</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-1 sm:p-2 rounded-md hover:bg-input-bg">
          <X className="w-6 sm:w-7 h-6 sm:h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-widget-background border border-border-main rounded-md p-4 sm:p-6 custom-scrollbar-fullscreen space-y-4 sm:space-y-6">
        <div className="space-y-3 p-3 sm:p-4 bg-input-bg border border-border-main rounded-md">
          <Input
            placeholder="Goal name (e.g., Read 10 books)"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            className="input-field text-sm sm:text-base p-2 sm:p-3"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Input
              type="number"
              placeholder="Target (e.g., 10)"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="input-field text-xs sm:text-sm p-2 sm:p-3"
            />
            <Input
              placeholder="Unit (e.g., books, km, %)"
              value={newGoalUnit}
              onChange={(e) => setNewGoalUnit(e.target.value)}
              className="input-field text-xs sm:text-sm p-2 sm:p-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 items-end">
            <div className="sm:col-span-2">
                <label htmlFor="goal-category-select" className="sr-only">Category</label>
                <Select value={newGoalCategory || (categories.length > 0 ? categories[0] : '')} onValueChange={(val) => setNewGoalCategory(val as Category)}>
                    <SelectTrigger id="goal-category-select" className="input-field text-xs sm:text-sm h-auto py-2 sm:py-2.5">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-widget-background border-border-main text-text-main">
                        {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddGoal} className="btn-primary sm:col-span-3 text-xs sm:text-sm h-auto py-2 sm:py-2.5">
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"/> Add New Goal
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: To add tasks that contribute to this goal, create or edit tasks in the &apos;Tasks&apos; view and link them to this goal.
          </p>
        </div>

        <ul className="space-y-3">
          {filteredGoals.map(goal => {
            const displayCurrentValue = goal.currentValue || 0;
            const percentage = goal.targetValue > 0 && displayCurrentValue !== undefined
                ? Math.min(100, Math.round((displayCurrentValue / goal.targetValue) * 100))
                : 0;
            return (
            <li key={goal.id} className="bg-input-bg border border-border-main rounded-md p-2.5 sm:p-3 hover:border-accent/30 transition-colors">
              {editingGoalId === goal.id ? (
                <div className="space-y-2">
                  <Input value={editGoalName} onChange={e => setEditGoalName(e.target.value)} placeholder="Goal Name" className="input-field p-2 text-xs sm:text-sm"/>
                  <div className="grid grid-cols-2 gap-2">
                      <Input type="number" value={editGoalTarget} onChange={e => setEditGoalTarget(e.target.value)} placeholder="Target" className="input-field p-2 text-xs"/>
                      <Input value={editGoalUnit} onChange={e => setEditGoalUnit(e.target.value)} placeholder="Unit" className="input-field p-2 text-xs"/>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={handleUpdateGoal} size="sm" className="btn-primary text-xs px-3 py-1.5">Save</Button>
                    <Button onClick={() => setEditingGoalId(null)} variant="outline" size="sm" className="border-border-main text-muted-foreground hover:bg-background text-xs px-3 py-1.5">Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-text-main">{goal.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {goal.category} • Target: {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-0 sm:gap-0.5 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(goal)} className="btn-icon w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground hover:accent-text">
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteGoal(goal.id)} className="btn-icon danger w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-1.5 sm:mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                        <span>{displayCurrentValue} {goal.unit}</span>
                        <span className="accent-text font-medium">
                            {percentage}%
                        </span>
                    </div>
                    <Progress
                        value={percentage}
                        className="h-1.5 sm:h-2 bg-background/70 [&>[data-slot=progress-indicator]]:bg-accent-color-val"
                    />
                  </div>
                </>
              )}
            </li>
          )})}
          {filteredGoals.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm sm:text-base">No goals in this category yet. Set some aspirations!</p>
          )}
        </ul>
      </div>
    </div>
  );
}
