
// src/services/user-service.ts
'use server';

import { firestore, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import type { UserProfile, GalleryImage } from '@/lib/user-profile-data';

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
 * Uploads an image to Firebase Storage for a specific user.
 * @param userId - The ID of the user.
 * @param file - The image file to upload.
 * @param type - The type of image ('avatar', 'banner', 'gallery').
 * @returns An object containing the download URL and the storage path of the uploaded file.
 */
export async function uploadProfileImage(userId: string, formData: FormData): Promise<{ downloadURL: string; filePath: string }> {
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'avatar' | 'banner' | 'gallery';

    if (!file || !userId || !type) {
        throw new Error("Invalid arguments for image upload.");
    }
    
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    let filePath = `users/${userId}/`;

    if (type === 'gallery') {
        filePath += `gallery/${fileName}`;
    } else {
        filePath += `${type}s/${fileName}`; // e.g., 'avatars' or 'banners'
    }

    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { downloadURL, filePath };
}


/**
 * Updates a user's profile data in Firestore.
 * @param userId - The ID of the user to update.
 * @param data - An object containing the fields to update. Can handle arrayUnion.
 */
export async function updateUserProfile(userId: string, data: Record<string, any>): Promise<void> {
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
        throw new Error("Invalid arguments for image deletion.");
    }
    
    // 1. Delete the file from Firebase Storage
    const storageRef = ref(storage, image.path);
    await deleteObject(storageRef);

    // 2. Remove the image object from the 'gallery' array in Firestore
    // We create an object without the 'path' to ensure it matches what's in Firestore.
    const imageToRemoveFromFirestore = {
        id: image.id,
        src: image.src,
        hint: image.hint,
    };
    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, {
        gallery: arrayRemove(imageToRemoveFromFirestore)
    });
}

    