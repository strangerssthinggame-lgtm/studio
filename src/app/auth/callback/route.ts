
// src/app/auth/callback/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {initializeApp, getApp, getApps} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!getApps().length) {
  initializeApp({
    credential: {
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    },
  });
}

export async function POST(request: NextRequest) {
  const {idToken} = await request.json();

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await getAuth().createSessionCookie(idToken, {
      expiresIn,
    });
    cookies().set('session', sessionCookie, {
      httpOnly: true,
      secure: true,
      maxAge: expiresIn,
      path: '/',
    });
    return NextResponse.json({status: 'success'});
  } catch (error) {
    return NextResponse.json({status: 'error'}, {status: 401});
  }
}
