import { createAuthClient } from 'better-auth/react';
import { usernameClient } from 'better-auth/client/plugins';
import { Platform } from 'react-native';

let plugins: any[] = [usernameClient()];

// Only use expoClient on native (iOS/Android), not on web
if (Platform.OS !== 'web') {
  try {
    const { expoClient } = require('@better-auth/expo/client');
    const SecureStore = require('expo-secure-store');
    plugins.push(expoClient({ storage: SecureStore }));
  } catch (e) {
    // Modules not available on web
  }
}

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000',
  fetchOptions: {
    credentials: 'include', // Always include cookies (on web: sends cross-domain, on native: ignored)
  },
  plugins,
});

export type Session = typeof authClient.$Infer.Session;
