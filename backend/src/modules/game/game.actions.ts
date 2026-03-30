import { Game, PlayerKey } from '../../shared/types';
import { GameService } from './game.service';
import { updateClientsViewTimers, updateClientsViewDecks, updateClientsViewChoices, updateClientsViewGrid, emitGameEnd } from './game.emitter';
import { GameRepository, GameResultInput } from './game.repository';
import { games } from '../../shared/state';

export const endTurn = (game: Game): void => {
  game.gameState.currentTurn = game.gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
  game.gameState.timer = GameService.timer.getTurnDuration();
  game.gameState.deck = GameService.init.deck();
  game.gameState.choices = GameService.init.choices();
  game.gameState.grid = GameService.grid.resetCanBeCheckedCells(game.gameState.grid);

  updateClientsViewTimers(game);
  updateClientsViewDecks(game);
  updateClientsViewChoices(game);
  updateClientsViewGrid(game);
};

export const endGame = async (game: Game, winnerKey: PlayerKey, endReason: GameResultInput['endReason']): Promise<void> => {
  if (game.intervalId) {
    clearInterval(game.intervalId);
    game.intervalId = null;
  }

  emitGameEnd(game, winnerKey, endReason);

  const result: GameResultInput = {
    player1SocketId: game.player1Socket.id,
    player2SocketId: game.player2Socket.id,
    player1Score: game.gameState.player1Score,
    player2Score: game.gameState.player2Score,
    winner: winnerKey === 'player:1' ? game.player1Socket.id : game.player2Socket.id,
    endReason,
  };

  await GameRepository.saveResult(result).catch(err => {
    console.error('[GameRepository] Failed to save game result:', err);
  });

  const index = games.findIndex(g => g.idGame === game.idGame);
  if (index !== -1) games.splice(index, 1);
};
