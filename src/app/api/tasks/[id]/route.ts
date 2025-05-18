import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel'; // Removed ITask as it's inferred
import { Task, SubTask, RecurrenceRule } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';


interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<Task, 'id'>> & { subTasks?: SubTask[], recurrenceRule?: RecurrenceRule } = await request.json();

    // Ensure subTasks have IDs if provided
    if (body.subTasks) {
      body.subTasks = body.subTasks.map(sub => ({
        ...sub,
        id: sub.id || uuidv4(), // Assign new ID if missing, useful if adding new subtasks during update
      }));
    }
    
    // If recurrenceRule is explicitly set to null or undefined by client to remove it
    const updatePayload: any = { ...body };
    if (body.hasOwnProperty('recurrenceRule') && !body.recurrenceRule) {
        updatePayload.$unset = { recurrenceRule: "" };
        delete updatePayload.recurrenceRule;
    }
    if (body.hasOwnProperty('subTasks') && body.subTasks === null) { // Allow clearing subtasks
      updatePayload.subTasks = [];
    }


    const updatedTask = await TaskModel.findOneAndUpdate({ id: id }, updatePayload, { new: true, runValidators: true });
    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
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
  await dbConnect();
  const { id } = params;
  try {
    const deletedTask = await TaskModel.findOneAndDelete({ id: id });
    if (!deletedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete task ${id}`, error: (error as Error).message }, { status: 500 });
  }
}
