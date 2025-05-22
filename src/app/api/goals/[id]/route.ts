import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoalModel from '@/models/GoalModel';
import { Goal } from '@/types';
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
    const body: Partial<Omit<Goal, 'id' | 'userId'>> = await request.json();
    const updatedGoal = await GoalModel.findOneAndUpdate({ id: id, userId: userIdAuth }, body, { new: true, runValidators: true });
    if (!updatedGoal) {
      return NextResponse.json({ message: 'Goal not found or you do not have permission to update it.' }, { status: 404 });
    }
    return NextResponse.json(updatedGoal, { status: 200 });
  } catch (error) {
    console.error(`Failed to update goal ${id}:`, error);
    return NextResponse.json({ message: `Failed to update goal ${id}`, error: (error as Error).message }, { status: 500 });
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
    const deletedGoal = await GoalModel.findOneAndDelete({ id: id, userId: userIdAuth });
    if (!deletedGoal) {
      return NextResponse.json({ message: 'Goal not found or you do not have permission to delete it.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Goal deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete goal ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete goal ${id}`, error: (error as Error).message }, { status: 500 });
  }
}



