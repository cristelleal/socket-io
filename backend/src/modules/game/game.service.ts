import { Cell, Choices, Combination, Deck, Dice, Game, GameState, PlayerKey } from '../../shared/types';

const TURN_DURATION = 30;

const DECK_INIT: Deck = {
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

const CHOICES_INIT: Choices = {
  isDefi: false,
  isSec: false,
  idSelectedChoice: null,
  availableChoices: [],
};

const ALL_COMBINATIONS: Combination[] = [
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

const GRID_INIT: Cell[][] = [
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

// ------------------------------------
// -------- HELPERS -------------------
// ------------------------------------

const getSocket = (playerKey: PlayerKey, game: Game) =>
  playerKey === 'player:1' ? game.player1Socket : game.player2Socket;

const getOpponentSocket = (playerKey: PlayerKey, game: Game) =>
  playerKey === 'player:1' ? game.player2Socket : game.player1Socket;

const rollDice = (): string => String(Math.floor(Math.random() * 6) + 1);

interface DiceAnalysis {
  counts: number[];
  sum: number;
  hasPair: boolean;
  hasThreeOfAKind: boolean;
  threeOfAKindValue: number | null;
  hasFourOfAKind: boolean;
  hasFiveOfAKind: boolean;
  hasStraight: boolean;
}

const analyzeDices = (dices: Dice[]): DiceAnalysis => {
  const counts = Array(7).fill(0) as number[];
  let sum = 0;

  for (const dice of dices) {
    const val = parseInt(dice.value);
    counts[val]++;
    sum += val;
  }

  let hasPair = false;
  let hasThreeOfAKind = false;
  let threeOfAKindValue: number | null = null;
  let hasFourOfAKind = false;
  let hasFiveOfAKind = false;

  for (let i = 1; i <= 6; i++) {
    if (counts[i] >= 2) hasPair = true;
    if (counts[i] >= 3) { hasThreeOfAKind = true; threeOfAKindValue = i; }
    if (counts[i] >= 4) hasFourOfAKind = true;
    if (counts[i] >= 5) hasFiveOfAKind = true;
  }

  const sortedValues = dices.map(d => parseInt(d.value)).sort((a, b) => a - b);
  const hasStraight = sortedValues.every((v, i) => i === 0 || v === sortedValues[i - 1] + 1);

  return { counts, sum, hasPair, hasThreeOfAKind, threeOfAKindValue, hasFourOfAKind, hasFiveOfAKind, hasStraight };
};

// ------------------------------------
// -------- SERVICE -------------------
// ------------------------------------

export const GameService = {

  init: {
    gameState: (): { gameState: GameState } => ({
      gameState: {
        currentTurn: 'player:1',
        timer: TURN_DURATION,
        player1Score: 0,
        player2Score: 0,
        deck: { ...DECK_INIT, dices: DECK_INIT.dices.map(d => ({ ...d })) },
        choices: { ...CHOICES_INIT },
        grid: GRID_INIT.map(row => row.map(cell => ({ ...cell }))),
      },
    }),

    deck: (): Deck => ({ ...DECK_INIT, dices: DECK_INIT.dices.map(d => ({ ...d })) }),

    choices: (): Choices => ({ ...CHOICES_INIT }),

    grid: (): Cell[][] => GRID_INIT.map(row => row.map(cell => ({ ...cell }))),
  },

  send: {
    forPlayer: {
      viewGameState: (playerKey: PlayerKey, game: Game) => ({
        inQueue: false,
        inGame: true,
        idPlayer: getSocket(playerKey, game).id,
        idOpponent: getOpponentSocket(playerKey, game).id,
      }),

      viewQueueState: () => ({ inQueue: true, inGame: false }),

      gameTimer: (playerKey: PlayerKey, gameState: GameState) => {
        const isMyTurn = gameState.currentTurn === playerKey;
        return {
          playerTimer: isMyTurn ? gameState.timer : 0,
          opponentTimer: isMyTurn ? 0 : gameState.timer,
        };
      },

      gridViewState: (playerKey: PlayerKey, gameState: GameState) => ({
        displayGrid: true,
        canSelectCells:
          playerKey === gameState.currentTurn &&
          gameState.choices.availableChoices.length > 0,
        grid: gameState.grid,
      }),

      deckViewState: (playerKey: PlayerKey, gameState: GameState) => ({
        displayPlayerDeck: gameState.currentTurn === playerKey,
        displayOpponentDeck: gameState.currentTurn !== playerKey,
        displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
        rollsCounter: gameState.deck.rollsCounter,
        rollsMaximum: gameState.deck.rollsMaximum,
        dices: gameState.deck.dices,
      }),

      choicesViewState: (playerKey: PlayerKey, gameState: GameState) => ({
        displayChoices: true,
        canMakeChoice: playerKey === gameState.currentTurn,
        idSelectedChoice: gameState.choices.idSelectedChoice,
        availableChoices: gameState.choices.availableChoices,
      }),
    },
  },

  timer: {
    getTurnDuration: (): number => TURN_DURATION,
  },

  dices: {
    roll: (dices: Dice[]): Dice[] =>
      dices.map(dice => {
        if (dice.locked && dice.value !== '') return dice;
        return { ...dice, value: rollDice(), locked: false };
      }),

    lockEveryDice: (dices: Dice[]): Dice[] =>
      dices.map(dice => ({ ...dice, locked: true })),
  },

  choices: {
    findCombinations: (dices: Dice[], isDefi: boolean, isSec: boolean): Combination[] => {
      const { sum, hasPair, hasThreeOfAKind, threeOfAKindValue, hasFourOfAKind, hasFiveOfAKind, hasStraight } = analyzeDices(dices);
      const isLessThanEqual8 = sum <= 8;

      const availableCombinations = ALL_COMBINATIONS.filter(combination =>
        (combination.id.includes('brelan') && hasThreeOfAKind && parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
        (combination.id === 'full' && hasPair && hasThreeOfAKind) ||
        (combination.id === 'carre' && hasFourOfAKind) ||
        (combination.id === 'yam' && hasFiveOfAKind) ||
        (combination.id === 'suite' && hasStraight) ||
        (combination.id === 'moinshuit' && isLessThanEqual8) ||
        (combination.id === 'defi' && isDefi)
      );

      const notOnlyBrelan = availableCombinations.some(c => !c.id.includes('brelan'));
      if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
        const sec = ALL_COMBINATIONS.find(c => c.id === 'sec');
        if (sec) availableCombinations.push(sec);
      }

      return availableCombinations;
    },
  },

  grid: {
    resetCanBeCheckedCells: (grid: Cell[][]): Cell[][] =>
      grid.map(row => row.map(cell => ({ ...cell, canBeChecked: false }))),

    updateGridAfterSelectingChoice: (idSelectedChoice: string, grid: Cell[][]): Cell[][] =>
      grid.map(row =>
        row.map(cell =>
          cell.id === idSelectedChoice && cell.owner === null
            ? { ...cell, canBeChecked: true }
            : cell
        )
      ),

    selectCell: (
      idCell: string,
      rowIndex: number,
      cellIndex: number,
      currentTurn: PlayerKey,
      grid: Cell[][]
    ): Cell[][] =>
      grid.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          cell.id === idCell && rIdx === rowIndex && cIdx === cellIndex
            ? { ...cell, owner: currentTurn }
            : cell
        )
      ),

    isAnyCombinationAvailableOnGridForPlayer: (gameState: GameState): boolean => {
      const availableIds = new Set(gameState.choices.availableChoices.map(c => c.id));
      return gameState.grid.flat().some(cell => cell.owner === null && availableIds.has(cell.id));
    },
  },

  utils: {
    findGameIndexById: (games: Game[], idGame: string): number =>
      games.findIndex(g => g.idGame === idGame),

    findGameIndexBySocketId: (games: Game[], socketId: string): number =>
      games.findIndex(g => g.player1Socket.id === socketId || g.player2Socket.id === socketId),

    findDiceIndexByDiceId: (dices: Dice[], idDice: number): number =>
      dices.findIndex(d => d.id === idDice),
  },
};
