import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoalModel, { IGoal } from '@/models/GoalModel';
import { Goal } from '@/types';
import { v4 as uuidv4 } from 'uuid';
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
    const goals: IGoal[] = await GoalModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(goals, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return NextResponse.json({ message: 'Failed to fetch goals', error: (error as Error).message }, { status: 500 });
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
    const body: Omit<Goal, 'id' | 'userId' | 'createdAt'> = await request.json();
     const newGoalData: Goal = {
        id: uuidv4(),
        userId: userId,
        name: body.name,
        currentValue: body.currentValue,
        targetValue: body.targetValue,
        unit: body.unit,
        category: body.category,
        // createdAt will be added by Mongoose timestamps
    };
    const goal: IGoal = new GoalModel(newGoalData);
    await goal.save();
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Failed to create goal:', error);
    return NextResponse.json({ message: 'Failed to create goal', error: (error as Error).message }, { status: 500 });
  }
}

