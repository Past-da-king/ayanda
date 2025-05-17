import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel, { IEvent } from '@/models/EventModel';
import { Event as AppEvent } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query = category && category !== "All Projects" ? { category } : {};
    const events: IEvent[] = await EventModel.find(query).sort({ date: 1 }); // Sort by event date
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ message: 'Failed to fetch events', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<AppEvent, 'id'> = await request.json();
    const newEventData: AppEvent = {
        id: uuidv4(),
        ...body,
    };
    const event: IEvent = new EventModel(newEventData);
    await event.save();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ message: 'Failed to create event', error: (error as Error).message }, { status: 500 });
  }
}
