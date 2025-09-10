// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// The service account is now expected to be in a single environment variable.
const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

if (!admin.apps.length) {
  if (!serviceAccountKey) {
    console.warn('GOOGLE_APPLICATION_CREDENTIALS_JSON is not set for Admin SDK. Server-side actions may fail.');
  } else {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (error: any) {
        console.error("Firebase Admin initialization error: ", error.message);
    }
  }
}

export const adminApp = admin.apps.length > 0 ? admin.apps[0] : null;
