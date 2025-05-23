import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel from '@/models/EventModel';
import { Event as AppEvent, RecurrenceRule } from '@/types';
import mongoose from 'mongoose';
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
  const params = await paramsPromise; // Await the promise here
  const { id } = params;

  try {
    const body: Partial<Omit<AppEvent, 'id' | 'userId'>> & { recurrenceRule?: RecurrenceRule | null } = await request.json();
    
    const updatePayload: Partial<Omit<AppEvent, 'id' | 'userId'>> & { $unset?: { [key: string]: string } } = { ...body };
    if (body.hasOwnProperty('recurrenceRule') && !body.recurrenceRule) {
        updatePayload.$unset = { recurrenceRule: "" };
        delete updatePayload.recurrenceRule;
    }

    const updatedEvent = await EventModel.findOneAndUpdate({ id: id, userId: userIdAuth }, updatePayload, { new: true, runValidators: true });
    if (!updatedEvent) {
      return NextResponse.json({ message: 'Event not found or you do not have permission to update it.' }, { status: 404 });
    }
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
     if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: `Failed to update event ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params: paramsPromise }: { params: Promise<Params> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const params = await paramsPromise; // Await the promise here
  const { id } = params;

  try {
    const deletedEvent = await EventModel.findOneAndDelete({ id: id, userId: userIdAuth });
    if (!deletedEvent) {
      return NextResponse.json({ message: 'Event not found or you do not have permission to delete it.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete event ${id}`, error: (error as Error).message }, { status: 500 });
  }
}


