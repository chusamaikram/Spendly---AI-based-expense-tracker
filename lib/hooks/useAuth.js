'use client';
 
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '../firebase/auth';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const unsub = onAuthChange((u) => {
      console.log('[Auth] onAuthStateChanged:', u?.email ?? 'null');
      setUser(u);
      setLoading(false);
    });
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