import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { username } from 'better-auth/plugins';
import { prisma } from '../../shared/database/prisma.client';

const normalizeOrigin = (origin: string): string =>
  origin
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\/$/, '');

const trustedOrigins = (
  process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(',')
    : ['http://localhost:8081', 'http://localhost:19006']
)
  .map(normalizeOrigin)
  .filter(Boolean);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  plugins: [username()],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
});
