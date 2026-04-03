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

const getBaseURL = (): string => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // On web, use EXPO_PUBLIC_API_URL (local dev) or current origin (Vercel, proxied via vercel.json)
    return process.env.EXPO_PUBLIC_API_URL ?? window.location.origin;
  }
  return process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: 'include',
  },
  plugins,
});

export type Session = typeof authClient.$Infer.Session;
