
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { firestore } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

export type Message = {
    id: string;
    text?: string;
    senderId: string;
    timestamp: Timestamp;
    sender: 'me' | 'them'; // This will be determined on the client
    type?: 'question' | 'answer' | 'challenge' | 'system';
    challenge?: {
        truth: string;
        dare: string;
        isResponded: boolean;
        choice?: 'truth' | 'dare';
    }
};


export const useChatMessages = (chatId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !chatId) {
        setMessages([]);
        setLoading(false);
        return;
    };

    setLoading(true);

    const messagesCollectionRef = collection(firestore, 'chats', chatId, 'messages');
    const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          sender: data.senderId === user.uid ? 'me' : 'them',
        } as Message;
      });
      setMessages(newMessages);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, user]);

  return { messages, loading };
};
