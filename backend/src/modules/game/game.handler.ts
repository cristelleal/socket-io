import { Socket } from 'socket.io';
import { games } from '../../shared/state';
import { GameService } from './game.service';
import { updateClientsViewDecks, updateClientsViewChoices, updateClientsViewGrid } from './game.emitter';
import { endTurn } from './game.actions';

export const registerGameHandlers = (socket: Socket): void => {

  socket.on('game.dices.roll', () => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    const deck = game.gameState.deck;

    if (deck.rollsCounter > deck.rollsMaximum) return;

    deck.dices = GameService.dices.roll(deck.dices);
    deck.rollsCounter++;

    if (deck.rollsCounter > deck.rollsMaximum) {
      deck.dices = GameService.dices.lockEveryDice(deck.dices);
    }

    const isSec = deck.rollsCounter === 2;
    game.gameState.choices.availableChoices = GameService.choices.findCombinations(deck.dices, false, isSec);

    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
  });

  socket.on('game.dices.lock', (idDice: number) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    const diceIndex = GameService.utils.findDiceIndexByDiceId(game.gameState.deck.dices, idDice);
    game.gameState.deck.dices[diceIndex].locked = !game.gameState.deck.dices[diceIndex].locked;

    updateClientsViewDecks(game);
  });

  socket.on('game.choices.selected', (data: { choiceId: string }) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    game.gameState.choices.idSelectedChoice = data.choiceId;
    game.gameState.grid = GameService.grid.resetCanBeCheckedCells(game.gameState.grid);
    game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(data.choiceId, game.gameState.grid);

    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
  });

  socket.on('game.grid.selected', (data: { cellId: string; rowIndex: number; cellIndex: number }) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    game.gameState.grid = GameService.grid.resetCanBeCheckedCells(game.gameState.grid);
    game.gameState.grid = GameService.grid.selectCell(
      data.cellId,
      data.rowIndex,
      data.cellIndex,
      game.gameState.currentTurn,
      game.gameState.grid
    );

    // TODO: Calculer le score
    // TODO: Vérifier les conditions de victoire (lignes / diagonales / grille pleine)

    endTurn(game);
  });
};
