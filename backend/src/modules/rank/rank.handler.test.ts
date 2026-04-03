import { describe, expect, it, vi } from 'vitest';

const { getLeaderboardMock } = vi.hoisted(() => ({
  getLeaderboardMock: vi.fn(),
}));

vi.mock('./rank.repository', () => ({
  RankRepository: {
    getLeaderboard: getLeaderboardMock,
  },
}));

import { registerRankHandlers } from './rank.handler';

type MockSocket = {
  on: ReturnType<typeof vi.fn>;
  emit: ReturnType<typeof vi.fn>;
};

const createMockSocket = (): MockSocket => ({
  on: vi.fn(),
  emit: vi.fn(),
});

describe('registerRankHandlers', () => {
  it('responds with leaderboard data when repository succeeds', async () => {
    const socket = createMockSocket();
    const leaderboard = [{ rank: 1, userId: 'u1' }];

    getLeaderboardMock.mockResolvedValue(leaderboard);

    registerRankHandlers(socket as any);

    const handler = socket.on.mock.calls.find((call) => call[0] === 'leaderboard.request')?.[1];

    expect(handler).toBeTypeOf('function');

    await handler({ limit: 10 });

    expect(getLeaderboardMock).toHaveBeenCalledWith(10);
    expect(socket.emit).toHaveBeenCalledWith(
      'leaderboard.data',
      expect.objectContaining({
        leaderboard,
        generatedAt: expect.any(String),
      }),
    );
  });

  it('responds with empty leaderboard when repository fails', async () => {
    const socket = createMockSocket();

    getLeaderboardMock.mockRejectedValue(new Error('db down'));

    registerRankHandlers(socket as any);

    const handler = socket.on.mock.calls.find((call) => call[0] === 'leaderboard.request')?.[1];

    await handler({ limit: 10 });

    expect(socket.emit).toHaveBeenCalledWith(
      'leaderboard.data',
      expect.objectContaining({
        leaderboard: [],
        generatedAt: expect.any(String),
      }),
    );
  });
});
