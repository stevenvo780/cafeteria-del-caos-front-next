'use client';

import { Provider } from 'react-redux';
import store from '@/redux/store';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import InfoAlert from '@/components/InfoAlert';

function AuthStateProvider({ children }: { children: React.ReactNode }) {
  useFirebaseAuth();
  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthStateProvider>
        {children}
        <InfoAlert />
      </AuthStateProvider>
    </Provider>
  );
}