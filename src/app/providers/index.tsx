'use client';

import { ReduxProvider } from './ReduxProvider';
import { AuthProvider } from './AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ReduxProvider>
  );
}