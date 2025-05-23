import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NoteModel from '@/models/NoteModel';
import { Note } from '@/types';
import { getToken } from 'next-auth/jwt';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params: paramsPromise }: { params: Promise<Params> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const params = await paramsPromise; // Await the promise
  const { id } = params;

  try {
    const body: Partial<Omit<Note, 'id' | 'userId'>> = await request.json();
    const updateData = {
      ...body,
      lastEdited: new Date().toISOString(),
    };
    const updatedNote = await NoteModel.findOneAndUpdate({ id: id, userId: userIdAuth }, updateData, { new: true, runValidators: true });
    if (!updatedNote) {
      return NextResponse.json({ message: 'Note not found or you do not have permission to update it.' }, { status: 404 });
    }
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error(`Failed to update note ${id}:`, error);
    return NextResponse.json({ message: `Failed to update note ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params: paramsPromise }: { params: Promise<Params> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const params = await paramsPromise; // Await the promise
  const { id } = params;

  try {
    const deletedNote = await NoteModel.findOneAndDelete({ id: id, userId: userIdAuth });
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note not found or you do not have permission to delete it.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete note ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete note ${id}`, error: (error as Error).message }, { status: 500 });
  }
}



