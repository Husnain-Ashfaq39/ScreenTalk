import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files or assets
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // Allow access to public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api/login') || pathname.startsWith('/api/signup')) {
    return NextResponse.next();
  }
  console.log("middleware");
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  console.log('token'+token);
  console.log('JWT_SECRET'+JWT_SECRET);

  try {
    const decoded=jwt.verify(token, JWT_SECRET);
    console.log('user'+decoded);
    return NextResponse.next();
   
  } catch (error) {
    console.error('JWT Error:', error);
    
    
  }

}

export const config = {
  matcher: ['/dashboard/:path*', '/create/:path*']
}; 