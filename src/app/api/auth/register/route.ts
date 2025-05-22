import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel, { IUser } from '@/models/UserModel';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { id, email, name, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long.'}, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 }); // 409 Conflict
    }

    // The password will be hashed by the pre-save hook in UserModel
    const newUser: IUser = new UserModel({
      id: id || uuidv4(), // Use provided ID or generate new
      email: email.toLowerCase(),
      name: name || '',
      passwordHash: password, // Pass plain password, it will be hashed by Mongoose pre-save hook
    });

    await newUser.save();

    // Don't return the passwordHash
    const userResponse = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    };

    return NextResponse.json(userResponse , { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    // Check for Mongoose validation errors
    interface MongooseValidationError extends Error {
        errors: { [key: string]: { message: string; kind: string; path: string; value: unknown } };
    }
    if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json({ message: 'Validation Error', errors: (error as MongooseValidationError).errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred during registration.' }, { status: 500 });
  }
}

