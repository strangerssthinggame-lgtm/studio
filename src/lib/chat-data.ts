
import type { Timestamp } from 'firebase/firestore';

export type Chat = {
  id: string;
  userIds: string[];
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
  vibe: 'date' | 'friends' | 'spicy';
  // 'online' and 'unread' will be managed client-side or with more complex logic (e.g., presence)
};
