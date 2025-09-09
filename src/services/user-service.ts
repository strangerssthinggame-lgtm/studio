// src/services/user-service.ts
'use server';

import { firestore, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, deleteObject, getDownloadURL, uploadBytes } from "firebase/storage";
import type { UserProfile, GalleryImage } from '@/lib/user-profile-data';
import { revalidatePath } from 'next/cache';


/**
 * Fetches a user's profile from Firestore.
 * @param userId - The ID of the user to fetch.
 * @returns The user's profile data or null if not found.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const userDocRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    } else {
        console.warn(`No profile found for user ID: ${userId}`);
        return null;
    }
}

/**
 * Updates a user's profile data in Firestore.
 * @param userId - The ID of the user to update.
 * @param data - An object containing the fields to update.
 */
export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    if (!userId) {
        throw new Error("User ID is required to update a profile.");
    }
    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, data);
}


/**
 * Deletes an image from Firebase Storage and removes it from the user's gallery in Firestore.
 * @param userId - The ID of the user.
 * @param image - The gallery image object to delete.
 */
export async function deleteProfileImage(userId: string, image: GalleryImage): Promise<void> {
    if (!userId || !image || !image.path) {
        throw new Error("Invalid arguments for image deletion. User ID and the full image object with path are required.");
    }

    const userDocRef = doc(firestore, 'users', userId);
    const imageRef = ref(storage, image.path);

    try {
        // 1. Delete the file from Firebase Storage.
        await deleteObject(imageRef);

        // 2. Remove the image reference from the Firestore gallery array.
        await updateDoc(userDocRef, {
            gallery: arrayRemove(image)
        });

        // 3. Revalidate the profile path to ensure the UI updates.
        revalidatePath('/profile');
        revalidatePath(`/users/${userId}`);

    } catch (error) {
        console.error("Error in deleteProfileImage service:", error);
        throw new Error("Failed to delete image on the server. Please try again.");
    }
}

/**
 * Uploads an image for a user's profile (avatar, banner, or gallery)
 * and updates the corresponding Firestore document.
 * @param userId The ID of the user.
 * @param imageType The type of image being uploaded.
 * @param formData The FormData containing the file.
 * @returns The new public URL of the uploaded image.
 */
export async function uploadProfileImage(userId: string, imageType: 'avatar' | 'banner' | 'gallery', formData: FormData): Promise<string> {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file provided in FormData.');
    }

    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${file.name}`;
    const filePath = `users/${userId}/${imageType}s/${uniqueFileName}`;
    const storageRef = ref(storage, filePath);

    // Upload the file buffer to Firebase Storage
    const fileBuffer = await file.arrayBuffer();
    const snapshot = await uploadBytes(storageRef, fileBuffer, {
        contentType: file.type,
    });
    
    // Get the public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    const userDocRef = doc(firestore, 'users', userId);

    // Update the user's Firestore document
    if (imageType === 'gallery') {
        const newImage: GalleryImage = {
            id: Date.now(),
            src: downloadURL,
            hint: 'custom upload',
            path: filePath,
        };
        await updateDoc(userDocRef, {
            gallery: arrayUnion(newImage)
        });
    } else {
        const fieldToUpdate = imageType === 'avatar' ? 'photoURL' : 'banner';
        const secondField = imageType === 'avatar' ? 'avatar' : 'banner';
        await updateDoc(userDocRef, { [fieldToUpdate]: downloadURL, [secondField]: downloadURL });
    }
    
    // Revalidate the profile path to ensure the UI updates with the new image.
    revalidatePath('/profile');
    revalidatePath(`/users/${userId}`);

    return downloadURL;
}
