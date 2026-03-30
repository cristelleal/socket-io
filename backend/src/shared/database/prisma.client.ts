import { PrismaClient } from '../../generated/prisma/client';

// Single shared instance across the entire app.
// Prevents connection pool exhaustion from multiple PrismaClient instances.
export const prisma = new PrismaClient();
