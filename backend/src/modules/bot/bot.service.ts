import { Cell, Dice, GameState, PlayerKey } from "../../shared/types";
import { BotDifficulty } from "../../shared/types";
import { analyzeDices } from "../game/game.helpers";
import { GameService } from "../game/game.service";

// Priorité croissante des combos
const COMBO_PRIORITY: string[] = [
  "brelan1",
  "brelan2",
  "brelan3",
  "brelan4",
  "brelan5",
  "brelan6",
  "moinshuit",
  "sec",
  "suite",
  "full",
  "carre",
  "yam",
] as const;

// Stratégies des dés
export const getBotDicesToLock = (
  dices: Dice[],
  difficulty: BotDifficulty,
): number[] => {
  if (difficulty === "easy") {
    return dices
      .filter((d) => d.value !== "")
      .filter(() => Math.random() > 0.5)
      .map((d) => d.id);
  }
  return getSmartDicesToLock(dices);
};

const getSmartDicesToLock = (dices: Dice[]): number[] => {
  const analysis = analyzeDices(dices);

  // Yam ou carré → tout garder
  if (analysis.hasFiveOfAKind || analysis.hasFourOfAKind) {
    return dices.map((d) => d.id);
  }

  // Brelan → garder les trois identiques
  if (analysis.hasThreeOfAKind && analysis.threeOfAKindValue !== null) {
    const val = analysis.threeOfAKindValue;
    return dices.filter((d) => parseInt(d.value) === val).map((d) => d.id);
  }

  // Deux paires → garder les deux paires (pour tenter un full)
  const twoPairs = getTwoPairValues(analysis.counts);
  if (twoPairs.length === 2) {
    return dices
      .filter((d) => twoPairs.includes(parseInt(d.value)))
      .map((d) => d.id);
  }

  // 4 dés consécutifs (suite potentielle) → garder la séquence
  const straightIds = getStraightDiceIds(dices);
  if (straightIds.length >= 4) return straightIds;

  // Simple paire → la conserver
  const pairValue = getPairValue(analysis.counts);
  if (pairValue !== null) {
    return dices
      .filter((d) => parseInt(d.value) === pairValue)
      .map((d) => d.id);
  }

  return [];
};

const getTwoPairValues = (counts: number[]): number[] => {
  const pairs: number[] = [];
  for (let i = 6; i >= 1; i--) {
    if (counts[i] >= 2) pairs.push(i);
    if (pairs.length === 2) break;
  }
  return pairs;
};

const getPairValue = (counts: number[]): number | null => {
  for (let i = 6; i >= 1; i--) {
    if (counts[i] >= 2) return i;
  }
  return null;
};

const getStraightDiceIds = (dices: Dice[]): number[] => {
  const values = dices
    .filter((d) => d.value !== "")
    .map((d) => ({ id: d.id, val: parseInt(d.value) }));

  const match1 = values.filter((d) => [1, 2, 3, 4, 5].includes(d.val));
  const match2 = values.filter((d) => [2, 3, 4, 5, 6].includes(d.val));
  const best =
    match1.length >= match2.length ? [1, 2, 3, 4, 5] : [2, 3, 4, 5, 6];

  const seen = new Set<number>();
  return values
    .filter((d) => {
      if (best.includes(d.val) && !seen.has(d.val)) {
        seen.add(d.val);
        return true;
      }
      return false;
    })
    .map((d) => d.id);
};

// Décision d'arrêt de relance
export const shouldStopRolling = (
  availableChoices: { id: string }[],
  difficulty: BotDifficulty,
): boolean => {
  if (difficulty === "easy") return false;

  const hasGreat = availableChoices.some((c) =>
    ["yam", "carre", "full"].includes(c.id),
  );
  if (hasGreat) return true;

  if (difficulty === "hard") {
    return availableChoices.some((c) => c.id === "suite");
  }

  return false;
};

// Sélection de combo
export const selectBestCombo = (
  availableChoices: { id: string; value: string }[],
  gameState: GameState,
  difficulty: BotDifficulty,
): string | null => {
  // Ne garder que les combos qui ont encore une cellule libre sur la grille
  const combosWithFreeCells = availableChoices.filter((c) =>
    gameState.grid
      .flat()
      .some((cell) => cell.id === c.id && cell.owner === null),
  );

  if (combosWithFreeCells.length === 0) return null;

  if (difficulty === "easy") {
    return combosWithFreeCells[
      Math.floor(Math.random() * combosWithFreeCells.length)
    ].id;
  }

  // Medium / Hard : priorité par valeur de combo
  const sorted = [...combosWithFreeCells].sort(
    (a, b) => COMBO_PRIORITY.indexOf(b.id) - COMBO_PRIORITY.indexOf(a.id),
  );

  return sorted[0]?.id ?? null;
};

