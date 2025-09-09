// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// The service account is now expected to be in a single environment variable.
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  : undefined;

let adminApp: admin.app.App;

if (admin.apps.length > 0) {
  adminApp = admin.apps[0]!;
} else {
  if (!serviceAccount) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set. Cannot initialize Firebase Admin SDK.');
  }
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export function getAdminApp() {
  return adminApp;
}
