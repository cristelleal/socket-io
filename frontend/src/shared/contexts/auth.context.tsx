import React, { createContext, useContext } from 'react';
import { authClient, Session } from '../lib/auth.client';

type AuthContextValue = {
  session: Session | null;
  isPending: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut();
  };

  return (
    <AuthContext.Provider value={{ session: session ?? null, isPending, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
