import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import GoalModel from '@/models/GoalModel';
import NoteModel from '@/models/NoteModel';
import EventModel from '@/models/EventModel';
import { Category, SearchResultItem } from '@/types';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized for search' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const currentCategoryFilter = searchParams.get('category') as Category | null;

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ message: 'Search query "q" must be at least 2 characters long' }, { status: 400 });
  }

  try {
    const searchRegex = { $regex: query, $options: 'i' };

    const baseQuery: { userId: string; category?: Category } = { userId }; // Always filter by userId
    if (currentCategoryFilter && currentCategoryFilter !== "All Projects") {
      baseQuery.category = currentCategoryFilter;
    }

    const tasksPromise = TaskModel.find({ ...baseQuery, text: searchRegex }).limit(10).lean();
    const goalsPromise = GoalModel.find({ ...baseQuery, name: searchRegex }).limit(10).lean();
    const notesPromise = NoteModel.find({ ...baseQuery, $or: [{ title: searchRegex }, { content: searchRegex }] }).limit(10).lean();
    const eventsPromise = EventModel.find({ ...baseQuery, $or: [{ title: searchRegex }, { description: searchRegex }] }).limit(10).lean();

    const [tasks, goals, notes, events] = await Promise.all([
      tasksPromise,
      goalsPromise,
      notesPromise,
      eventsPromise,
    ]);

    const results: SearchResultItem[] = [];

    tasks.forEach(task => results.push({
      id: task.id,
      type: 'task',
      title: task.text,
      category: task.category as Category,
      date: task.dueDate,
      path: `/tasks#${task.id}`,
    }));
    goals.forEach(goal => results.push({
      id: goal.id,
      type: 'goal',
      title: goal.name,
      category: goal.category as Category,
      path: `/goals#${goal.id}`,
    }));
    notes.forEach(note => results.push({
      id: note.id,
      type: 'note',
      title: note.title || note.content.substring(0, 50) + (note.content.length > 50 ? '...' : ''),
      category: note.category as Category,
      date: note.lastEdited,
      contentPreview: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
      path: `/notes#${note.id}`,
    }));
    events.forEach(event => results.push({
      id: event.id,
      type: 'event',
      title: event.title,
      category: event.category as Category,
      date: event.date,
      contentPreview: event.description?.substring(0, 100) + ((event.description?.length || 0) > 100 ? '...' : ''),
      path: `/calendar#${event.id}`,
    }));
    
    results.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA; 
    });

    return NextResponse.json(results.slice(0, 20), { status: 200 });

  } catch (error) {
    console.error('Failed to perform search:', error);
    return NextResponse.json({ message: 'Failed to perform search', error: (error as Error).message }, { status: 500 });
  }
}


