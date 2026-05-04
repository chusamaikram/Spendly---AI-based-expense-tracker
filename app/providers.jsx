'use client';

import { AuthProvider } from '../lib/hooks/useAuth';
import { ExpensesProvider } from '../lib/hooks/useExpenses';
import PageLoader from '../components/ui/PageLoader';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <PageLoader>
        <ExpensesProvider>
          {children}
        </ExpensesProvider>
      </PageLoader>
    </AuthProvider>
  );
}
