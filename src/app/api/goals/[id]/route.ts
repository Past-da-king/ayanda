import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoalModel, { IGoal } from '@/models/GoalModel';
import { Goal } from '@/types';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Goal> = await request.json();
    const updatedGoal = await GoalModel.findOneAndUpdate({ id: id }, body, { new: true, runValidators: true });
    if (!updatedGoal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
    }
    return NextResponse.json(updatedGoal, { status: 200 });
  } catch (error) {
    console.error(`Failed to update goal ${id}:`, error);
    return NextResponse.json({ message: `Failed to update goal ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedGoal = await GoalModel.findOneAndDelete({ id: id });
    if (!deletedGoal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Goal deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete goal ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete goal ${id}`, error: (error as Error).message }, { status: 500 });
  }
}
