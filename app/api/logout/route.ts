import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('auth-token');
  return response;
} 