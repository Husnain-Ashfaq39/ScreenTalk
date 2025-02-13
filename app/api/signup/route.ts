import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '7d';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = signupSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.errors }, { status: 400 });
    }

    const { firstName, lastName, email, password } = parseResult.data;
    const { db } = await connectToDatabase();

    // Check if a user with the email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user object
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    // Insert the new user into the database
    const result = await db.collection('users').insertOne(newUser);

    // Generate a JWT token
    const token = jwt.sign({
      userId: result.insertedId.toString(),
      email,
      firstName,
      lastName
    }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    // Create response and set auth cookie
    const response = NextResponse.json({ user: { id: result.insertedId, email, firstName, lastName } });
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 