import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
}));

vi.mock('../../shared/database/prisma.client', () => ({
  prisma: {
    gameResult: {
      create: createMock,
    },
  },
}));

import { GameRepository } from './game.repository';

describe('GameRepository.saveResult', () => {
  beforeEach(() => {
    createMock.mockReset();
    createMock.mockResolvedValue(undefined);
  });

  it('persists a complete game result', async () => {
    await GameRepository.saveResult({
      player1SocketId: 'socket-a',
      player2SocketId: 'socket-b',
      player1UserId: 'user-1',
      player2UserId: 'user-2',
      player1Score: 12,
      player2Score: 8,
      winner: 'socket-a',
      endReason: 'ALIGNMENT',
    });

    expect(createMock).toHaveBeenCalledWith({
      data: {
        player1SocketId: 'socket-a',
        player2SocketId: 'socket-b',
        player1UserId: 'user-1',
        player2UserId: 'user-2',
        player1Score: 12,
        player2Score: 8,
        winner: 'socket-a',
        endReason: 'ALIGNMENT',
      },
    });
  });

  it('stores null for missing user ids', async () => {
    await GameRepository.saveResult({
      player1SocketId: 'socket-a',
      player2SocketId: 'socket-b',
      player1Score: 3,
      player2Score: 5,
      winner: 'socket-b',
      endReason: 'TIMEOUT',
    });

    expect(createMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        player1UserId: null,
        player2UserId: null,
        endReason: 'TIMEOUT',
      }),
    });
  });
});
