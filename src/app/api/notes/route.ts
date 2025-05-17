import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NoteModel, { INote } from '@/models/NoteModel';
import { Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query = category && category !== "All Projects" ? { category } : {};
    const notes: INote[] = await NoteModel.find(query).sort({ lastEdited: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json({ message: 'Failed to fetch notes', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<Note, 'id' | 'lastEdited'> = await request.json();
    const newNoteData: Note = {
        id: uuidv4(),
        ...body,
        lastEdited: new Date().toISOString(),
    };
    const note: INote = new NoteModel(newNoteData);
    await note.save();
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Failed to create note:', error);
    return NextResponse.json({ message: 'Failed to create note', error: (error as Error).message }, { status: 500 });
  }
}
