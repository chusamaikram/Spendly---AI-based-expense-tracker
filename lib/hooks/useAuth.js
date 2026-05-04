'use client';
 
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, getGoogleRedirectResult } from '../firebase/auth';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let unsub;

    const init = async () => {
      // Step 1: check for redirect result FIRST
      console.log('[Auth] Starting init...');
      try {
        const result = await getGoogleRedirectResult();
        console.log('[Auth] getRedirectResult resolved:', result?.user?.email ?? 'null');
      } catch (err) {
        console.error('[Auth] getRedirectResult error:', err.code, err.message);
      }

      // Step 2: NOW subscribe to auth state — Firebase has processed redirect by this point
      console.log('[Auth] Subscribing to onAuthStateChanged...');
      unsub = onAuthChange((u) => {
        console.log('[Auth] onAuthStateChanged fired — user:', u?.email ?? 'null');
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