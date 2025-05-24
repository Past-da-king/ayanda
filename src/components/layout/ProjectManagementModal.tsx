"use client";

import React, { useState, useEffect } from 'react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Edit2, Trash2, PlusCircle, Save } from 'lucide-react';
// import { cn } from '@/lib/utils'; // cn was unused

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onAddProject: (name: string) => Promise<void>;
  onUpdateProject: (id: string, newName: string) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

export function ProjectManagementModal({
  isOpen,
  onClose,
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}: ProjectManagementModalProps) {
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewProjectName('');
      setEditingProjectId(null);
      setEditingProjectName('');
      setError(null);
    }
  }, [isOpen]);

  const handleAdd = async () => {
    if (!newProjectName.trim()) {
      setError("Project name cannot be empty.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onAddProject(newProjectName.trim());
      setNewProjectName('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add project.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setEditingProjectName(project.name);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setEditingProjectName('');
  };

  const handleSaveEdit = async () => {
    if (!editingProjectId || !editingProjectName.trim()) {
      setError("Project name cannot be empty for editing.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onUpdateProject(editingProjectId, editingProjectName.trim());
      setEditingProjectId(null);
      setEditingProjectName('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update project.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await onDeleteProject(projectId);
      if (editingProjectId === projectId) {
        handleCancelEdit();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete project.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const canDelete = (projectName: string): boolean => {
    const protectedNames = ["Personal Life", "Work", "Studies"];
    if (protectedNames.includes(projectName) && projects.length <= protectedNames.length) {
        const nonDeletableDefaultsLeft = projects.filter(p => protectedNames.includes(p.name)).length;
        if (nonDeletableDefaultsLeft === 1 && projects.length === 1) return false; 
        if (projects.length <=1 ) return false; 
    }
    return true;
  };


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[120]"
      onClick={onClose}
    >
      <div
        className="bg-widget-background border border-border-main rounded-lg p-6 w-full max-w-md shadow-2xl space-y-6 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b border-border-main">
          <h3 className="font-orbitron text-xl accent-text">Manage Projects</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Add New Project</h4>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="input-field flex-grow"
              disabled={isLoading}
            />
            <Button onClick={handleAdd} className="btn-primary shrink-0" disabled={isLoading}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar-fullscreen">
          <h4 className="text-sm font-medium text-foreground mb-1 sticky top-0 bg-widget-background py-1">Existing Projects</h4>
          {projects.filter(p => p.name !== "All Projects").length > 0 ? (
            projects.filter(p => p.name !== "All Projects").map((project) => (
              <div key={project.id} className="bg-input-bg border border-border-main/50 rounded-md p-2.5">
                {editingProjectId === project.id ? (
                  <div className="space-y-2">
                    <Input
                      type="text"
                      value={editingProjectName}
                      onChange={(e) => setEditingProjectName(e.target.value)}
                      className="input-field text-sm"
                      disabled={isLoading}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button onClick={handleCancelEdit} variant="ghost" size="sm" className="text-xs" disabled={isLoading}>Cancel</Button>
                      <Button onClick={handleSaveEdit} size="sm" className="btn-primary text-xs" disabled={isLoading}>
                        <Save className="w-3 h-3 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{project.name}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleStartEdit(project)} className="btn-icon w-7 h-7" disabled={isLoading}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project.id)}
                        className="btn-icon danger w-7 h-7"
                        disabled={isLoading || !canDelete(project.name)}
                        title={!canDelete(project.name) ? "This project cannot be deleted." : "Delete project"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-2">No custom projects yet.</p>
          )}
        </div>
         <p className="text-xs text-muted-foreground pt-2 border-t border-border-main">
            Note: Deleting a project will re-assign its items to &quot;Personal Life&quot; (if available).
         </p>
      </div>
    </div>
  );
}
