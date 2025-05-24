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

type TaskUpdatePayload = Partial<Omit<Task, 'id' | 'userId'>> & {
    subTasks?: Partial<SubTask>[];
    recurrenceRule?: RecurrenceRule | null;
    linkedGoalId?: string | null;
    contributionValue?: number | null;
    $unset?: { [key: string]: string }; // For Mongoose $unset operator
};


export async function PUT(request: NextRequest, { params: paramsPromise }: { params: Promise<Params> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const params = await paramsPromise;
  const { id } = params;

  try {
    const body: Partial<Omit<Task, 'id' | 'userId'>> & {
        subTasks?: Partial<SubTask>[],
        recurrenceRule?: RecurrenceRule | null,
        linkedGoalId?: string | null;
        contributionValue?: number | null;
    } = await request.json();

    const updatePayload: TaskUpdatePayload = { ...body };

    if (body.subTasks) {
      updatePayload.subTasks = body.subTasks.map(sub => ({
        id: sub.id || uuidv4(),
        text: sub.text || '',
        completed: sub.completed || false,
      })).filter(st => st.text.trim() !== '');
    }

    if (body.hasOwnProperty('recurrenceRule') && body.recurrenceRule === null) {
        if (!updatePayload.$unset) updatePayload.$unset = {};
        updatePayload.$unset.recurrenceRule = "";
        delete updatePayload.recurrenceRule;
    } else if (body.recurrenceRule) {
        updatePayload.recurrenceRule = body.recurrenceRule;
    }

    if (body.hasOwnProperty('linkedGoalId') && body.linkedGoalId === null) {
        if (!updatePayload.$unset) updatePayload.$unset = {};
        updatePayload.$unset.linkedGoalId = "";
        delete updatePayload.linkedGoalId;
    } else if (body.linkedGoalId) {
        updatePayload.linkedGoalId = body.linkedGoalId;
    }

    if (body.hasOwnProperty('contributionValue') && body.contributionValue === null) {
        if (!updatePayload.$unset) updatePayload.$unset = {};
        updatePayload.$unset.contributionValue = "";
        delete updatePayload.contributionValue;
    } else if (body.contributionValue !== undefined) {
        updatePayload.contributionValue = body.contributionValue;
    }


    if (body.hasOwnProperty('subTasks') && (body.subTasks === null || (Array.isArray(body.subTasks) && body.subTasks.length === 0))) {
      updatePayload.subTasks = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateOperation: any = {};
    if (Object.keys(updatePayload).some(key => key !== '$unset')) {
        updateOperation.$set = {};
        for (const key in updatePayload) {
            if (key !== '$unset' && key !== 'subTasks') { 
                (updateOperation.$set as Record<string, unknown>)[key] = updatePayload[key as keyof typeof updatePayload];
            } else if (key === 'subTasks' && updatePayload.subTasks !== undefined) {
                 (updateOperation.$set as Record<string, unknown>)[key] = updatePayload.subTasks;
            }
        }
        if(Object.keys(updateOperation.$set).length === 0) delete updateOperation.$set;
    }
    if (updatePayload.$unset) {
        updateOperation.$unset = updatePayload.$unset;
    }


    const updatedTask = await TaskModel.findOneAndUpdate(
        { id: id, userId: userIdAuth },
        updateOperation,
        { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found or you do not have permission to update it.' }, { status: 404 });
    }
    return NextResponse.json(updatedTask.toObject(), { status: 200 });
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: `Failed to update task ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params: paramsPromise }: { params: Promise<Params> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const params = await paramsPromise;
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
