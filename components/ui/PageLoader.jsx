'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import SplashScreen from './SplashScreen';

export default function PageLoader({ children }) {
  const { loading } = useAuth();
  const pathname = usePathname();

  if (!loading) return children;

  const label =
    pathname === '/' ? 'Loading content' :
    pathname.startsWith('/login') || pathname.startsWith('/signup') ? 'Authenticating' :
    'Loading dashboard';

  return <SplashScreen label={label} />;
}
