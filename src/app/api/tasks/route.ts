import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel, { ITask } from '@/models/TaskModel';
import { Task, RecurrenceRule, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
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
    const query: any = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const tasks: ITask[] = await TaskModel.find(query).sort({ dueDate: 1, createdAt: -1 });
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
    const body: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt'> & { subTasks?: Partial<SubTask>[], recurrenceRule?: RecurrenceRule } = await request.json();
    
    const newSubTasks = (body.subTasks || []).map(sub => ({ 
        id: sub.id || uuidv4(), 
        text: sub.text || '', 
        completed: sub.completed || false 
    }));

    const newTaskData: Omit<Task, 'id'> & {userId: string} = { 
        userId: userId,
        text: body.text,
        completed: false,
        dueDate: body.dueDate,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
        subTasks: newSubTasks.filter(st => st.text.trim() !== ''), // Filter out empty subtasks
        // createdAt will be added by Mongoose timestamps
    };
    
    const taskToSave : Task = {id: uuidv4(), ...newTaskData};
    const task: ITask = new TaskModel(taskToSave);
    await task.save();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create task', error: (error as Error).message }, { status: 500 });
  }
}


