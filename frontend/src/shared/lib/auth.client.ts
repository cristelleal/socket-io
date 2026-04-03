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
    const origin = window.location.origin;
    // In local dev, route directly to backend
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';
    }
    // In production (Vercel), use same origin — vercel.json rewrites /api/* to backend
    return origin;
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
