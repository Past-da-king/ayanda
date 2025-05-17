import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NoteModel, { INote } from '@/models/NoteModel';
import { Note } from '@/types';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<Note, 'id'>> = await request.json();
    const updateData = {
      ...body,
      lastEdited: new Date().toISOString(), // Always update lastEdited timestamp
    };
    const updatedNote = await NoteModel.findOneAndUpdate({ id: id }, updateData, { new: true, runValidators: true });
    if (!updatedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error(`Failed to update note ${id}:`, error);
    return NextResponse.json({ message: `Failed to update note ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedNote = await NoteModel.findOneAndDelete({ id: id });
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete note ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete note ${id}`, error: (error as Error).message }, { status: 500 });
  }
}
