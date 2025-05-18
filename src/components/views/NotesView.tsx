"use client";

import React, { useState, useEffect } from 'react';
import { Note, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, PlusCircle, Eye, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // For markdown cheatsheet

const MarkdownCheatsheet: React.FC = () => (
  <div className="p-3 text-xs space-y-1 text-muted-foreground bg-popover border border-border rounded-md shadow-md w-64">
    <p><strong># H1</strong>, <strong>## H2</strong>, <strong>### H3</strong></p>
    <p><strong>**bold**</strong> or __bold__</p>
    <p><em>*italic*</em> or _italic_</p>
    <p>~<sub>~</sub>Strikethrough~<sub>~</sub></p>
    <p>Unordered List: <br />- Item 1<br />- Item 2</p>
    <p>Ordered List: <br />1. Item 1<br />2. Item 2</p>
    <p>Checklist: <br />- [ ] To do<br />- [x] Done</p>
    <p>[Link Text](https://url.com)</p>
    <p>`Inline code`</p>
    <p>```<br />Code block<br />```</p>
  </div>
);


export function NotesView({ notes, categories, currentCategory, onAddNote, onUpdateNote, onDeleteNote, onClose }: NotesViewProps) {
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<Category>(currentCategory);
  const [isNewNotePreview, setIsNewNotePreview] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');
  const [isEditNotePreview, setIsEditNotePreview] = useState(false);

  useEffect(() => {
    if (currentCategory === "All Projects" && categories.length > 0) {
        setNewNoteCategory(categories[0]);
    } else if (categories.includes(currentCategory)) {
        setNewNoteCategory(currentCategory);
    } else if (categories.length > 0) {
        setNewNoteCategory(categories[0]);
    }
  }, [currentCategory, categories]);

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteTitle.trim() || undefined, newNoteContent.trim(), newNoteCategory);
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsNewNotePreview(false);
      if (currentCategory === "All Projects" && categories.length > 0) setNewNoteCategory(categories[0]);
        else if (categories.includes(currentCategory)) setNewNoteCategory(currentCategory);
        else if (categories.length > 0) setNewNoteCategory(categories[0]);
    }
  };

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditNoteTitle(note.title || '');
    setEditNoteContent(note.content);
    setIsEditNotePreview(false);
  };

  const handleUpdateNote = () => {
    if (editingNoteId && editNoteContent.trim()) {
      onUpdateNote(editingNoteId, editNoteTitle.trim() || undefined, editNoteContent.trim());
      setEditingNoteId(null);
      setIsEditNotePreview(false);
    }
  };
  
  const filteredNotes = notes
    .filter(note => currentCategory === "All Projects" || note.category === currentCategory)
    .sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" 
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Notes</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-widget-background border border-border-main rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Note Form */}
        <div className="space-y-3 p-4 bg-input-bg border border-border-main rounded-md">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Note title (optional)"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="input-field text-base p-3 flex-grow"
                    disabled={isNewNotePreview}
                />
                <div className="flex items-center ml-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Markdown?</Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="icon" onClick={() => setIsNewNotePreview(!isNewNotePreview)} className="w-8 h-8 ml-1">
                        {isNewNotePreview ? <Pencil className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </Button>
                </div>
            </div>
            {isNewNotePreview ? (
                <div className="prose prose-sm dark:prose-invert max-w-none p-3 min-h-[100px] border border-dashed border-border-main rounded-md">
                    <ReactMarkdown>{newNoteContent || "Nothing to preview..."}</ReactMarkdown>
                </div>
            ) : (
                <Textarea
                    placeholder="Type your note content here (Markdown supported)..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="input-field min-h-[100px] text-base p-3"
                />
            )}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-2">
                <label htmlFor="note-category-select" className="sr-only">Category</label>
                <Select value={newNoteCategory} onValueChange={(val) => setNewNoteCategory(val as Category)} disabled={isNewNotePreview}>
                    <SelectTrigger id="note-category-select" className="input-field text-sm h-auto py-2.5">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-widget-background border-border-main text-text-main">
                        {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddNote} className="btn-primary sm:col-span-3 text-sm h-auto py-2.5" disabled={isNewNotePreview}>
                 <PlusCircle className="w-4 h-4 mr-2"/> Add New Note
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <ul className="space-y-3">
          {filteredNotes.map(note => (
            <li key={note.id} className="bg-input-bg border border-border-main rounded-md p-3 hover:border-accent/30 transition-colors">
              {editingNoteId === note.id ? (
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} placeholder="Title (optional)" className="input-field p-2 text-sm flex-grow" disabled={isEditNotePreview}/>
                        <div className="flex items-center ml-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Markdown?</Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                            </Popover>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditNotePreview(!isEditNotePreview)} className="w-8 h-8 ml-1">
                                {isEditNotePreview ? <Pencil className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </Button>
                        </div>
                    </div>
                    {isEditNotePreview ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none p-2 min-h-[80px] border border-dashed border-border-main rounded-md">
                           <ReactMarkdown>{editNoteContent || "Nothing to preview..."}</ReactMarkdown>
                        </div>
                    ) : (
                        <Textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} placeholder="Content" className="input-field min-h-[80px] p-2 text-sm"/>
                    )}
                    <div className="flex gap-2 pt-1">
                        <Button onClick={handleUpdateNote} size="sm" className="btn-primary text-xs px-3 py-1.5" disabled={isEditNotePreview}>Save Changes</Button>
                        <Button onClick={() => setEditingNoteId(null)} variant="outline" size="sm" className="border-border-main text-muted-foreground hover:bg-background text-xs px-3 py-1.5">Cancel</Button>
                    </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-1">
                      <div>
                          {note.title && <h4 className="text-base font-semibold text-text-main">{note.title}</h4>}
                          <p className="text-xs text-muted-foreground">
                              {note.category} • Edited: {new Date(note.lastEdited).toLocaleDateString()}
                          </p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(note)} className="btn-icon w-7 h-7 text-muted-foreground hover:accent-text">
                              <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDeleteNote(note.id)} className="btn-icon danger w-7 h-7 text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-text-main leading-relaxed note-content-markdown">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                  </div>
                </>
              )}
            </li>
          ))}
          {filteredNotes.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No notes in this category. Jot something down!</p>
          )}
        </ul>
      </div>
    </div>
  );
}
