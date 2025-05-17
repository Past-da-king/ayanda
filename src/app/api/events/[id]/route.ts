import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel, { IEvent } from '@/models/EventModel';
import { Event as AppEvent } from '@/types';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<AppEvent> = await request.json();
    const updatedEvent = await EventModel.findOneAndUpdate({ id: id }, body, { new: true, runValidators: true });
    if (!updatedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
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
