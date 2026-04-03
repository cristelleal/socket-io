import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getBotDicesToLock,
  getLongestRun,
  selectBestCell,
  selectBestCombo,
  selectCellToRemove,
  shouldStopRolling,
  shouldUseYamPredator,
} from './bot.service';
import { Cell, Dice, GameState } from '../../shared/types';

const createDices = (values: Array<number | ''>): Dice[] =>
  values.map((value, index) => ({
    id: index + 1,
    value: value === '' ? '' : String(value),
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

const createGameState = (grid: Cell[][]): GameState => ({
  currentTurn: 'player:1',
  timer: 30,
  player1Score: 0,
  player2Score: 0,
  player1PiecesLeft: 12,
  player2PiecesLeft: 12,
  deck: {
    dices: createDices(['', '', '', '', '']),
    rollsCounter: 1,
    rollsMaximum: 3,
  },
  choices: {
    isDefi: false,
    isSec: false,
    isYamPredatorMode: false,
    idSelectedChoice: null,
    availableChoices: [],
  },
  grid,
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getBotDicesToLock', () => {
  it('locks only non-empty dices on easy when random is high', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    const ids = getBotDicesToLock(createDices([1, 2, '', 4, '']), 'easy');

    expect(ids).toEqual([1, 2, 4]);
  });

  it('locks all dices on medium when there is a yam', () => {
    const ids = getBotDicesToLock(createDices([6, 6, 6, 6, 6]), 'medium');

    expect(ids).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('shouldStopRolling', () => {
  it('stops on medium when a great combo exists', () => {
    const stop = shouldStopRolling([{ id: 'full' }], 'medium');
    expect(stop).toBe(true);
  });

  it('stops on hard when suite exists', () => {
    const stop = shouldStopRolling([{ id: 'suite' }], 'hard');
    expect(stop).toBe(true);
  });

  it('never stops on easy', () => {
    const stop = shouldStopRolling([{ id: 'yam' }], 'easy');
    expect(stop).toBe(false);
  });
});

describe('selectBestCombo', () => {
  it('returns null when no free cell exists for available combos', () => {
    const grid = createGrid();
    grid[0][0] = { ...grid[0][0], id: 'full', owner: 'player:1' };

    const choice = selectBestCombo(
      [{ id: 'full', value: 'Full' }],
      createGameState(grid),
      'medium',
    );

    expect(choice).toBeNull();
  });

  it('prioritizes highest ranked combo on medium/hard', () => {
    const grid = createGrid();
    grid[0][0] = { ...grid[0][0], id: 'full' };
    grid[0][1] = { ...grid[0][1], id: 'yam' };

    const choice = selectBestCombo(
      [
        { id: 'full', value: 'Full' },
        { id: 'yam', value: 'Yam' },
      ],
      createGameState(grid),
      'medium',
    );

    expect(choice).toBe('yam');
  });
});

describe('selectBestCell', () => {
  it('returns null when no matching free cell exists', () => {
    const grid = createGrid();
    const result = selectBestCell(
      'suite',
      createGameState(grid),
      'player:1',
      'player:2',
      'medium',
    );

    expect(result).toBeNull();
  });

  it('chooses the winning cell when an instant win is possible', () => {
    const grid = createGrid();
    for (let c = 0; c < 5; c++) {
      grid[0][c] = { ...grid[0][c], id: 'yam' };
    }
    grid[0][0].owner = 'player:1';
    grid[0][1].owner = 'player:1';
    grid[0][2].owner = 'player:1';
    grid[0][3].owner = 'player:1';

    const result = selectBestCell(
      'yam',
      createGameState(grid),
      'player:1',
      'player:2',
      'hard',
    );

    expect(result).toEqual({ rowIndex: 0, cellIndex: 4, cellId: 'yam' });
  });
});

describe('getLongestRun and predator actions', () => {
  it('computes the longest contiguous run for a player', () => {
    const grid = createGrid();
    grid[2][0].owner = 'player:2';
    grid[2][1].owner = 'player:2';
    grid[2][2].owner = 'player:2';

    expect(getLongestRun('player:2', grid)).toBe(3);
  });

  it('uses yam predator on hard when opponent has a run >= 3', () => {
    const grid = createGrid();
    grid[1][1].owner = 'player:2';
    grid[1][2].owner = 'player:2';
    grid[1][3].owner = 'player:2';

    const usePredator = shouldUseYamPredator(
      createGameState(grid),
      'player:2',
      'hard',
    );

    expect(usePredator).toBe(true);
  });

  it('removes the most impactful opponent cell on medium/hard', () => {
    const grid = createGrid();
    grid[0][0].owner = 'player:2';
    grid[0][1].owner = 'player:2';
    grid[0][2].owner = 'player:2';

    const removal = selectCellToRemove(createGameState(grid), 'player:2', 'hard');

    expect(removal).toMatchObject({ rowIndex: 0, cellIndex: 1 });
  });
});
