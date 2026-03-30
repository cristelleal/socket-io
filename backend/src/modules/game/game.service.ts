import { Cell, Choices, Combination, Deck, Dice, Game, GameState, PlayerKey } from '../../shared/types';
import { TURN_DURATION, PIECES_PER_PLAYER, DECK_INIT, CHOICES_INIT, GRID_INIT, ALL_COMBINATIONS, SEC_COMBINATION } from './game.constants';
import { rollDice, analyzeDices } from './game.helpers';

export const GameService = {

  init: {
    deck: (): Deck => ({ ...DECK_INIT, dices: DECK_INIT.dices.map(d => ({ ...d })) }),

    choices: (): Choices => ({ ...CHOICES_INIT }),

    grid: (): Cell[][] => GRID_INIT.map(row => row.map(cell => ({ ...cell }))),

    gameState: function (): { gameState: GameState } {
      return {
        gameState: {
          currentTurn: 'player:1',
          timer: TURN_DURATION,
          player1Score: 0,
          player2Score: 0,
          player1PiecesLeft: PIECES_PER_PLAYER,
          player2PiecesLeft: PIECES_PER_PLAYER,
          deck: this.deck(),
          choices: this.choices(),
          grid: this.grid(),
        },
      };
    },
  },

  send: {
    forPlayer: {
      viewGameState: (playerKey: PlayerKey, game: Game) => {
        const player = playerKey === 'player:1' ? game.player1 : game.player2;
        const opponent = playerKey === 'player:1' ? game.player2 : game.player1;
        return {
          inQueue: false,
          inGame: true,
          idPlayer: player.socket.id,
          idOpponent: opponent.socket.id,
          playerUsername: player.username ?? player.socket.id.slice(0, 6),
          opponentUsername: opponent.username ?? opponent.socket.id.slice(0, 6),
        };
      },

      viewQueueState: () => ({ inQueue: true, inGame: false }),

      gameTimer: (playerKey: PlayerKey, gameState: GameState) => {
        const isMyTurn = gameState.currentTurn === playerKey;
        return {
          playerTimer: isMyTurn ? gameState.timer : 0,
          opponentTimer: isMyTurn ? 0 : gameState.timer,
        };
      },

      gridViewState: (playerKey: PlayerKey, gameState: GameState) => {
        const isMyTurn = playerKey === gameState.currentTurn;
        return {
          displayGrid: true,
          canSelectCells: isMyTurn && gameState.choices.availableChoices.length > 0 && !gameState.choices.isYamPredatorMode,
          canRemoveOpponentCells: isMyTurn && gameState.choices.isYamPredatorMode,
          grid: gameState.grid,
        };
      },

      scoreViewState: (playerKey: PlayerKey, gameState: GameState) => {
        const isPlayer1 = playerKey === 'player:1';
        return {
          myScore: isPlayer1 ? gameState.player1Score : gameState.player2Score,
          opponentScore: isPlayer1 ? gameState.player2Score : gameState.player1Score,
          myPiecesLeft: isPlayer1 ? gameState.player1PiecesLeft : gameState.player2PiecesLeft,
          opponentPiecesLeft: isPlayer1 ? gameState.player2PiecesLeft : gameState.player1PiecesLeft,
        };
      },

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

      const available = ALL_COMBINATIONS.filter(c =>
        (c.id.startsWith('brelan') && hasThreeOfAKind && parseInt(c.id.slice(-1)) === threeOfAKindValue) ||
        (c.id === 'full' && hasPair && hasThreeOfAKind) ||
        (c.id === 'carre' && hasFourOfAKind) ||
        (c.id === 'yam' && hasFiveOfAKind) ||
        (c.id === 'suite' && hasStraight) ||
        (c.id === 'moinshuit' && sum <= 8) ||
        (c.id === 'defi' && isDefi)
      );

      if (isSec && available.length > 0 && available.some(c => !c.id.startsWith('brelan'))) {
        available.push(SEC_COMBINATION);
      }

      return available;
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

    selectCell: (idCell: string, rowIndex: number, cellIndex: number, currentTurn: PlayerKey, grid: Cell[][]): Cell[][] =>
      grid.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          cell.id === idCell && rIdx === rowIndex && cIdx === cellIndex
            ? { ...cell, owner: currentTurn }
            : cell
        )
      ),

    removeCell: (rowIndex: number, cellIndex: number, grid: Cell[][]): Cell[][] =>
      grid.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === rowIndex && cIdx === cellIndex
            ? { ...cell, owner: null, canBeChecked: false }
            : cell
        )
      ),

    isAnyCombinationAvailableOnGridForPlayer: (gameState: GameState): boolean => {
      const availableIds = new Set(gameState.choices.availableChoices.map(c => c.id));
      return gameState.grid.flat().some(cell => cell.owner === null && availableIds.has(cell.id));
    },
  },

  score: {
    checkAlignments: (playerKey: PlayerKey, grid: Cell[][]): { points: number; isInstantWin: boolean } => {
      const getLine = (r: number, c: number, dr: number, dc: number): Cell[] => {
        const line: Cell[] = [];
        while (r >= 0 && r < 5 && c >= 0 && c < 5) {
          line.push(grid[r][c]);
          r += dr; c += dc;
        }
        return line;
      };

      const longestRun = (line: Cell[]): number => {
        let max = 0, cur = 0;
        for (const cell of line) {
          cur = cell.owner === playerKey ? cur + 1 : 0;
          max = Math.max(max, cur);
        }
        return max;
      };

      const lines: Cell[][] = [
        ...grid,                                               // horizontales
        ...[0, 1, 2, 3, 4].map(c => grid.map(row => row[c])), // verticales
        ...[0, 1, 2].map(c => getLine(0, c, 1, 1)),           // diagonales \  depuis la ligne 0
        ...[1, 2].map(r => getLine(r, 0, 1, 1)),              // diagonales \  depuis la colonne 0
        ...[2, 3, 4].map(c => getLine(0, c, 1, -1)),          // diagonales /  depuis la ligne 0
        ...[1, 2].map(r => getLine(r, 4, 1, -1)),             // diagonales /  depuis la colonne 4
      ];

      const maxAlignment = Math.max(...lines.map(longestRun));

      if (maxAlignment >= 5) return { points: 0, isInstantWin: true };
      if (maxAlignment === 4) return { points: 2, isInstantWin: false };
      if (maxAlignment === 3) return { points: 1, isInstantWin: false };
      return { points: 0, isInstantWin: false };
    },

    checkWinByPiecesOut: (gameState: GameState): boolean =>
      gameState.player1PiecesLeft === 0 || gameState.player2PiecesLeft === 0,

    canUseYamPredator: (dices: Dice[]): boolean => analyzeDices(dices).hasFiveOfAKind,
  },

  utils: {
    findGameIndexById: (games: Game[], idGame: string): number =>
      games.findIndex(g => g.idGame === idGame),

    findGameIndexBySocketId: (games: Game[], socketId: string): number =>
      games.findIndex(g => g.player1.socket.id === socketId || g.player2.socket.id === socketId),

    findDiceIndexByDiceId: (dices: Dice[], idDice: number): number =>
      dices.findIndex(d => d.id === idDice),
  },
};
