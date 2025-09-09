// src/services/user-service.ts
'use server';

import { firestore, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, deleteObject, getDownloadURL } from "firebase/storage";
import { getAdminApp } from '@/lib/firebase-admin';
import { getStorage as getAdminStorage } from 'firebase-admin/storage';
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
        console.error("Invalid arguments for image deletion.", { userId, image });
        throw new Error("Invalid arguments for image deletion. User ID and the full image object with path are required.");
    }

    const userDocRef = doc(firestore, 'users', userId);

    try {
        // 1. Delete the file from Firebase Storage first.
        const storageRef = ref(storage, image.path);
        await deleteObject(storageRef);

        // 2. Remove the image from the Firestore gallery array.
        // This uses arrayRemove to atomically remove the matching object.
        await updateDoc(userDocRef, {
            gallery: arrayRemove(image)
        });

    } catch (error) {
        console.error("Error in deleteProfileImage service:", error);
        // If storage deletion fails, we don't proceed to Firestore update.
        // If Firestore update fails, the file is already gone, but the link remains.
        // This is a trade-off, but for this app, removing the file is the most important part.
        throw new Error("Failed to delete image on the server. Please try again.");
    }
}

/**
 * Adds the metadata of a newly uploaded gallery image to the user's Firestore document.
 * @param userId The ID of the user.
 * @param filePath The full path of the uploaded file in Firebase Storage.
 * @returns The new gallery image object that was added.
 */
export async function addGalleryImageReference(userId: string, filePath: string): Promise<GalleryImage> {
    if (!userId || !filePath) {
        throw new Error('User ID and file path are required.');
    }

    const storageRef = ref(storage, filePath);
    const downloadURL = await getDownloadURL(storageRef);

    const newImage: GalleryImage = {
        id: Date.now(),
        src: downloadURL,
        hint: 'custom upload',
        path: filePath,
    };

    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, {
        gallery: arrayUnion(newImage)
    });
    
    return newImage;
}
