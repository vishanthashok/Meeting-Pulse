import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In production, use a proper email service like Resend, SendGrid, etc.
// and store tokens in a database with expiration

// Mock token storage (in production, use Redis or database)
const tokenStore = new Map<string, { email: string; expires: Date }>();

// Send magic link email
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token (in production, use database)
    tokenStore.set(token, { email, expires });

    // Create magic link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

    // In production: Send email using email service
    console.log('Magic link for', email, ':', magicLink);
    
    // Mock email sending
    if (process.env.NODE_ENV === 'development') {
      console.log(`
        📧 Magic Link Email (Development Mode)
        To: ${email}
        Link: ${magicLink}
        Expires: ${expires.toISOString()}
      `);
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent to your email',
      // Only return link in development
      ...(process.env.NODE_ENV === 'development' && { magicLink }),
    });
  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}

// Verify magic link token
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Token required' },
      { status: 400 }
    );
  }

  const tokenData = tokenStore.get(token);

  if (!tokenData) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  if (tokenData.expires < new Date()) {
    tokenStore.delete(token);
    return NextResponse.json(
      { error: 'Token expired' },
      { status: 401 }
    );
  }

  // Token is valid, create session
  // In production: Create JWT or session token
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  // Clean up used token
  tokenStore.delete(token);

  // In production: Store session in database or Redis
  // For now, we'll just return it to be stored in localStorage
  
  // Redirect to app with session
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
