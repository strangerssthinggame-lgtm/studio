// src/app/api/upload-url/route.ts
import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';

// Ensure the admin app is initialized
getAdminApp();

export async function POST(request: Request) {
  try {
    const { fileName, fileType, userId, imageType } = await request.json();

    if (!fileName || !fileType || !userId || !imageType) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const bucket = getStorage().bucket();
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    const filePath = `users/${userId}/${imageType}s/${uniqueFileName}`;
    const file = bucket.file(filePath);

    // Set a timeout for the signed URL. 15 minutes should be plenty.
    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: fileType,
    };

    const [url] = await file.getSignedUrl(options);

    return NextResponse.json({ url, filePath }, { status: 200 });
  } catch (error) {
    console.error('Error creating signed URL:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to create signed URL.', details: errorMessage }, { status: 500 });
  }
}
