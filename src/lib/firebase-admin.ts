// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// The service account is now expected to be in a single environment variable.
// Since this is not set, we will use a simplified initialization
// to prevent the server from crashing.
// In a production environment with server-side actions, this would need
// to be configured correctly with service account credentials.
if (!admin.apps.length) {
  try {
    // Attempt a default initialization. This may work in some environments.
    // If not, server-side admin features will be disabled but the app won't crash.
    admin.initializeApp({
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.warn("Firebase Admin initialization failed. Server-side admin features may be unavailable.", error.message);
  }
}

export const adminApp = admin.apps.length > 0 ? admin.apps[0] : null;
