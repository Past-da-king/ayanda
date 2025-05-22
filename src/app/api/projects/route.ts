import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/types';

// For now, projects (categories) are hardcoded as per the initial setup.
// This API route can be expanded later if dynamic project/category management is needed.
// Currently, it will just return the predefined list.
const initialProjectsData: { id: string, name: Category }[] = [
    { id: 'proj_all', name: 'All Projects' }, // Added All Projects for completeness
    { id: 'proj_personal', name: 'Personal Life' },
    { id: 'proj_work', name: 'Work' },
    { id: 'proj_learning', name: 'Studies' }
];

export async function GET(_request: NextRequest) {
  try {
    // In a real scenario, you might fetch these from a 'Categories' collection in MongoDB
    const categories: Category[] = initialProjectsData.map(p => p.name);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch projects/categories:', error);
    return NextResponse.json({ message: 'Failed to fetch projects/categories', error: (error as Error).message }, { status: 500 });
  }
}

// POST might be used to add a new category dynamically if needed.
// For now, we'll assume categories are managed elsewhere or are static.
/*
export async function POST(request: NextRequest) {
  // Example: Add a new category to a 'Categories' collection
  // await dbConnect();
  // const { name } = await request.json();
  // const newCategory = new CategoryModel({ name });
  // await newCategory.save();
  // return NextResponse.json(newCategory, { status: 201 });
  return NextResponse.json({ message: 'Project creation not implemented yet' }, { status:501});
}
*/

