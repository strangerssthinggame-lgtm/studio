// src/app/actions.ts
"use server";

import { suggestPrompt, SuggestPromptInput } from "@/ai/flows/suggest-prompt";
import { FormSchema, FormState } from "@/lib/definitions";
import { revalidatePath } from 'next/cache';
import { adminApp } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import type { GalleryImage } from '@/lib/user-profile-data';


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
    if (!adminApp) {
        throw new Error('Firebase Admin SDK not initialized.');
    }
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file provided.');
    }

    const bucket = getStorage(adminApp).bucket();
    const firestore = getFirestore(adminApp);
    
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${file.name}`;
    const filePath = `users/${userId}/${imageType}s/${uniqueFileName}`;
    
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileUpload = bucket.file(filePath);

    await fileUpload.save(buffer, {
        metadata: {
            contentType: file.type,
        },
    });

    const downloadURL = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-09-2491', // A very long-lived URL
    }).then(urls => urls[0]);

    const userDocRef = firestore.collection('users').doc(userId);

    if (imageType === 'gallery') {
        const newImage: GalleryImage = {
            id: Date.now(),
            src: downloadURL,
            hint: 'custom upload',
            path: filePath,
        };
        await userDocRef.update({
            gallery: admin.firestore.FieldValue.arrayUnion(newImage)
        });
    } else {
        const fieldToUpdate = imageType === 'avatar' ? 'photoURL' : 'banner';
        const secondField = imageType === 'avatar' ? 'avatar' : 'banner';
        await userDocRef.update({ 
            [fieldToUpdate]: downloadURL,
            [secondField]: downloadURL
        });
    }

    revalidatePath('/profile');
    revalidatePath(`/users/${userId}`);

    return { success: true, url: downloadURL };
}
