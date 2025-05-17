"use client";

import React, { useState } from 'react';
import { Goal, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2 } from 'lucide-react';

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
    <div className="p-6 pt-8 space-y-6 h-full flex flex-col bg-background text-foreground">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-orbitron font-bold text-primary">Goals</h2> {/* Orbitron Font */}
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
        <Input
          placeholder="Goal name..."
          value={newGoalName}
          onChange={(e) => setNewGoalName(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
        />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Target value (e.g., 100 for %)"
            value={newGoalTarget}
            onChange={(e) => setNewGoalTarget(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
          <Input
            placeholder="Unit (e.g., %, km, tasks)"
            value={newGoalUnit}
            onChange={(e) => setNewGoalUnit(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <Select value={newGoalCategory} onValueChange={(val) => setNewGoalCategory(val as Category)}>
          <SelectTrigger className="w-full bg-input border-border text-foreground focus:border-primary">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground">
            {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-accent focus:!bg-accent">{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={handleAddGoal} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Add New Goal</Button>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 pr-1">
        {filteredGoals.map(goal => (
          <div key={goal.id} className="p-4 bg-card border border-border rounded-md">
            {editingGoalId === goal.id ? (
              <div className="space-y-2">
                <Input value={editGoalName} onChange={e => setEditGoalName(e.target.value)} placeholder="Goal Name" className="bg-input border-border text-foreground focus:border-primary"/>
                <div className="flex gap-2">
                    <Input type="number" value={editGoalCurrent} onChange={e => setEditGoalCurrent(e.target.value)} placeholder="Current Value" className="bg-input border-border text-foreground focus:border-primary"/>
                    <Input type="number" value={editGoalTarget} onChange={e => setEditGoalTarget(e.target.value)} placeholder="Target Value" className="bg-input border-border text-foreground focus:border-primary"/>
                    <Input value={editGoalUnit} onChange={e => setEditGoalUnit(e.target.value)} placeholder="Unit" className="bg-input border-border text-foreground focus:border-primary"/>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateGoal} size="sm" className="bg-primary text-primary-foreground">Save</Button>
                  <Button onClick={() => setEditingGoalId(null)} variant="outline" size="sm" className="border-border text-foreground hover:bg-accent">Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Progress: {goal.currentValue}{goal.unit} / {goal.targetValue}{goal.unit}
                      {goal.category !== currentCategory && ` (${goal.category})`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(goal)} className="text-muted-foreground hover:text-primary w-7 h-7">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteGoal(goal.id)} className="text-muted-foreground hover:text-destructive w-7 h-7">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={(goal.currentValue / goal.targetValue) * 100} className="mt-2 h-3 bg-input" indicatorClassName="bg-primary" />
                <p className="text-right text-xs text-primary mt-1 font-semibold">
                  {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                </p>
              </>
            )}
          </div>
        ))}
        {filteredGoals.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No goals in this category. Set some aspirations!</p>
        )}
      </div>
    </div>
  );
}
