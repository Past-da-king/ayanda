import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel, { ITask } from '@/models/TaskModel';
import { Task, RecurrenceRule, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    const query = category && category !== "All Projects" ? { category } : {};
    // Consider how to sort/filter recurring tasks for lists if `nextDueDate` isn't stored.
    // For now, sorting by createdAt or potentially dueDate (as start date for recurring).
    const tasks: ITask[] = await TaskModel.find(query).sort({ dueDate: 1, createdAt: -1 });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<Task, 'id' | 'completed'> & { subTasks?: SubTask[], recurrenceRule?: RecurrenceRule } = await request.json();
    
    const newSubTasks = (body.subTasks || []).map(sub => ({ ...sub, id: sub.id || uuidv4() }));

    const newTaskData: Task = {
        id: uuidv4(),
        text: body.text,
        completed: false,
        dueDate: body.dueDate,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
        subTasks: newSubTasks,
    };
    const task: ITask = new TaskModel(newTaskData);
    await task.save();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    // More detailed error logging or specific error messages can be added here
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create task', error: (error as Error).message }, { status: 500 });
  }
}
