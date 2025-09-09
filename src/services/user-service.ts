
// src/services/user-service.ts
'use server';

import { firestore, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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
 * @param type - The type of image ('avatar', 'banner').
 * @returns An object containing the download URL and the storage path of the uploaded file.
 */
export async function uploadProfileImage(userId: string, formData: FormData): Promise<{ downloadURL: string; filePath: string }> {
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'avatar' | 'banner'; // Gallery handled by addGalleryImage

    if (!file || !userId || !type) {
        throw new Error("Invalid arguments for image upload.");
    }
    
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    let filePath = `users/${userId}/${type}s/${fileName}`;

    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { downloadURL, filePath };
}

/**
 * Uploads a gallery image and updates the user's Firestore document in one operation.
 * @param userId The ID of the user.
 * @param formData The form data containing the file.
 * @returns The new gallery image object that was added.
 */
export async function addGalleryImage(userId: string, formData: FormData): Promise<GalleryImage> {
    const file = formData.get('file') as File;
    if (!file || !userId) {
        throw new Error("Invalid arguments for gallery image upload.");
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `users/${userId}/gallery/${fileName}`;

    // 1. Upload to Storage
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 2. Prepare Firestore object
    const newImage: GalleryImage = {
        id: timestamp,
        src: downloadURL,
        hint: 'custom upload',
        path: filePath,
    };
    
    // 3. Update Firestore
    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, {
        gallery: arrayUnion(newImage)
    });
    
    return newImage;
}


/**
 * Updates a user's profile data in Firestore.
 * @param userId - The ID of the user to update.
 * @param data - An object containing the fields to update.
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
 * @param imageId - The ID of the gallery image to delete.
 */
export async function deleteProfileImage(userId: string, imageId: number): Promise<void> {
     if (!userId || !imageId) {
        throw new Error("Invalid arguments for image deletion. User ID and Image ID are required.");
    }

    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        throw new Error("User not found.");
    }

    const userData = userDoc.data() as UserProfile;
    const imageToDelete = userData.gallery.find(img => img.id === imageId);

    if (!imageToDelete) {
        console.warn(`Image with ID ${imageId} not found in user's gallery.`);
        return; // Or throw an error if this should be a critical failure
    }
    
    // 1. Delete the file from Firebase Storage
    const storageRef = ref(storage, imageToDelete.path);
    await deleteObject(storageRef);

    // 2. Remove the image object from the 'gallery' array in Firestore
    // Using the exact object fetched from Firestore ensures arrayRemove works.
    await updateDoc(userDocRef, {
        gallery: arrayRemove(imageToDelete)
    });
}
