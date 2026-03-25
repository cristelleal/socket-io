import { Game, PlayerKey } from '../../shared/types';
import { GameService } from './game.service';

export const updateClientsViewTimers = (game: Game): void => {
  game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
  game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
};

export const updateClientsViewDecks = (game: Game): void => {
  setTimeout(() => {
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
    game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
  }, 200);
};

export const updateClientsViewChoices = (game: Game): void => {
  setTimeout(() => {
    game.player1Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:1', game.gameState));
    game.player2Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:2', game.gameState));
  }, 200);
};

export const updateClientsViewGrid = (game: Game): void => {
  setTimeout(() => {
    game.player1Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:1', game.gameState));
    game.player2Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:2', game.gameState));
  }, 200);
};

export const updateClientsViewScores = (game: Game): void => {
  game.player1Socket.emit('game.score.view-state', GameService.send.forPlayer.scoreViewState('player:1', game.gameState));
  game.player2Socket.emit('game.score.view-state', GameService.send.forPlayer.scoreViewState('player:2', game.gameState));
};

export const emitGameEnd = (game: Game, winnerKey: PlayerKey, reason: string): void => {
  const winnerId = winnerKey === 'player:1' ? game.player1Socket.id : game.player2Socket.id;
  game.player1Socket.emit('game.end', { winnerId, reason });
  game.player2Socket.emit('game.end', { winnerId, reason });
};