// Sélection de cellule à remplir pour un combo donné
export const selectBestCell = (
  choiceId: string,
  gameState: GameState,
  botPlayerKey: PlayerKey,
  opponentKey: PlayerKey,
  difficulty: BotDifficulty,
): { rowIndex: number; cellIndex: number; cellId: string } | null => {
  const freeCells: { rowIndex: number; cellIndex: number; cellId: string }[] =
    [];

  gameState.grid.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell.id === choiceId && cell.owner === null) {
        freeCells.push({ rowIndex, cellIndex, cellId: cell.id });
      }
    });
  });

  if (freeCells.length === 0) return null;

  if (difficulty === "easy") {
    return freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  // Medium / Hard : simuler chaque placement et scorer
  let bestCell = freeCells[0];
  let bestScore = -1;

  for (const candidate of freeCells) {
    const score = evaluatePlacement(
      candidate.rowIndex,
      candidate.cellIndex,
      botPlayerKey,
      opponentKey,
      gameState.grid,
      difficulty,
    );
    if (score > bestScore) {
      bestScore = score;
      bestCell = candidate;
    }
  }

  return bestCell;
};

const evaluatePlacement = (
  rowIndex: number,
  cellIndex: number,
  playerKey: PlayerKey,
  opponentKey: PlayerKey,
  grid: Cell[][],
  difficulty: BotDifficulty,
): number => {
  const simGrid = grid.map((row, r) =>
    row.map((cell, c) =>
      r === rowIndex && c === cellIndex ? { ...cell, owner: playerKey } : cell,
    ),
  );

  const { points, isInstantWin } = GameService.score.checkAlignments(
    playerKey,
    simGrid,
  );
  if (isInstantWin) return 10000;

  let score = points * 10 + getLongestRun(playerKey, simGrid);

  if (difficulty === "hard") {
    // Bonus si on bloque une ligne de l'adversaire
    score += getBlockingScore(rowIndex, cellIndex, opponentKey, grid) * 2;
  }

  return score;
};

export const getLongestRun = (playerKey: PlayerKey, grid: Cell[][]): number => {
  const getLine = (r: number, c: number, dr: number, dc: number): Cell[] => {
    const line: Cell[] = [];
    while (r >= 0 && r < 5 && c >= 0 && c < 5) {
      line.push(grid[r][c]);
      r += dr;
      c += dc;
    }
    return line;
  };

  const longestRun = (line: Cell[]): number => {
    let max = 0,
      cur = 0;
    for (const cell of line) {
      cur = cell.owner === playerKey ? cur + 1 : 0;
      max = Math.max(max, cur);
    }
    return max;
  };

  const lines: Cell[][] = [
    ...grid,
    ...[0, 1, 2, 3, 4].map((c) => grid.map((row) => row[c])),
    ...[0, 1, 2].map((c) => getLine(0, c, 1, 1)),
    ...[1, 2].map((r) => getLine(r, 0, 1, 1)),
    ...[2, 3, 4].map((c) => getLine(0, c, 1, -1)),
    ...[1, 2].map((r) => getLine(r, 4, 1, -1)),
  ];

  return Math.max(0, ...lines.map(longestRun));
};

const getBlockingScore = (
  rowIndex: number,
  cellIndex: number,
  opponentKey: PlayerKey,
  grid: Cell[][],
): number => {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [-1, 1],
  ];
  let adjacent = 0;
  for (const [dr, dc] of dirs) {
    const r = rowIndex + dr;
    const c = cellIndex + dc;
    if (
      r >= 0 &&
      r < 5 &&
      c >= 0 &&
      c < 5 &&
      grid[r][c].owner === opponentKey
    ) {
      adjacent++;
    }
  }
  return adjacent;
};

// Yam Predator
export const shouldUseYamPredator = (
  gameState: GameState,
  opponentKey: PlayerKey,
  difficulty: BotDifficulty,
): boolean => {
  if (difficulty === "easy") return Math.random() > 0.5;
  return getLongestRun(opponentKey, gameState.grid) >= 3;
};

export const selectCellToRemove = (
  gameState: GameState,
  opponentKey: PlayerKey,
  difficulty: BotDifficulty,
): { rowIndex: number; cellIndex: number } | null => {
  const candidates: {
    rowIndex: number;
    cellIndex: number;
    runAfter: number;
  }[] = [];

  gameState.grid.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell.owner !== opponentKey) return;

      const simGrid = gameState.grid.map((r, ri) =>
        r.map((c, ci) =>
          ri === rowIndex && ci === cellIndex
            ? { ...c, owner: null as null }
            : c,
        ),
      );

      candidates.push({
        rowIndex,
        cellIndex,
        runAfter: getLongestRun(opponentKey, simGrid),
      });
    });
  });

  if (candidates.length === 0) return null;

  if (difficulty === "easy") {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // Retirer la cellule qui réduit au maximum la série adversaire
  candidates.sort((a, b) => a.runAfter - b.runAfter);
  return candidates[0];
};
