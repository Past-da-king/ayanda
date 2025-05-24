import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectModel from '@/models/ProjectModel';
import TaskModel from '@/models/TaskModel';
import NoteModel from '@/models/NoteModel';
import GoalModel from '@/models/GoalModel';
import EventModel from '@/models/EventModel';
import { getToken } from 'next-auth/jwt';
import { Project } from '@/types';
// import mongoose from 'mongoose'; // Removed unused import


interface Params {
  id: string;
}

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
    const { name } = await request.json();
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ message: 'New project name is required.' }, { status: 400 });
    }
    if (name.toLowerCase() === "all projects") {
        return NextResponse.json({ message: '"All Projects" is a reserved name and cannot be used.' }, { status: 400 });
    }

    const projectToUpdate = await ProjectModel.findOne({ id: id, userId: userIdAuth });

    if (!projectToUpdate) {
      return NextResponse.json({ message: 'Project not found or you do not have permission to update it.' }, { status: 404 });
    }

    const oldName = projectToUpdate.name;
    projectToUpdate.name = name.trim();
    await projectToUpdate.save();

    // Update category name in associated items
    const updateCategoryInModels = async (oldCategoryName: string, newCategoryName: string) => {
        await TaskModel.updateMany({ userId: userIdAuth, category: oldCategoryName }, { $set: { category: newCategoryName } });
        await NoteModel.updateMany({ userId: userIdAuth, category: oldCategoryName }, { $set: { category: newCategoryName } });
        await GoalModel.updateMany({ userId: userIdAuth, category: oldCategoryName }, { $set: { category: newCategoryName } });
        await EventModel.updateMany({ userId: userIdAuth, category: oldCategoryName }, { $set: { category: newCategoryName } });
    };

    if (oldName !== projectToUpdate.name) { 
        await updateCategoryInModels(oldName, projectToUpdate.name);
    }
    
    const updatedProject: Project = {
        id: projectToUpdate.id,
        userId: projectToUpdate.userId,
        name: projectToUpdate.name,
        createdAt: projectToUpdate.createdAt?.toISOString(),
        updatedAt: projectToUpdate.updatedAt?.toISOString(),
    };

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error: unknown) {
    console.error(`Failed to update project ${id}:`, error);
    // Type guard for MongoDB duplicate key error
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 11000 && 'keyValue' in error) {
        const keyValue = (error as { keyValue: Record<string, string> }).keyValue;
        return NextResponse.json({ message: `A project with the name "${keyValue?.name}" already exists.` }, { status: 409 });
    }
    return NextResponse.json({ message: `Failed to update project ${id}`, error: (error instanceof Error ? error.message : "An unknown error occurred") }, { status: 500 });
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
    const projectToDelete = await ProjectModel.findOne({ id: id, userId: userIdAuth });
    if (!projectToDelete) {
      return NextResponse.json({ message: 'Project not found or you do not have permission to delete it.' }, { status: 404 });
    }

    const defaultCategory = "Personal Life"; 

    const personalLifeProjectExists = await ProjectModel.findOne({ userId: userIdAuth, name: defaultCategory });
    const projectCount = await ProjectModel.countDocuments({ userId: userIdAuth });

    if (projectToDelete.name === defaultCategory && projectCount === 1) {
        return NextResponse.json({ message: 'Cannot delete the default "Personal Life" project if it is the only project.' }, { status: 400 });
    }
    const hardcodedDefaults = ["Work", "Studies"]; 
    if (hardcodedDefaults.includes(projectToDelete.name) && projectCount === 1) {
        return NextResponse.json({ message: `Cannot delete the default project "${projectToDelete.name}" if it is the only project.` }, { status: 400 });
    }


    if (personalLifeProjectExists && projectToDelete.name !== defaultCategory) {
        await TaskModel.updateMany({ userId: userIdAuth, category: projectToDelete.name }, { $set: { category: defaultCategory } });
        await NoteModel.updateMany({ userId: userIdAuth, category: projectToDelete.name }, { $set: { category: defaultCategory } });
        await GoalModel.updateMany({ userId: userIdAuth, category: projectToDelete.name }, { $set: { category: defaultCategory } });
        await EventModel.updateMany({ userId: userIdAuth, category: projectToDelete.name }, { $set: { category: defaultCategory } });
    } else if (!personalLifeProjectExists && projectToDelete.name !== defaultCategory) {
        console.warn(`Default project "${defaultCategory}" not found. Items from "${projectToDelete.name}" will not be automatically re-categorized.`);
    }


    await ProjectModel.deleteOne({ id: id, userId: userIdAuth });

    return NextResponse.json({ message: `Project "${projectToDelete.name}" deleted successfully.` }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete project ${id}`, error: (error instanceof Error ? error.message : "An unknown error occurred") }, { status: 500 });
  }
}
