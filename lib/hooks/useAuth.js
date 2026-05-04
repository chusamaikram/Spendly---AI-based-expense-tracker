'use client';
 
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, handleGoogleRedirectResult } from '../firebase/auth';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let unsub;

    const init = async () => {
      try {
        // Wait for redirect result first — this is what sets the user
        // after returning from Google. Must complete before we subscribe
        // to onAuthStateChanged, otherwise auth state fires with null first.
        await handleGoogleRedirectResult();
      } catch (_) {}

      unsub = onAuthChange((u) => {
        setUser(u);
        setLoading(false);
      });
    };

    init();
    return () => unsub?.();
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