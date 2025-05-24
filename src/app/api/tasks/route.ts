// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel, { ITask } from '@/models/TaskModel';
import { Task, RecurrenceRule, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';

interface MongoError extends Error {
    code?: number;
    keyValue?: Record<string, unknown>;
}

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
    const tasksDocs: ITask[] = await TaskModel.find(query).sort({ dueDate: 1, createdAt: -1 });
    const tasks = tasksDocs.map(doc => doc.toObject());
    return NextResponse.json(tasks, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks', error: (error as Error).message }, { status: 500 });
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
    const body: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt' | 'updatedAt'> & {
      subTasks?: Partial<Omit<SubTask, 'id'>>[],
      recurrenceRule?: RecurrenceRule,
      linkedGoalId?: string;
      contributionValue?: number;
    } = await request.json();

    const newSubTasks = (body.subTasks || []).map(sub => ({
        id: sub.id || uuidv4(), // Subtasks still get a UUID if not provided
        text: sub.text || '',
        completed: sub.completed || false
    }));

    const taskDataForModel = {
        userId: userId,
        text: body.text,
        completed: false,
        dueDate: body.dueDate,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
        subTasks: newSubTasks.filter(st => st.text.trim() !== ''),
        linkedGoalId: body.linkedGoalId,
        contributionValue: body.linkedGoalId ? (body.contributionValue === undefined ? 1 : body.contributionValue) : undefined,
    };

    const taskDocument: ITask = new TaskModel(taskDataForModel);
    await taskDocument.save();

    const savedTaskObject = taskDocument.toObject();
    return NextResponse.json(savedTaskObject, { status: 201 });

  } catch (error) {
    console.error('Failed to create task:', error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    const mongoError = error as MongoError;
    if (mongoError.code === 11000 && mongoError.keyValue) {
        const fieldName = Object.keys(mongoError.keyValue)[0];
        console.error(`Duplicate key error on task creation. Field: ${fieldName}, Value: ${mongoError.keyValue[fieldName]}`);
        return NextResponse.json({
            message: `Failed to create task. The value for '${fieldName}' must be unique.`,
            error: mongoError.message
        }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create task', error: (error as Error).message }, { status: 500 });
  }
}
