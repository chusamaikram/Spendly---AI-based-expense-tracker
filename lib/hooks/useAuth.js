'use client';
 
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, getGoogleRedirectResult } from '../firebase/auth';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    // Start auth listener immediately — this is the source of truth
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });

    // Handle redirect result in parallel (for signInWithRedirect fallback)
    // onAuthStateChanged will fire automatically after redirect resolves
    getGoogleRedirectResult().catch(() => {});

    return () => unsub();
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