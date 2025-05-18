import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import { Task, SubTask, RecurrenceRule } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<Task, 'id' | 'userId'>> & { subTasks?: SubTask[], recurrenceRule?: RecurrenceRule } = await request.json();

    const updatePayload: any = { ...body };
    
    if (body.subTasks) {
      updatePayload.subTasks = body.subTasks.map(sub => ({
        ...sub,
        id: sub.id || uuidv4(),
      }));
    }
    
    if (body.hasOwnProperty('recurrenceRule') && !body.recurrenceRule) {
        updatePayload.$unset = { recurrenceRule: "" };
        delete updatePayload.recurrenceRule;
    }
    if (body.hasOwnProperty('subTasks') && body.subTasks === null) {
      updatePayload.subTasks = [];
    }

    const updatedTask = await TaskModel.findOneAndUpdate({ id: id, userId: userIdAuth }, updatePayload, { new: true, runValidators: true });
    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found or you do not have permission to update it.' }, { status: 404 });
    }
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: `Failed to update task ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const deletedTask = await TaskModel.findOneAndDelete({ id: id, userId: userIdAuth });
    if (!deletedTask) {
      return NextResponse.json({ message: 'Task not found or you do not have permission to delete it.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete task ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

