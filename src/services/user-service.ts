
// src/services/user-service.ts
'use server';

import { firestore, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
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
 * Uploads an image to Firebase Storage for a specific user using a Base64 data URI.
 * @param userId - The ID of the user.
 * @param base64 - The image file as a Base64 data URI string.
 * @param fileName - The original name of the file.
 * @param type - The type of image ('avatar', 'banner').
 * @returns An object containing the download URL and the storage path of the uploaded file.
 */
export async function uploadProfileImage(
    userId: string,
    base64: string,
    fileName: string,
    type: 'avatar' | 'banner'
): Promise<{ downloadURL: string; filePath: string }> {
    if (!base64 || !userId || !type) {
        throw new Error("Invalid arguments for image upload.");
    }
    
    // Extract content type and base64 data from the data URI
    const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/);
    if (!match) {
        throw new Error('Invalid Base64 string format.');
    }
    const contentType = match[1];
    const base64Data = match[2];
    
    // Convert base64 to a Buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    const filePath = `users/${userId}/${type}s/${uniqueFileName}`;
    const storageRef = ref(storage, filePath);
    
    const snapshot = await uploadBytes(storageRef, buffer, { contentType });
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { downloadURL, filePath };
}


/**
 * Uploads a gallery image from a Base64 string and updates the user's Firestore document.
 * @param userId The ID of the user.
 * @param base64 The image file as a Base64 data URI string.
 * @param fileName The original name of the file.
 * @returns The new gallery image object that was added.
 */
export async function addGalleryImage(
    userId: string,
    base64: string,
    fileName: string,
): Promise<GalleryImage> {
    if (!base64 || !userId) {
        throw new Error("Invalid arguments for gallery image upload.");
    }

    const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/);
    if (!match) {
        throw new Error('Invalid Base64 string format.');
    }
    const contentType = match[1];
    const base64Data = match[2];
    
    const buffer = Buffer.from(base64Data, 'base64');
    
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    const filePath = `users/${userId}/gallery/${uniqueFileName}`;

    // 1. Upload to Storage
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, buffer, { contentType });
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

        // 2. Fetch the current user document to get the gallery array.
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            throw new Error("User document not found.");
        }
        const userData = userDoc.data() as UserProfile;
        
        // 3. Filter out the image to be deleted from the gallery.
        const updatedGallery = userData.gallery.filter(photo => photo.id !== image.id);

        // 4. Update the document with the new, filtered gallery array.
        await updateDoc(userDocRef, {
            gallery: updatedGallery
        });

    } catch (error) {
        console.error("Error in deleteProfileImage service:", error);
        // If storage deletion fails, we don't proceed to Firestore update.
        // If Firestore update fails, the file is already gone, but the link remains.
        // This is a trade-off, but for this app, removing the file is the most important part.
        throw new Error("Failed to delete image on the server. Please try again.");
    }
}

    