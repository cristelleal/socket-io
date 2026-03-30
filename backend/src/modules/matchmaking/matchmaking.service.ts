import { randomUUID } from 'crypto';
import { games, queue } from '../../shared/state';
import { Game, Player } from '../../shared/types';
import { GameService } from '../game/game.service';
import { updateClientsViewTimers, updateClientsViewDecks, updateClientsViewGrid } from '../game/game.emitter';
import { endTurn, endGame } from '../game/game.actions';

const createGame = (player1: Player, player2: Player): void => {
  const newGame: Game = {
    idGame: randomUUID(),
    player1,
    player2,
    intervalId: null,
    ...GameService.init.gameState(),
  };

  games.push(newGame);

  const game = games[GameService.utils.findGameIndexById(games, newGame.idGame)];

  game.player1.socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', game));
  game.player2.socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:2', game));

  updateClientsViewTimers(game);
  updateClientsViewDecks(game);
  updateClientsViewGrid(game);

  game.intervalId = setInterval(() => {
    game.gameState.timer--;
    updateClientsViewTimers(game);

    if (game.gameState.timer === 0) {
      endTurn(game);
    }
  }, 1000);

  player1.socket.on('disconnect', () => endGame(game, 'player:2', 'DISCONNECT'));
  player2.socket.on('disconnect', () => endGame(game, 'player:1', 'DISCONNECT'));
};

export const newPlayerInQueue = (player: Player): void => {
  queue.push(player);

  if (queue.length >= 2) {
    const player1 = queue.shift()!;
    const player2 = queue.shift()!;
    createGame(player1, player2);
  } else {
    player.socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
  }
};
