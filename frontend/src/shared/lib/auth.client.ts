import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { usernameClient } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000',
  plugins: [
    expoClient({ storage: SecureStore }), // handles secure token storage on device
    usernameClient(),                     // enables username-based sign-in
  ],
});

export type Session = typeof authClient.$Infer.Session;
