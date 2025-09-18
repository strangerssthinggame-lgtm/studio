
// src/ai/flows/handle-swipe-flow.ts
'use server';
/**
 * @fileOverview A flow that handles the user swipe action and checks for a match.
 *
 * - handleSwipe - A function that processes a swipe and returns if a match occurred.
 * - HandleSwipeInput - The input type for the handleSwipe function.
 * - HandleSwipeOutput - The return type for the handleSwipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, setDoc, doc, updateDoc, getDoc } from 'firebase/firestore';


const HandleSwipeInputSchema = z.object({
  swiperId: z.string().describe("The ID of the user performing the swipe."),
  swipedId: z.string().describe("The ID of the user being swiped on."),
  direction: z.enum(['left', 'right']).describe("The direction of the swipe."),
});
export type HandleSwipeInput = z.infer<typeof HandleSwipeInputSchema>;

const HandleSwipeOutputSchema = z.object({
    isMatch: z.boolean().describe("Whether the swipe resulted in a match."),
    matchId: z.string().optional().describe("The ID of the match document if a match occurred."),
});
export type HandleSwipeOutput = z.infer<typeof HandleSwipeOutputSchema>;

export async function handleSwipe(input: HandleSwipeInput): Promise<HandleSwipeOutput> {
  return handleSwipeFlow(input);
}

const handleSwipeFlow = ai.defineFlow(
  {
    name: 'handleSwipeFlow',
    inputSchema: HandleSwipeInputSchema,
    outputSchema: HandleSwipeOutputSchema,
  },
  async ({ swiperId, swipedId, direction }) => {
    // 1. Record the swipe action in the 'swipes' collection
    const swipesCollection = collection(firestore, 'swipes');
    await addDoc(swipesCollection, {
      swiperId,
      swipedId,
      direction,
      timestamp: serverTimestamp(),
    });

    // 2. If it's a right swipe, check for a mutual like (a match)
    if (direction === 'right') {
      const q = query(
        swipesCollection,
        where('swiperId', '==', swipedId),
        where('swipedId', '==', swiperId),
        where('direction', '==', 'right')
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // It's a match!
        console.log(`Match found between ${swiperId} and ${swipedId}!`);

        // 3. Create a document in the 'matches' collection
        const matchesCollection = collection(firestore, 'matches');
        const matchDoc = await addDoc(matchesCollection, {
            userIds: [swiperId, swipedId],
            matchedAt: serverTimestamp(),
        });
        
        // 4. Create a chat document for the new match.
        // The document ID is the same as the match ID for easy reference.
        const chatDocRef = doc(firestore, 'chats', matchDoc.id);
        await setDoc(chatDocRef, {
            id: matchDoc.id,
            userIds: [swiperId, swipedId],
            lastMessage: "You matched! Start with a Vibe Check.",
            lastMessageTimestamp: serverTimestamp(),
            vibe: 'date', // Default vibe for new matches
        });

        // 5. Update the 'matches' array for both users
        const swiperUserRef = doc(firestore, 'users', swiperId);
        const swipedUserRef = doc(firestore, 'users', swipedId);
        
        // We get the current user data to append the new match
        const swiperDoc = await getDoc(swiperUserRef);
        const swipedDoc = await getDoc(swipedUserRef);
        
        if (swiperDoc.exists()) {
            const swiperData = swiperDoc.data();
            await updateDoc(swiperUserRef, {
                matches: [...(swiperData.matches || []), swipedId]
            });
        }
        if (swipedDoc.exists()) {
            const swipedData = swipedDoc.data();
             await updateDoc(swipedUserRef, {
                matches: [...(swipedData.matches || []), swiperId]
            });
        }


        return { isMatch: true, matchId: matchDoc.id };
      }
    }

    // No match found or it was a left swipe
    return { isMatch: false };
  }
);
