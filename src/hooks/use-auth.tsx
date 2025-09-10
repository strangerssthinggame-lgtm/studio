
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isNewUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isNewUser: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
           // This is a new user
           setIsNewUser(true);
           try {
             await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName || 'New User',
              name: user.displayName || 'New User',
              username: `@${user.displayName?.toLowerCase().replace(/\s/g, '') || `user${user.uid.substring(0,5)}`}`,
              email: user.email,
              photoURL: user.photoURL || `https://picsum.photos/seed/${user.uid}/400/400`,
              avatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/400/400`,
              banner: `https://picsum.photos/seed/${user.uid}-banner/800/600`,
              createdAt: serverTimestamp(),
              lastSeen: serverTimestamp(),
              bio: '',
              location: '',
              interests: [],
              vibes: [],
              photos: [],
              availability: 'Not specified',
              profileComplete: false,
              preferences: { minAge: 18, maxAge: 40, maxDistance: 100 },
              liked: [],
              passed: [],
              matches: [],
            });
           } catch (error) {
            console.error("Error creating user document: ", error)
           }
        } else {
            // Existing user, check if profile is complete
            const profileData = docSnap.data();
            setIsNewUser(profileData.profileComplete === false);
        }
        setUser(user);
      } else {
        setUser(null);
        setIsNewUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isNewUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

    