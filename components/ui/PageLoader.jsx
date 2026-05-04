'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import SplashScreen from './SplashScreen';

export default function PageLoader({ children }) {
  const { loading, user } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // Show splash if: auth is resolving OR user is logged in but still on login/signup (mid-redirect)
  if (loading || (user && isAuthPage)) {
    return <SplashScreen label="Authenticating" />;
  }

  return children;
}
