import { prisma } from '../../shared/database/prisma.client';

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  totalScore: number;
  gamesPlayed: number;
  wins: number;
  averageScore: number;
  bestScore: number;
  lastPlayedAt: string;
};

type Accumulator = Omit<LeaderboardEntry, 'rank' | 'averageScore' | 'lastPlayedAt'> & {
  lastPlayedAt: Date;
};

const resolveDisplayName = (player: { displayUsername: string | null; username: string | null; name: string } | null): string => {
  if (!player) return 'Unknown';
  return player.displayUsername ?? player.username ?? player.name;
};

const buildParticipantKey = (userId: string | null, socketId: string): string => userId ?? socketId;

const buildFallbackName = (player: { displayUsername: string | null; username: string | null; name: string } | null, socketId: string): string => {
  if (player) return resolveDisplayName(player);
  return `Guest ${socketId.slice(0, 6)}`;
};

export const RankRepository = {
  getLeaderboard: async (limit = 30): Promise<LeaderboardEntry[]> => {
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const gameResults = await prisma.gameResult.findMany({
      select: {
        playedAt: true,
        winner: true,
        player1SocketId: true,
        player2SocketId: true,
        player1UserId: true,
        player2UserId: true,
        player1Score: true,
        player2Score: true,
        player1: {
          select: {
            name: true,
            username: true,
            displayUsername: true,
          },
        },
        player2: {
          select: {
            name: true,
            username: true,
            displayUsername: true,
          },
        },
      },
    });

    const stats = new Map<string, Accumulator>();

    for (const result of gameResults) {
      const rows: Array<{
        userId: string | null;
        socketId: string;
        score: number;
        player: { displayUsername: string | null; username: string | null; name: string } | null;
      }> = [
        {
          userId: result.player1UserId,
          socketId: result.player1SocketId,
          score: result.player1Score,
          player: result.player1,
        },
        {
          userId: result.player2UserId,
          socketId: result.player2SocketId,
          score: result.player2Score,
          player: result.player2,
        },
      ];

      for (const row of rows) {
        const participantKey = buildParticipantKey(row.userId, row.socketId);
        const existing = stats.get(participantKey);
        const didWin = result.winner === row.socketId;
        const displayName = buildFallbackName(row.player, row.socketId);

        if (!existing) {
          stats.set(participantKey, {
            userId: participantKey,
            displayName,
            totalScore: row.score,
            gamesPlayed: 1,
            wins: didWin ? 1 : 0,
            bestScore: row.score,
            lastPlayedAt: result.playedAt,
          });
          continue;
        }

        existing.totalScore += row.score;
        existing.gamesPlayed += 1;
        if (didWin) existing.wins += 1;
        existing.bestScore = Math.max(existing.bestScore, row.score);
        if (result.playedAt > existing.lastPlayedAt) existing.lastPlayedAt = result.playedAt;
      }
    }

    return Array.from(stats.values())
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
        return b.lastPlayedAt.getTime() - a.lastPlayedAt.getTime();
      })
      .slice(0, safeLimit)
      .map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId,
        displayName: entry.displayName,
        totalScore: entry.totalScore,
        gamesPlayed: entry.gamesPlayed,
        wins: entry.wins,
        averageScore: Number((entry.totalScore / entry.gamesPlayed).toFixed(2)),
        bestScore: entry.bestScore,
        lastPlayedAt: entry.lastPlayedAt.toISOString(),
      }));
  },
};
