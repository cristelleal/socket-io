import { Dice, Game, PlayerKey } from '../../shared/types';

export interface DiceAnalysis {
  counts: number[];
  sum: number;
  hasPair: boolean;
  hasThreeOfAKind: boolean;
  threeOfAKindValue: number | null;
  hasFourOfAKind: boolean;
  hasFiveOfAKind: boolean;
  hasStraight: boolean;
}

export const rollDice = (): string => String(Math.floor(Math.random() * 6) + 1);

export const analyzeDices = (dices: Dice[]): DiceAnalysis => {
  const counts = Array(7).fill(0) as number[];
  const sortedValues: number[] = [];

  for (const dice of dices) {
    const val = parseInt(dice.value);
    counts[val]++;
    sortedValues.push(val);
  }
  sortedValues.sort((a, b) => a - b);

  let sum = 0;
  let hasPair = false;
  let hasThreeOfAKind = false;
  let threeOfAKindValue: number | null = null;
  let hasFourOfAKind = false;
  let hasFiveOfAKind = false;

  for (let i = 1; i <= 6; i++) {
    sum += counts[i] * i;
    if (counts[i] >= 2) hasPair = true;
    if (counts[i] >= 3) { hasThreeOfAKind = true; threeOfAKindValue = i; }
    if (counts[i] >= 4) hasFourOfAKind = true;
    if (counts[i] >= 5) hasFiveOfAKind = true;
  }

  const hasStraight = sortedValues.every((v, i) => i === 0 || v === sortedValues[i - 1] + 1);

  return { counts, sum, hasPair, hasThreeOfAKind, threeOfAKindValue, hasFourOfAKind, hasFiveOfAKind, hasStraight };
};

export const getSocket = (playerKey: PlayerKey, game: Game) =>
  (playerKey === 'player:1' ? game.player1 : game.player2).socket;

export const getOpponentSocket = (playerKey: PlayerKey, game: Game) =>
  (playerKey === 'player:1' ? game.player2 : game.player1).socket;
