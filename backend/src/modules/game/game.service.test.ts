import { describe, expect, it } from 'vitest';
import { GameService } from './game.service';
import { Cell, Dice, Game, GameState } from '../../shared/types';

const createDices = (values: number[]): Dice[] =>
  values.map((value, index) => ({
    id: index + 1,
    value: String(value),
    locked: false,
  }));

const createGrid = (): Cell[][] =>
  Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => ({
      viewContent: `${r}:${c}`,
      id: 'brelan1',
      owner: null,
      canBeChecked: false,
    })),
  );

describe('GameService.choices.findCombinations', () => {
  it('returns expected combinations for a full-house roll', () => {
    const combos = GameService.choices.findCombinations(
      createDices([2, 2, 2, 5, 5]),
      false,
      false,
    );

    const ids = combos.map((combo) => combo.id);

    expect(ids).toContain('brelan2');
    expect(ids).toContain('full');
    expect(ids).not.toContain('sec');
    expect(ids).not.toContain('defi');
  });

  it('adds sec and defi only when a non-brelan combo exists', () => {
    const combos = GameService.choices.findCombinations(
      createDices([2, 2, 2, 5, 5]),
      true,
      true,
    );

    const ids = combos.map((combo) => combo.id);

    expect(ids).toContain('sec');
    expect(ids).toContain('defi');
  });

  it('does not add sec/defi when no non-brelan combo is available', () => {
    const combos = GameService.choices.findCombinations(
      createDices([1, 1, 2, 4, 6]),
      true,
      true,
    );

    const ids = combos.map((combo) => combo.id);

    expect(ids.length).toBe(0);
    expect(ids).not.toContain('sec');
    expect(ids).not.toContain('defi');
  });
});

describe('GameService.score.checkAlignments', () => {
  it('awards 1 point for an alignment of three', () => {
    const grid = createGrid();
    grid[0][0].owner = 'player:1';
    grid[0][1].owner = 'player:1';
    grid[0][2].owner = 'player:1';

    const result = GameService.score.checkAlignments('player:1', grid);

    expect(result).toEqual({ points: 1, isInstantWin: false });
  });

  it('awards 2 points for an alignment of four', () => {
    const grid = createGrid();
    grid[1][0].owner = 'player:2';
    grid[1][1].owner = 'player:2';
    grid[1][2].owner = 'player:2';
    grid[1][3].owner = 'player:2';

    const result = GameService.score.checkAlignments('player:2', grid);

    expect(result).toEqual({ points: 2, isInstantWin: false });
  });

  it('triggers instant win for an alignment of five', () => {
    const grid = createGrid();
    for (let i = 0; i < 5; i++) {
      grid[i][i].owner = 'player:1';
    }

    const result = GameService.score.checkAlignments('player:1', grid);

    expect(result).toEqual({ points: 0, isInstantWin: true });
  });
});

describe('GameService.utils', () => {
  it('finds game index by socket id', () => {
    const games = [
      {
        idGame: 'game-1',
        player1: { socket: { id: 'socket-a' } },
        player2: { socket: { id: 'socket-b' } },
        gameState: {} as GameState,
        intervalId: null,
      },
      {
        idGame: 'game-2',
        player1: { socket: { id: 'socket-c' } },
        player2: { socket: { id: 'socket-d' } },
        gameState: {} as GameState,
        intervalId: null,
      },
    ] as unknown as Game[];

    expect(GameService.utils.findGameIndexBySocketId(games, 'socket-d')).toBe(1);
    expect(GameService.utils.findGameIndexBySocketId(games, 'missing')).toBe(-1);
  });
});
