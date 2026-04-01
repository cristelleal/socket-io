import { Socket } from 'socket.io-client';

export type PlayerOwner = 'player:1' | 'player:2';

export interface Dice {
  id: number;
  value: string;
  locked: boolean;
}

export interface Combination {
  id: string;
  value: string;
}

export interface Cell {
  viewContent: string;
  id: string;
  owner: PlayerOwner | null;
  canBeChecked: boolean;
}

export interface ServerToClientEvents {
  'queue.added': (data: { inQueue: boolean; inGame: boolean }) => void;
  'game.start': (data: { inQueue: boolean; inGame: boolean; myPlayerKey: PlayerOwner; idPlayer: string; idOpponent: string; playerUsername: string; opponentUsername: string }) => void;
  'game.timer': (data: { playerTimer: number; opponentTimer: number }) => void;
  'game.deck.view-state': (data: {
    displayPlayerDeck: boolean;
    displayOpponentDeck: boolean;
    displayRollButton: boolean;
    rollsCounter: number;
    rollsMaximum: number;
    dices: Dice[];
  }) => void;
  'game.choices.view-state': (data: {
    displayChoices: boolean;
    canMakeChoice: boolean;
    idSelectedChoice: string | null;
    availableChoices: Combination[];
    canDeclareDefi: boolean;
  }) => void;
  'game.grid.view-state': (data: {
    displayGrid: boolean;
    canSelectCells: boolean;
    canRemoveOpponentCells: boolean;
    grid: Cell[][];
  }) => void;
  'game.score.view-state': (data: {
    myScore: number;
    opponentScore: number;
    myPiecesLeft: number;
    opponentPiecesLeft: number;
  }) => void;
  'game.end': (data: { winnerId: string; reason: string }) => void;
}

export interface ClientToServerEvents {
  'queue.join': (data: { userId?: string; username?: string }) => void;
  'bot.game.start': (data: { difficulty: 'easy' | 'medium' | 'hard'; username?: string }) => void;
  'game.dices.roll': () => void;
  'game.dices.lock': (idDice: number) => void;
  'game.defi.declare': () => void;
  'game.choices.selected': (data: { choiceId: string }) => void;
  'game.grid.selected': (data: { cellId: string; rowIndex: number; cellIndex: number }) => void;
  'game.grid.remove': (data: { rowIndex: number; cellIndex: number }) => void;
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
