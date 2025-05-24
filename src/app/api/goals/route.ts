import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoalModel, { IGoal } from '@/models/GoalModel';
import TaskModel from '@/models/TaskModel'; // Import TaskModel
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
    const query: { userId: string; category?: string } = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const goalsFromDb: IGoal[] = await GoalModel.find(query).sort({ createdAt: -1 }).lean(); // Use .lean() for plain objects

    const goalsWithCalculatedProgress: Goal[] = await Promise.all(
      goalsFromDb.map(async (goalDoc) => {
        const linkedCompletedTasks = await TaskModel.find({
          userId: userId,
          linkedGoalId: goalDoc.id, // Mongoose virtual 'id'
          completed: true,
        }).lean();

        const currentValue = linkedCompletedTasks.reduce(
          (sum, task) => sum + (task.contributionValue || 0), // Default to 0 if undefined
          0
        );
        
        // Construct the Goal object compliant with the Goal type
        return {
          id: goalDoc.id,
          userId: goalDoc.userId,
          name: goalDoc.name,
          targetValue: goalDoc.targetValue,
          unit: goalDoc.unit,
          category: goalDoc.category,
          createdAt: goalDoc.createdAt?.toISOString(),
          updatedAt: goalDoc.updatedAt?.toISOString(),
          currentValue: currentValue, // Add calculated currentValue
        };
      })
    );

    return NextResponse.json(goalsWithCalculatedProgress, { status: 200, headers: { 'Cache-Control': 'no-store' } });
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
    // currentValue is removed from body, as it's calculated
    const body: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'currentValue'> = await request.json();
     const newGoalData: Goal = {
        id: uuidv4(),
        userId: userId,
        name: body.name,
        targetValue: body.targetValue,
        unit: body.unit,
        category: body.category,
        // createdAt will be added by Mongoose timestamps
        // currentValue is not stored, it will be calculated
    };
    const goal: IGoal = new GoalModel(newGoalData);
    await goal.save();
    // Return the goal as is, client will fetch with calculated progress if needed
    return NextResponse.json(goal.toObject(), { status: 201 });
  } catch (error) {
    console.error('Failed to create goal:', error);
    return NextResponse.json({ message: 'Failed to create goal', error: (error as Error).message }, { status: 500 });
  }
}



