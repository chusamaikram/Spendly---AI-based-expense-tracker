'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import SplashScreen from './SplashScreen';

const PUBLIC_PATHS  = ['/', '/login', '/signup'];
const AUTH_PATHS    = ['/login', '/signup'];

export default function PageLoader({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const isPublic  = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
  const isAuthPage = AUTH_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

  useEffect(() => {
    if (loading) return;
    if (user && isAuthPage) {
      router.replace('/dashboard');
    } else if (!user && !isPublic) {
      router.replace('/login');
    }
  }, [user, loading, pathname]);

  // Show splash while: resolving auth OR about to redirect
  const willRedirect = !loading && ((user && isAuthPage) || (!user && !isPublic));
  if (loading || willRedirect) {
    return <SplashScreen label="Authenticating" />;
  }

  return children;
}
