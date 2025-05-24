import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectModel, { IProject } from '@/models/ProjectModel';
import { getToken } from 'next-auth/jwt';
import { Project } from '@/types';
// import mongoose from 'mongoose'; // Removed unused import

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const projects: IProject[] = await ProjectModel.find({ userId }).sort({ name: 1 });
    const projectObjects: Project[] = projects.map(p => ({
        id: p.id,
        userId: p.userId,
        name: p.name,
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
    }));
    return NextResponse.json(projectObjects, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json({ message: 'Failed to fetch projects', error: (error instanceof Error ? error.message : "An unknown error occurred") }, { status: 500 });
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
    const { name } = await request.json();
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ message: 'Project name is required.' }, { status: 400 });
    }
    if (name.toLowerCase() === "all projects") {
        return NextResponse.json({ message: '"All Projects" is a reserved name and cannot be used.' }, { status: 400 });
    }


    const newProjectDoc: IProject = new ProjectModel({
      userId: userId,
      name: name.trim(),
    });
    
    await newProjectDoc.save();
    
    const newProject: Project = {
        id: newProjectDoc.id,
        userId: newProjectDoc.userId,
        name: newProjectDoc.name,
        createdAt: newProjectDoc.createdAt?.toISOString(),
        updatedAt: newProjectDoc.updatedAt?.toISOString(),
    };

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create project:', error);
    // Type guard for MongoDB duplicate key error
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 11000 && 'keyValue' in error) {
        const keyValue = (error as { keyValue: Record<string, string> }).keyValue;
        return NextResponse.json({ message: `A project with the name "${keyValue?.name}" already exists.` }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create project', error: (error instanceof Error ? error.message : "An unknown error occurred") }, { status: 500 });
  }
}
