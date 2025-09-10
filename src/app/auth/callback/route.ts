// src/app/auth/callback/route.ts
import {adminApp} from '@/lib/firebase-admin';
import {getAuth} from 'firebase-admin/auth';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  const idToken = await request.text();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  if (!adminApp) {
    console.error("Firebase Admin SDK is not initialized. Cannot create session cookie.");
    return new NextResponse('Internal Server Error: Firebase Admin not initialized', { status: 500 });
  }

  try {
    const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, {
      expiresIn,
    });
    const response = NextResponse.json({status: 'success'});
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });
    return response;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
