'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import SplashScreen from './SplashScreen';

const PUBLIC_PATHS = ['/', '/login', '/signup'];
const AUTH_PATHS   = ['/login', '/signup'];

export default function PageLoader({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const isPublic   = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
  const isAuthPage = AUTH_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

  console.log('[PageLoader] loading:', loading, '| user:', user?.email ?? 'null', '| path:', pathname);

  useEffect(() => {
    if (loading) return;
    if (user && isAuthPage) {
      console.log('[PageLoader] user on auth page — redirecting to /dashboard');
      router.replace('/dashboard');
    } else if (!user && !isPublic) {
      console.log('[PageLoader] no user on protected page — redirecting to /login');
      router.replace('/login');
    }
  }, [user, loading, pathname]);

  const willRedirect = !loading && ((user && isAuthPage) || (!user && !isPublic));
  if (loading || willRedirect) {
    return <SplashScreen label="Authenticating" />;
  }

  return children;
}
