import { useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange } from '../lib/firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
};
