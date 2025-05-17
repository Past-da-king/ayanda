"use client";

import React, { useState } from 'react';
import { Goal, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, Target } from 'lucide-react';

interface GoalsViewProps {
  goals: Goal[];
  categories: Category[];
  currentCategory: Category;
  onAddGoal: (name: string, targetValue: number, unit: string, category: Category) => void;
  onUpdateGoal: (goalId: string, currentValue: number, name?: string, targetValue?: number, unit?: string) => void;
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
  const [editGoalCurrent, setEditGoalCurrent] = useState('');
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
    setEditGoalCurrent(goal.currentValue.toString());
    setEditGoalTarget(goal.targetValue.toString());
    setEditGoalUnit(goal.unit);
  };

  const handleUpdateGoal = () => {
    if (editingGoalId) {
      onUpdateGoal(
        editingGoalId,
        parseFloat(editGoalCurrent),
        editGoalName.trim() || undefined,
        parseFloat(editGoalTarget) > 0 ? parseFloat(editGoalTarget) : undefined,
        editGoalUnit.trim() || undefined
      );
      setEditingGoalId(null);
    }
  };

  const filteredGoals = goals.filter(goal => goal.category === currentCategory);

  return (
    <div className="p-6 pt-8 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[rgb(var(--foreground-rgb))]">Goals</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[rgb(var(--secondary-text-rgb))] hover:text-[rgb(var(--foreground-rgb))]">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Add Goal Form */}
      <div className="space-y-3 p-4 bg-[rgb(var(--card-background-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-lg">
        <Input
          placeholder="Goal name..."
          value={newGoalName}
          onChange={(e) => setNewGoalName(e.target.value)}
          className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]"
        />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Target value (e.g., 100 for %)"
            value={newGoalTarget}
            onChange={(e) => setNewGoalTarget(e.target.value)}
            className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]"
          />
          <Input
            placeholder="Unit (e.g., %, km, tasks)"
            value={newGoalUnit}
            onChange={(e) => setNewGoalUnit(e.target.value)}
            className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]"
          />
        </div>
        <Select value={newGoalCategory} onValueChange={(val) => setNewGoalCategory(val as Category)}>
          <SelectTrigger className="w-full bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-[rgb(var(--card-background-rgb))] border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]">
            {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgb(var(--input-background-rgb))] focus:!bg-[rgb(var(--input-background-rgb))]">{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={handleAddGoal} className="w-full bg-[rgb(var(--primary-accent))] text-[rgb(var(--primary-accent-foreground))] hover:bg-[rgba(var(--primary-accent),0.9)]">Add New Goal</Button>
      </div>

      {/* Goals List */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-1">
        {filteredGoals.map(goal => (
          <div key={goal.id} className="p-4 bg-[rgb(var(--card-background-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-md">
            {editingGoalId === goal.id ? (
              <div className="space-y-2">
                <Input value={editGoalName} onChange={e => setEditGoalName(e.target.value)} placeholder="Goal Name" className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))]"/>
                <div className="flex gap-2">
                    <Input type="number" value={editGoalCurrent} onChange={e => setEditGoalCurrent(e.target.value)} placeholder="Current Value" className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))]"/>
                    <Input type="number" value={editGoalTarget} onChange={e => setEditGoalTarget(e.target.value)} placeholder="Target Value" className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))]"/>
                    <Input value={editGoalUnit} onChange={e => setEditGoalUnit(e.target.value)} placeholder="Unit" className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))]"/>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateGoal} size="sm" className="bg-[rgb(var(--primary-accent))] text-[rgb(var(--primary-accent-foreground))]">Save</Button>
                  <Button onClick={() => setEditingGoalId(null)} variant="outline" size="sm" className="border-[rgb(var(--card-border-rgb))]">Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-[rgb(var(--foreground-rgb))]">{goal.name}</h3>
                    <p className="text-sm text-[rgb(var(--secondary-text-rgb))]">
                      Progress: {goal.currentValue}{goal.unit} / {goal.targetValue}{goal.unit}
                      {goal.category !== currentCategory && ` (${goal.category})`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(goal)} className="text-[rgb(var(--secondary-text-rgb))] hover:text-[rgb(var(--primary-accent))] w-7 h-7">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteGoal(goal.id)} className="text-[rgb(var(--secondary-text-rgb))] hover:text-red-500 w-7 h-7">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={(goal.currentValue / goal.targetValue) * 100} className="mt-2 h-3 bg-[rgb(var(--input-background-rgb))]" indicatorClassName="bg-[rgb(var(--primary-accent))]" />
                <p className="text-right text-xs text-[rgb(var(--primary-accent))] mt-1 font-semibold">
                  {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                </p>
              </>
            )}
          </div>
        ))}
        {filteredGoals.length === 0 && (
          <p className="text-center text-[rgb(var(--secondary-text-rgb))] py-4">No goals in this category. Set some aspirations!</p>
        )}
      </div>
    </div>
  );
}
