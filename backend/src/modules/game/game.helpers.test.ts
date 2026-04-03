import { describe, expect, it } from 'vitest';
import { analyzeDices } from './game.helpers';
import { Dice } from '../../shared/types';

const createDices = (values: number[]): Dice[] =>
  values.map((value, index) => ({
    id: index + 1,
    value: String(value),
    locked: false,
  }));

describe('analyzeDices', () => {
  it('detects a straight and computes the sum', () => {
    const analysis = analyzeDices(createDices([1, 2, 3, 4, 5]));

    expect(analysis.hasStraight).toBe(true);
    expect(analysis.sum).toBe(15);
    expect(analysis.hasThreeOfAKind).toBe(false);
    expect(analysis.hasFiveOfAKind).toBe(false);
  });

  it('detects a full-house profile (pair + brelan)', () => {
    const analysis = analyzeDices(createDices([2, 2, 2, 5, 5]));

    expect(analysis.hasPair).toBe(true);
    expect(analysis.hasThreeOfAKind).toBe(true);
    expect(analysis.threeOfAKindValue).toBe(2);
    expect(analysis.hasFourOfAKind).toBe(false);
    expect(analysis.hasFiveOfAKind).toBe(false);
  });

  it('detects yam (five of a kind)', () => {
    const analysis = analyzeDices(createDices([6, 6, 6, 6, 6]));

    expect(analysis.hasPair).toBe(true);
    expect(analysis.hasThreeOfAKind).toBe(true);
    expect(analysis.hasFourOfAKind).toBe(true);
    expect(analysis.hasFiveOfAKind).toBe(true);
  });
});
