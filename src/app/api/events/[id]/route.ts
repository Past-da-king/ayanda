import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel from '@/models/EventModel'; // Removed IEvent as it's inferred
import { Event as AppEvent, RecurrenceRule } from '@/types';
import mongoose from 'mongoose';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<AppEvent, 'id'>> & { recurrenceRule?: RecurrenceRule | null } = await request.json();
    
    const updatePayload: any = { ...body };
    if (body.hasOwnProperty('recurrenceRule') && !body.recurrenceRule) {
        updatePayload.$unset = { recurrenceRule: "" }; // To remove the field from DB if set to null
        delete updatePayload.recurrenceRule; // Don't send recurrenceRule field itself if unsetting
    }

    const updatedEvent = await EventModel.findOneAndUpdate({ id: id }, updatePayload, { new: true, runValidators: true });
    if (!updatedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
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

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedEvent = await EventModel.findOneAndDelete({ id: id });
    if (!deletedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete event ${id}`, error: (error as Error).message }, { status: 500 });
  }
}
