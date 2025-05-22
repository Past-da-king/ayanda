import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NoteModel, { INote } from '@/models/NoteModel';
import { Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query: { userId: string; category?: string } = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const notes: INote[] = await NoteModel.find(query).sort({ lastEdited: -1 });
    return NextResponse.json(notes, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json({ message: 'Failed to fetch notes', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const body: Omit<Note, 'id' | 'lastEdited' | 'userId' | 'createdAt'> = await request.json();
    const newNoteData: Note = {
        id: uuidv4(),
        userId: userId,
        title: body.title,
        content: body.content,
        category: body.category,
        lastEdited: new Date().toISOString(),
        // createdAt will be added by Mongoose timestamps
    };
    const note: INote = new NoteModel(newNoteData);
    await note.save();
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Failed to create note:', error);
    return NextResponse.json({ message: 'Failed to create note', error: (error as Error).message }, { status: 500 });
  }
}


