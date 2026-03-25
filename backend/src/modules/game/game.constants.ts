import { Cell, Choices, Combination, Deck } from '../../shared/types';

export const TURN_DURATION = 30;
export const PIECES_PER_PLAYER = 12;

export const DECK_INIT: Deck = {
  dices: [
    { id: 1, value: '', locked: true },
    { id: 2, value: '', locked: true },
    { id: 3, value: '', locked: true },
    { id: 4, value: '', locked: true },
    { id: 5, value: '', locked: true },
  ],
  rollsCounter: 1,
  rollsMaximum: 3,
};

export const CHOICES_INIT: Choices = {
  isDefi: false,
  isSec: false,
  isYamPredatorMode: false,
  idSelectedChoice: null,
  availableChoices: [],
};

export const ALL_COMBINATIONS: Combination[] = [
  { value: 'Brelan1', id: 'brelan1' },
  { value: 'Brelan2', id: 'brelan2' },
  { value: 'Brelan3', id: 'brelan3' },
  { value: 'Brelan4', id: 'brelan4' },
  { value: 'Brelan5', id: 'brelan5' },
  { value: 'Brelan6', id: 'brelan6' },
  { value: 'Full', id: 'full' },
  { value: 'Carré', id: 'carre' },
  { value: 'Yam', id: 'yam' },
  { value: 'Suite', id: 'suite' },
  { value: '≤8', id: 'moinshuit' },
  { value: 'Sec', id: 'sec' },
  { value: 'Défi', id: 'defi' },
];

export const SEC_COMBINATION = ALL_COMBINATIONS.find(c => c.id === 'sec')!;

export const GRID_INIT: Cell[][] = [
  [
    { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
    { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
    { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
  ],
  [
    { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
    { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
    { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
    { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
    { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
  ],
  [
    { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
    { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
    { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
    { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
    { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
  ],
  [
    { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
    { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
    { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
  ],
  [
    { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
    { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
    { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
    { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
  ],
];

export const ALIGNMENT_DIRECTIONS = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 },
] as const;
