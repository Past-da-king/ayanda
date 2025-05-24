"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Note, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, PlusCircle, Edit2, Trash2 } from 'lucide-react'; 
// import { cn } from '@/lib/utils'; // Removed unused import
import { format } from 'date-fns';

interface NotesViewProps {
  notes: Note[]; 
  noteToEdit?: Note; 
  categories: Category[]; // These are project names
  currentCategory: Category; // Current active project name
  onAddNote: (title: string | undefined, content: string, category: Category) => void;
  onUpdateNote: (noteId: string, title: string | undefined, content: string, category: Category) => void; 
  onDeleteNote: (noteId: string) => void; 
  onClose: () => void; 
  // navigateToNotesView prop removed
}

export function NotesView({ 
    notes,
    noteToEdit, 
    categories, 
    currentCategory, 
    onAddNote, 
    onUpdateNote, 
    onDeleteNote,
    onClose,
    // navigateToNotesView prop removed from destructuring
}: NotesViewProps) {
  
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorCategory, setEditorCategory] = useState<Category>(currentCategory);
  
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'editor'>(noteToEdit ? 'editor' : 'list');
  const [currentEditingNoteId, setCurrentEditingNoteId] = useState<string | null>(null);

  const actualCategories = categories.filter(c => c && c !== "All Projects");

  const resetEditorFields = useCallback(() => {
    setEditorTitle('');
    setEditorContent('');
    const defaultNewNoteCategory = actualCategories.includes(currentCategory) 
      ? currentCategory 
      : (actualCategories[0] || "Personal Life");
    setEditorCategory(defaultNewNoteCategory);
    setCurrentEditingNoteId(null);
  }, [actualCategories, currentCategory]);

  useEffect(() => {
    if (noteToEdit) {
      setEditorTitle(noteToEdit.title || '');
      setEditorContent(noteToEdit.content);
      const validCategory = actualCategories.includes(noteToEdit.category as Category) 
        ? noteToEdit.category as Category
        : (actualCategories[0] || "Personal Life"); 
      setEditorCategory(validCategory);
      setCurrentEditingNoteId(noteToEdit.id);
      setInternalViewMode('editor');
    } else {
      if (internalViewMode === 'editor' && !currentEditingNoteId) {
        resetEditorFields();
      } else {
         setInternalViewMode('list');
      }
    }
  }, [noteToEdit, actualCategories, internalViewMode, currentEditingNoteId, resetEditorFields]);

  const handleSaveNote = () => {
    if (editorContent.trim() || editorTitle.trim()) { 
      const categoryToSave = actualCategories.includes(editorCategory) ? editorCategory : (actualCategories[0] || "Personal Life");
      if (currentEditingNoteId) { 
        onUpdateNote(currentEditingNoteId, editorTitle.trim() || undefined, editorContent.trim(), categoryToSave);
      } else { 
        onAddNote(editorTitle.trim() || undefined, editorContent.trim(), categoryToSave);
      }
      resetEditorFields();
      setInternalViewMode('list'); 
    } else {
      console.warn("Cannot save empty note.");
    }
  };

  const openEditorForNewNote = () => {
    resetEditorFields();
    setInternalViewMode('editor');
  };

  const openEditorForExistingNote = (note: Note) => {
    setEditorTitle(note.title || '');
    setEditorContent(note.content);
    setEditorCategory(note.category as Category);
    setCurrentEditingNoteId(note.id);
    setInternalViewMode('editor');
  };

  const handleDeleteAndRefreshList = (noteId: string) => {
    onDeleteNote(noteId);
  };

  const notesForCurrentProject = notes
    .filter((note: Note) => currentCategory === "All Projects" || note.category === currentCategory)
    .sort((a: Note, b: Note) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());


  if (internalViewMode === 'editor') {
    return (
      <div className="flex flex-col h-full w-full bg-background text-foreground p-0">
        <div className="flex items-center justify-between py-3 px-4 md:px-6 border-b border-border-main shrink-0 sticky top-0 bg-background z-10">
          <h2 className="font-orbitron text-2xl accent-text">
            {currentEditingNoteId ? 'Edit Note' : 'Create Note'}
          </h2>
          <div className="flex items-center gap-2">
            <Button onClick={handleSaveNote} className="btn-primary" size="sm">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <Button variant="outline" size="sm" onClick={() => { resetEditorFields(); setInternalViewMode('list');}} className="border-border-main">
              <X className="w-4 h-4 mr-2"/> Cancel
            </Button>
          </div>
        </div>
        <div className="flex-grow p-4 md:p-6 space-y-4 overflow-y-auto custom-scrollbar-fullscreen flex flex-col">
          <Input
            placeholder="Note title (optional)"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            className="input-field text-lg p-3 shrink-0" 
          />
          <Select value={editorCategory} onValueChange={(val) => setEditorCategory(val as Category)}>
            <SelectTrigger className="input-field text-sm h-auto py-2 w-auto min-w-[150px] max-w-[200px] shrink-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-widget-background border-border-main text-text-main">
              {actualCategories.map((cat: Category) => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Type your note content here..."
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            className="input-field text-base p-3 rounded-md flex-grow w-full custom-scrollbar-fullscreen resize-none" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground p-0">
        <div className="flex items-center justify-between py-3 px-4 md:px-6 border-b border-border-main shrink-0 sticky top-0 bg-background z-10">
            <h2 className="font-orbitron text-2xl accent-text">Notes ({currentCategory})</h2>
            <div className="flex items-center gap-2">
                <Button onClick={openEditorForNewNote} className="btn-primary" size="sm">
                    <PlusCircle className="w-4 h-4 mr-2" /> Create New Note
                </Button>
                 <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text">
                    <X className="w-6 h-6" />
                </Button>
            </div>
        </div>
        <div className="flex-grow p-4 md:p-6 overflow-y-auto custom-scrollbar-fullscreen">
            {notesForCurrentProject.length > 0 ? (
                <ul className="space-y-3">
                {notesForCurrentProject.map((note: Note) => (
                    <li key={note.id} className="bg-input-bg border border-border-main rounded-md p-3 hover:border-accent/30 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                {note.title && <h4 className="text-base font-semibold text-text-main">{note.title}</h4>}
                                <p className="text-xs text-muted-foreground">
                                    {note.category} • Edited: {format(new Date(note.lastEdited), 'MMM d, yyyy p')}
                                </p>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                                <Button variant="ghost" size="icon" onClick={() => openEditorForExistingNote(note)} className="btn-icon w-7 h-7 text-muted-foreground hover:accent-text">
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteAndRefreshList(note.id)} className="btn-icon danger w-7 h-7 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-text-main/90 line-clamp-3">{note.content}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-center text-muted-foreground py-10">No notes in &quot;{currentCategory}&quot;. Jot something down!</p>
            )}
        </div>
    </div>
  );
}
