'use client';
 
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, getGoogleRedirectResult } from '../firebase/auth';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
 
  useEffect(() => {
    let authUnsubscribe;
    let redirectHandled = false;

    getGoogleRedirectResult()
      .then(result => {
        if (result?.user) redirectHandled = true;
      })
      .catch(() => {})
      .finally(() => {
        authUnsubscribe = onAuthChange((u) => {
          setUser(u);
          if (u && redirectHandled) {
            // came back from Google redirect — navigate then clear loading
            router.push('/dashboard');
            // keep loading=true until navigation completes
            router.prefetch('/dashboard');
          } else {
            setLoading(false);
          }
        });
      });

    return () => authUnsubscribe?.();
  }, []);
 
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};