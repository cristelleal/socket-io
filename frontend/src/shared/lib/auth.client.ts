import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { usernameClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000',
  plugins: [
    expoClient(),      // handles secure token storage on device
    usernameClient(),  // enables username-based sign-in
  ],
});

export type Session = typeof authClient.$Infer.Session;
