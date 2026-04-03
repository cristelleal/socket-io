import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { initSocket } from './bootstrap/socket';
import { auth } from './modules/auth/auth';
import { RankRepository } from './modules/rank/rank.repository';

const normalizeOrigin = (origin: string): string =>
  origin
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\/$/, '');

const ALLOWED_ORIGINS = (
  process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(',')
    : ['http://localhost:8081', 'http://localhost:19006']
)
  .map(normalizeOrigin)
  .filter(Boolean);

const ALLOWED_ORIGIN_SET = new Set(ALLOWED_ORIGINS);

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);
      callback(null, ALLOWED_ORIGIN_SET.has(normalizedOrigin));
    },
    credentials: true,
  }),
);

// Auth routes must be registered BEFORE express.json()
// because Better Auth reads the raw body itself
app.all('/api/auth/*', toNodeHandler(auth));

app.get('/api/rank/leaderboard', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit ?? 30);
    const leaderboard = await RankRepository.getLeaderboard(Number.isNaN(limit) ? 30 : limit);
    res.json({ leaderboard, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[RankRepository] Failed to load leaderboard:', error);
    res.status(500).json({ leaderboard: [], generatedAt: new Date().toISOString() });
  }
});

app.use(express.json());

const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
