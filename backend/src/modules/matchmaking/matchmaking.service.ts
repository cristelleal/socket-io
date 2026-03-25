import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { games, queue } from '../../shared/state';
import { Game } from '../../shared/types';
import { GameService } from '../game/game.service';
import { updateClientsViewTimers, updateClientsViewDecks, updateClientsViewGrid } from '../game/game.emitter';
import { endTurn } from '../game/game.actions';

const createGame = (player1Socket: Socket, player2Socket: Socket): void => {
  const newGame: Game = {
    idGame: randomUUID(),
    player1Socket,
    player2Socket,
    ...GameService.init.gameState(),
  };

  games.push(newGame);

  const game = games[GameService.utils.findGameIndexById(games, newGame.idGame)];

  game.player1Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', game));
  game.player2Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:2', game));

  updateClientsViewTimers(game);
  updateClientsViewDecks(game);
  updateClientsViewGrid(game);

  const gameInterval = setInterval(() => {
    game.gameState.timer--;
    updateClientsViewTimers(game);

    if (game.gameState.timer === 0) {
      endTurn(game);
    }
  }, 1000);

  const cleanup = () => {
    clearInterval(gameInterval);
    const idx = GameService.utils.findGameIndexById(games, game.idGame);
    if (idx !== -1) games.splice(idx, 1);
  };

  player1Socket.on('disconnect', cleanup);
  player2Socket.on('disconnect', cleanup);
};

export const newPlayerInQueue = (socket: Socket): void => {
  queue.push(socket);

  if (queue.length >= 2) {
    const player1Socket = queue.shift()!;
    const player2Socket = queue.shift()!;
    createGame(player1Socket, player2Socket);
  } else {
    socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
  }
};
