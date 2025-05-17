"use client";

import React, { useState } from 'react';
import { Note, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotesViewProps {
  notes: Note[];
  categories: Category[];
  currentCategory: Category;
  onAddNote: (title: string | undefined, content: string, category: Category) => void;
  onUpdateNote: (noteId: string, title: string | undefined, content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onClose: () => void;
}

export function NotesView({ notes, categories, currentCategory, onAddNote, onUpdateNote, onDeleteNote, onClose }: NotesViewProps) {
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<Category>(currentCategory);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteTitle.trim() || undefined, newNoteContent.trim(), newNoteCategory);
      setNewNoteTitle('');
      setNewNoteContent('');
    }
  };

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditNoteTitle(note.title || '');
    setEditNoteContent(note.content);
  };

  const handleUpdateNote = () => {
    if (editingNoteId && editNoteContent.trim()) {
      onUpdateNote(editingNoteId, editNoteTitle.trim() || undefined, editNoteContent.trim());
      setEditingNoteId(null);
    }
  };
  
  const filteredNotes = notes
    .filter(note => currentCategory === "All Projects" || note.category === currentCategory)
    .sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-[var(--background-color-val)] p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" // Consistent top padding
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Notes</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--text-muted-color-val)] hover:accent-text p-2 rounded-md hover:bg-[var(--input-bg-val)]">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Note Form */}
        <div className="space-y-3 p-4 bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md">
          <Input
            placeholder="Note title (optional)"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="input-field text-base p-3"
          />
          <Textarea
            placeholder="Type your note content here..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="input-field min-h-[100px] text-base p-3"
          />
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-2">
                <label htmlFor="note-category-select" className="sr-only">Category</label>
                <Select value={newNoteCategory} onValueChange={(val) => setNewNoteCategory(val as Category)}>
                    <SelectTrigger id="note-category-select" className="input-field text-sm h-auto py-2.5">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--widget-background-val)] border-[var(--border-color-val)] text-[var(--text-color-val)]">
                        {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddNote} className="btn-primary sm:col-span-3 text-sm h-auto py-2.5">
                 <PlusCircle className="w-4 h-4 mr-2"/> Add New Note
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <ul className="space-y-3">
          {filteredNotes.map(note => (
            <li key={note.id} className="bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md p-3 hover:border-[var(--accent-color-val)]/30 transition-colors">
              {editingNoteId === note.id ? (
                 <div className="space-y-2">
                  <Input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} placeholder="Title (optional)" className="input-field p-2 text-sm"/>
                  <Textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} placeholder="Content" className="input-field min-h-[80px] p-2 text-sm"/>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={handleUpdateNote} size="sm" className="btn-primary text-xs px-3 py-1.5">Save Changes</Button>
                    <Button onClick={() => setEditingNoteId(null)} variant="outline" size="sm" className="border-[var(--border-color-val)] text-[var(--text-muted-color-val)] hover:bg-[var(--background-color-val)] text-xs px-3 py-1.5">Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-1">
                      <div>
                          {note.title && <h4 className="text-base font-semibold text-[var(--text-color-val)]">{note.title}</h4>}
                          <p className="text-xs text-[var(--text-muted-color-val)]">
                              {note.category} • Edited: {new Date(note.lastEdited).toLocaleDateString()}
                          </p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(note)} className="btn-icon w-7 h-7 text-[var(--text-muted-color-val)] hover:accent-text">
                              <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDeleteNote(note.id)} className="btn-icon danger w-7 h-7 text-[var(--text-muted-color-val)] hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                  </div>
                  <p className="text-sm text-[var(--text-color-val)] whitespace-pre-wrap leading-relaxed">{note.content}</p>
                </>
              )}
            </li>
          ))}
          {filteredNotes.length === 0 && (
            <p className="text-center text-[var(--text-muted-color-val)] py-10">No notes in this category. Jot something down!</p>
          )}
        </ul>
      </div>
    </div>
  );
}
