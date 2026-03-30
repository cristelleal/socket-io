import { Socket } from 'socket.io';

export type PlayerKey = 'player:1' | 'player:2';

export interface Player {
  socket: Socket;
  userId?: string;
  username?: string;
}

export interface Dice {
  id: number;
  value: string;
  locked: boolean;
}

export interface Combination {
  value: string;
  id: string;
}

export interface Cell {
  viewContent: string;
  id: string;
  owner: PlayerKey | null;
  canBeChecked: boolean;
}

export interface Deck {
  dices: Dice[];
  rollsCounter: number;
  rollsMaximum: number;
}

export interface Choices {
  isDefi: boolean;
  isSec: boolean;
  isYamPredatorMode: boolean;
  idSelectedChoice: string | null;
  availableChoices: Combination[];
}

export interface GameState {
  currentTurn: PlayerKey;
  timer: number;
  player1Score: number;
  player2Score: number;
  player1PiecesLeft: number;
  player2PiecesLeft: number;
  deck: Deck;
  choices: Choices;
  grid: Cell[][];
}

export interface Game {
  idGame: string;
  player1: Player;
  player2: Player;
  gameState: GameState;
  intervalId: ReturnType<typeof setInterval> | null;
}
