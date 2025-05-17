"use client";

import React, { useState } from 'react';
import { Note, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, StickyNote } from 'lucide-react';

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
  
  const filteredNotes = notes.filter(note => note.category === currentCategory);

  return (
    <div className="p-6 pt-8 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[rgb(var(--foreground-rgb))]">Notes</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[rgb(var(--secondary-text-rgb))] hover:text-[rgb(var(--foreground-rgb))]">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Add Note Form */}
      <div className="space-y-3 p-4 bg-[rgb(var(--card-background-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-lg">
        <Input
          placeholder="Note title (optional)..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]"
        />
        <Textarea
          placeholder="Type your note here..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="min-h-[100px] bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]"
        />
        <div className="flex gap-2">
            <Select value={newNoteCategory} onValueChange={(val) => setNewNoteCategory(val as Category)}>
                <SelectTrigger className="w-full bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))] text-[rgb(var(--foreground-rgb))]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-[rgb(var(--card-background-rgb))] border-[rgb(var(--card-border-rgb))] text-[rgb(var(--foreground-rgb))]">
                    {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgb(var(--input-background-rgb))] focus:!bg-[rgb(var(--input-background-rgb))]">{cat}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button onClick={handleAddNote} className="bg-[rgb(var(--primary-accent))] text-[rgb(var(--primary-accent-foreground))] hover:bg-[rgba(var(--primary-accent),0.9)] whitespace-nowrap">Add New Note</Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-1">
        {filteredNotes.map(note => (
          <div key={note.id} className="p-3 bg-[rgb(var(--card-background-rgb))] border border-[rgb(var(--card-border-rgb))] rounded-md">
            {editingNoteId === note.id ? (
               <div className="space-y-2">
                <Input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} placeholder="Title (optional)" className="bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))]"/>
                <Textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} placeholder="Content" className="min-h-[80px] bg-[rgb(var(--input-background-rgb))] border-[rgb(var(--input-border-rgb))]"/>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateNote} size="sm" className="bg-[rgb(var(--primary-accent))] text-[rgb(var(--primary-accent-foreground))]">Save</Button>
                  <Button onClick={() => setEditingNoteId(null)} variant="outline" size="sm" className="border-[rgb(var(--card-border-rgb))]">Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-1">
                    <div>
                        {note.title && <h4 className="text-md font-semibold text-[rgb(var(--foreground-rgb))]">{note.title}</h4>}
                        <p className="text-xs text-[rgb(var(--secondary-text-rgb))]">
                            Last edited: {new Date(note.lastEdited).toLocaleDateString()}
                            {note.category !== currentCategory && ` (${note.category})`}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(note)} className="text-[rgb(var(--secondary-text-rgb))] hover:text-[rgb(var(--primary-accent))] w-7 h-7">
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteNote(note.id)} className="text-[rgb(var(--secondary-text-rgb))] hover:text-red-500 w-7 h-7">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-[rgb(var(--foreground-rgb))] whitespace-pre-wrap">{note.content}</p>
              </>
            )}
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <p className="text-center text-[rgb(var(--secondary-text-rgb))] py-4">No notes in this category. Write something down!</p>
        )}
      </div>
    </div>
  );
}
