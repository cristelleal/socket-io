import { Game, PlayerKey } from '../../shared/types';
import { GameService } from './game.service';
import { updateClientsViewTimers, updateClientsViewDecks, updateClientsViewChoices, updateClientsViewGrid, emitGameEnd } from './game.emitter';
import { GameRepository, GameResultInput } from './game.repository';
import { games } from '../../shared/state';

// Callback déclenché quand c'est au tour du bot — évite l'import circulaire
type BotTurnCallback = (game: Game) => void;
let _botTurnCallback: BotTurnCallback | null = null;

export const registerBotTurnCallback = (fn: BotTurnCallback): void => {
  _botTurnCallback = fn;
};

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

  // Si c'est maintenant le tour du bot, on le déclenche
  if (game.botPlayerKey !== undefined && game.gameState.currentTurn === game.botPlayerKey && _botTurnCallback) {
    _botTurnCallback(game);
  }
};

export const endGame = async (game: Game, winnerKey: PlayerKey, endReason: GameResultInput['endReason']): Promise<void> => {
  if (game.intervalId) {
    clearInterval(game.intervalId);
    game.intervalId = null;
  }

  emitGameEnd(game, winnerKey, endReason);

  const result: GameResultInput = {
    player1SocketId: game.player1.socket.id,
    player2SocketId: game.player2.socket.id,
    player1UserId: game.player1.userId,
    player2UserId: game.player2.userId,
    player1Score: game.gameState.player1Score,
    player2Score: game.gameState.player2Score,
    winner: winnerKey === 'player:1' ? game.player1.socket.id : game.player2.socket.id,
    endReason,
  };

  await GameRepository.saveResult(result).catch(err => {
    console.error('[GameRepository] Failed to save game result:', err);
  });

  const index = games.findIndex(g => g.idGame === game.idGame);
  if (index !== -1) games.splice(index, 1);
};
