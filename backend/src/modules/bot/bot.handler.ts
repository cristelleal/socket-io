import { Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import { games } from '../../shared/state';
import { BotDifficulty, Game, Player } from '../../shared/types';
import { GameService } from '../game/game.service';
import {
  updateClientsViewTimers,
  updateClientsViewDecks,
  updateClientsViewChoices,
  updateClientsViewGrid,
  updateClientsViewScores,
} from '../game/game.emitter';
import { endTurn, endGame } from '../game/game.actions';
import './bot.actions';

const BOT_NAMES: Record<BotDifficulty, string> = {
  easy:   'Bot Facile',
  medium: 'Bot Pro',
  hard:   'Bot Expert',
} as const;

// Créer un faux socket pour le bot, qui ignore toutes les émissions et ne peut pas recevoir d'événements
const createBotSocket = (id: string): Socket => {
  const noop = () => {};
  return {
    id,
    emit: noop,
    on: noop,
    off: noop,
    join: noop,
    leave: noop,
    disconnect: noop,
    rooms: new Set<string>(),
  } as unknown as Socket;
};

export const registerBotHandlers = (socket: Socket): void => {
  socket.on('bot.game.start', (data?: { difficulty?: BotDifficulty; userId?: string; username?: string }) => {
    const difficulty: BotDifficulty = data?.difficulty ?? 'medium';

    const humanPlayer: Player = { socket, userId: data?.userId, username: data?.username, isBot: false };
    const botPlayer: Player = {
      socket: createBotSocket(`bot_${randomUUID().slice(0, 8)}`),
      username: BOT_NAMES[difficulty],
      isBot: true,
    };

    const newGame: Game = {
      idGame: randomUUID(),
      player1: humanPlayer,
      player2: botPlayer,
      intervalId: null,
      botDifficulty: difficulty,
      botPlayerKey: 'player:2',
      ...GameService.init.gameState(),
    };

    games.push(newGame);
    const game = games[GameService.utils.findGameIndexById(games, newGame.idGame)];

    // Le joueur humain est player:1, il joue en premier
    socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', game));

    updateClientsViewTimers(game);
    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
    updateClientsViewScores(game);

    // Timer : n'expirer le tour que si c'est le tour humain
    game.intervalId = setInterval(() => {
      game.gameState.timer--;
      // Émettre uniquement vers le joueur humain (le bot ignore de toute façon)
      game.player1.socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));

      if (game.gameState.timer === 0 && game.gameState.currentTurn !== game.botPlayerKey) {
        endTurn(game);
      }
    }, 1000);

    // Si le joueur se déconnecte, la partie se termine
    socket.on('disconnect', () => endGame(game, 'player:2', 'DISCONNECT'));
  });
};
