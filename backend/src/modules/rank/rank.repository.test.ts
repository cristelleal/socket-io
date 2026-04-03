import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findManyMock } = vi.hoisted(() => ({
  findManyMock: vi.fn(),
}));

vi.mock('../../shared/database/prisma.client', () => ({
  prisma: {
    gameResult: {
      findMany: findManyMock,
    },
  },
}));

import { RankRepository } from './rank.repository';

describe('RankRepository.getLeaderboard', () => {
  beforeEach(() => {
    findManyMock.mockReset();
  });

  it('aggregates, ranks and formats leaderboard entries', async () => {
    findManyMock.mockResolvedValue([
      {
        playedAt: new Date('2026-01-01T10:00:00.000Z'),
        winner: 'socket-a',
        player1SocketId: 'socket-a',
        player2SocketId: 'socket-b',
        player1UserId: 'user-1',
        player2UserId: null,
        player1Score: 10,
        player2Score: 5,
        player1: { name: 'Alice Name', username: 'alice', displayUsername: 'Alice D' },
        player2: null,
      },
      {
        playedAt: new Date('2026-02-01T10:00:00.000Z'),
        winner: 'socket-c',
        player1SocketId: 'socket-a',
        player2SocketId: 'socket-c',
        player1UserId: 'user-1',
        player2UserId: 'user-2',
        player1Score: 20,
        player2Score: 30,
        player1: { name: 'Alice Name', username: 'alice', displayUsername: null },
        player2: { name: 'Bob Name', username: null, displayUsername: null },
      },
    ]);

    const leaderboard = await RankRepository.getLeaderboard(30);

    expect(leaderboard).toHaveLength(3);

    expect(leaderboard[0]).toEqual({
      rank: 1,
      userId: 'user-1',
      displayName: 'Alice D',
      totalScore: 30,
      gamesPlayed: 2,
      wins: 1,
      averageScore: 15,
      bestScore: 20,
      lastPlayedAt: '2026-02-01T10:00:00.000Z',
    });

    expect(leaderboard[1]).toEqual({
      rank: 2,
      userId: 'user-2',
      displayName: 'Bob Name',
      totalScore: 30,
      gamesPlayed: 1,
      wins: 1,
      averageScore: 30,
      bestScore: 30,
      lastPlayedAt: '2026-02-01T10:00:00.000Z',
    });

    expect(leaderboard[2]).toMatchObject({
      rank: 3,
      userId: 'socket-b',
      displayName: 'Guest socket',
      totalScore: 5,
      gamesPlayed: 1,
      wins: 0,
      averageScore: 5,
      bestScore: 5,
    });
  });

  it('clamps limit to at least 1', async () => {
    findManyMock.mockResolvedValue([
      {
        playedAt: new Date('2026-01-01T10:00:00.000Z'),
        winner: 's1',
        player1SocketId: 's1',
        player2SocketId: 's2',
        player1UserId: 'u1',
        player2UserId: 'u2',
        player1Score: 12,
        player2Score: 10,
        player1: { name: 'A', username: null, displayUsername: null },
        player2: { name: 'B', username: null, displayUsername: null },
      },
    ]);

    const leaderboard = await RankRepository.getLeaderboard(0);

    expect(leaderboard).toHaveLength(1);
    expect(leaderboard[0].rank).toBe(1);
  });
});
