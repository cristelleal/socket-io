import { Game } from '../../shared/types';
import { GameService } from './game.service';
import { updateClientsViewTimers, updateClientsViewDecks, updateClientsViewChoices, updateClientsViewGrid } from './game.emitter';

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
