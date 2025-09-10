// src/app/actions.ts
"use server";

import { suggestPrompt, SuggestPromptInput } from "@/ai/flows/suggest-prompt";
import { FormSchema, FormState } from "@/lib/definitions";
import { revalidatePath } from 'next/cache';
import { adminApp } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';


export async function getSuggestedPrompt(
  input: SuggestPromptInput,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    vibeTags: formData.getAll("vibeTags"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await suggestPrompt({
      previousInteractions: input.previousInteractions,
      vibeTags: validatedFields.data.vibeTags,
    });
    return {
      message: "Suggestion generated successfully.",
      suggestedPrompt: result.suggestedPrompt,
    };
  } catch (error) {
    return {
      message: "An error occurred while generating the suggestion.",
    };
  }
}

export async function uploadProfileImage(userId: string, imageType: 'avatar' | 'banner' | 'gallery', formData: FormData) {
    if (!admin.apps.length) {
        throw new Error('Firebase Admin SDK not initialized.');
    }
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file provided.');
    }

    const bucket = getStorage().bucket();
    const firestore = getFirestore();
    
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${file.name}`;
    let filePath;

    // A simple path for all user uploads
    filePath = `uploads/${userId}/${uniqueFileName}`;
    
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileUpload = bucket.file(filePath);

    await fileUpload.save(buffer, {
        metadata: {
            contentType: file.type,
        },
    });

    // Make the file public to get a predictable URL
    await fileUpload.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    const userDocRef = firestore.collection('users').doc(userId);

    if (imageType === 'gallery') {
        await userDocRef.update({
            photos: admin.firestore.FieldValue.arrayUnion(publicUrl)
        });
    } else {
        const fieldToUpdate = imageType === 'avatar' ? 'photoURL' : 'banner';
        const secondField = imageType === 'avatar' ? 'avatar' : 'banner';
        await userDocRef.set({ 
            [fieldToUpdate]: publicUrl,
            [secondField]: publicUrl
        }, { merge: true });
    }

    revalidatePath('/profile');
    revalidatePath(`/users/${userId}`);

    return { success: true, url: publicUrl };
}