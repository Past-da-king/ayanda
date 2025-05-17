"use client";

import React, { useState } from 'react';
import { Note, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2 } from 'lucide-react';

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
    <div className="p-6 pt-8 space-y-6 h-full flex flex-col bg-background text-foreground">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-orbitron font-bold text-primary">Notes</h2> {/* Orbitron Font */}
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
        <Input
          placeholder="Note title (optional)..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
        />
        <Textarea
          placeholder="Type your note here..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="min-h-[100px] bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
        />
        <div className="flex gap-2">
            <Select value={newNoteCategory} onValueChange={(val) => setNewNoteCategory(val as Category)}>
                <SelectTrigger className="w-full bg-input border-border text-foreground focus:border-primary">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                    {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-accent focus:!bg-accent">{cat}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button onClick={handleAddNote} className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">Add New Note</Button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pr-1">
        {filteredNotes.map(note => (
          <div key={note.id} className="p-3 bg-card border border-border rounded-md">
            {editingNoteId === note.id ? (
               <div className="space-y-2">
                <Input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} placeholder="Title (optional)" className="bg-input border-border text-foreground focus:border-primary"/>
                <Textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} placeholder="Content" className="min-h-[80px] bg-input border-border text-foreground focus:border-primary"/>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateNote} size="sm" className="bg-primary text-primary-foreground">Save</Button>
                  <Button onClick={() => setEditingNoteId(null)} variant="outline" size="sm" className="border-border text-foreground hover:bg-accent">Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-1">
                    <div>
                        {note.title && <h4 className="text-md font-semibold text-foreground">{note.title}</h4>}
                        <p className="text-xs text-muted-foreground">
                            Last edited: {new Date(note.lastEdited).toLocaleDateString()}
                            {note.category !== currentCategory && ` (${note.category})`}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(note)} className="text-muted-foreground hover:text-primary w-7 h-7">
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteNote(note.id)} className="text-muted-foreground hover:text-destructive w-7 h-7">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
              </>
            )}
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No notes in this category. Write something down!</p>
        )}
      </div>
    </div>
  );
}
