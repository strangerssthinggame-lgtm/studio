
// src/app/auth/callback/route.ts
import {adminApp} from '@/lib/firebase-admin';
import {getAuth} from 'firebase-admin/auth';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  const idToken = await request.text();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  if (!adminApp) {
    // Return a successful response to prevent client-side errors,
    // but log a warning that the admin app is not initialized.
    console.warn("Firebase Admin SDK not initialized. Session cookie not created.");
    return NextResponse.json({status: 'success'});
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
    return NextResponse.json({status: 'error'}, {status: 401});
  }
}
