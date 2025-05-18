import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel, { IEvent } from '@/models/EventModel';
import { Event as AppEvent, RecurrenceRule } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query = category && category !== "All Projects" ? { category } : {};
    const events: IEvent[] = await EventModel.find(query).sort({ date: 1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ message: 'Failed to fetch events', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<AppEvent, 'id'> & { recurrenceRule?: RecurrenceRule } = await request.json();
    const newEventData: AppEvent = {
        id: uuidv4(),
        title: body.title,
        date: body.date,
        duration: body.duration,
        description: body.description,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
    };
    const event: IEvent = new EventModel(newEventData);
    await event.save();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create event', error: (error as Error).message }, { status: 500 });
  }
}
