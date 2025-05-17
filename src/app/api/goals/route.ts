import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoalModel, { IGoal } from '@/models/GoalModel';
import { Goal } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query = category && category !== "All Projects" ? { category } : {};
    const goals: IGoal[] = await GoalModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return NextResponse.json({ message: 'Failed to fetch goals', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body: Omit<Goal, 'id'> = await request.json();
     const newGoalData: Goal = {
        id: uuidv4(),
        ...body,
    };
    const goal: IGoal = new GoalModel(newGoalData);
    await goal.save();
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Failed to create goal:', error);
    return NextResponse.json({ message: 'Failed to create goal', error: (error as Error).message }, { status: 500 });
  }
}
