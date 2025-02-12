import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = signupSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.errors }, { status: 400 });
    }
    
    const { firstName, lastName, email, password } = parseResult.data;
    const { db } = await connectToDatabase();

    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.collection('users').insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });
    
    const user = { id: result.insertedId, firstName, lastName, email };
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 