import { beforeEach, describe, expect, it, vi } from 'vitest';
import { newPlayerInQueue } from './matchmaking.service';
import { games, queue } from '../../shared/state';
import {
  updateClientsViewDecks,
  updateClientsViewGrid,
  updateClientsViewTimers,
} from '../game/game.emitter';
import { endGame } from '../game/game.actions';

vi.mock('../game/game.emitter', () => ({
  updateClientsViewTimers: vi.fn(),
  updateClientsViewDecks: vi.fn(),
  updateClientsViewGrid: vi.fn(),
}));

vi.mock('../game/game.actions', () => ({
  endTurn: vi.fn(),
  endGame: vi.fn(),
}));

type EventHandlerMap = Record<string, () => void>;

type MockSocket = {
  id: string;
  emit: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  handlers: EventHandlerMap;
};

const createMockSocket = (id: string): MockSocket => {
  const handlers: EventHandlerMap = {};

  return {
    id,
    emit: vi.fn(),
    on: vi.fn((event: string, handler: () => void) => {
      handlers[event] = handler;
    }),
    handlers,
  };
};

const createPlayer = (socketId: string) => {
  const socket = createMockSocket(socketId);
  return {
    socket,
    username: `user-${socketId}`,
  };
};

beforeEach(() => {
  queue.length = 0;
  games.length = 0;
  vi.clearAllMocks();
  vi.useFakeTimers();
});

describe('newPlayerInQueue', () => {
  it('keeps one player in queue and emits queue.added', () => {
    const player = createPlayer('socket-a');

    newPlayerInQueue(player as any);

    expect(queue.length).toBe(1);
    expect(games.length).toBe(0);
    expect(player.socket.emit).toHaveBeenCalledWith('queue.added', {
      inQueue: true,
      inGame: false,
    });
  });

  it('creates a game when second player joins and notifies both sockets', () => {
    const player1 = createPlayer('socket-a');
    const player2 = createPlayer('socket-b');

    newPlayerInQueue(player1 as any);
    newPlayerInQueue(player2 as any);

    expect(queue.length).toBe(0);
    expect(games.length).toBe(1);

    const game = games[0];

    expect(player1.socket.emit).toHaveBeenCalledWith(
      'game.start',
      expect.objectContaining({
        inQueue: false,
        inGame: true,
        myPlayerKey: 'player:1',
        idPlayer: 'socket-a',
        idOpponent: 'socket-b',
      }),
    );

    expect(player2.socket.emit).toHaveBeenCalledWith(
      'game.start',
      expect.objectContaining({
        inQueue: false,
        inGame: true,
        myPlayerKey: 'player:2',
        idPlayer: 'socket-b',
        idOpponent: 'socket-a',
      }),
    );

    expect(updateClientsViewTimers).toHaveBeenCalledWith(game);
    expect(updateClientsViewDecks).toHaveBeenCalledWith(game);
    expect(updateClientsViewGrid).toHaveBeenCalledWith(game);
    expect(player1.socket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(player2.socket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });

  it('ends game in favor of opponent when a player disconnects', () => {
    const player1 = createPlayer('socket-a');
    const player2 = createPlayer('socket-b');

    newPlayerInQueue(player1 as any);
    newPlayerInQueue(player2 as any);

    const game = games[0];

    player1.socket.handlers.disconnect();
    expect(endGame).toHaveBeenCalledWith(game, 'player:2', 'DISCONNECT');

    player2.socket.handlers.disconnect();
    expect(endGame).toHaveBeenCalledWith(game, 'player:1', 'DISCONNECT');
  });
});
