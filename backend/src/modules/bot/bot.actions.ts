import { Game, PlayerKey } from "../../shared/types";
import { GameService } from "../game/game.service";
import {
  updateClientsViewDecks,
  updateClientsViewChoices,
  updateClientsViewGrid,
  updateClientsViewScores,
} from "../game/game.emitter";
import {
  endTurn,
  endGame,
  registerBotTurnCallback,
} from "../game/game.actions";
import {
  getBotDicesToLock,
  selectBestCombo,
  selectBestCell,
  shouldStopRolling,
  shouldUseYamPredator,
  selectCellToRemove,
} from "./bot.service";

const THINK_DELAY = 900;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const botTakeTurn = async (game: Game): Promise<void> => {
  if (!game.botDifficulty || !game.botPlayerKey) return;

  const difficulty = game.botDifficulty;
  const botKey: PlayerKey = game.botPlayerKey;
  const opponentKey: PlayerKey =
    botKey === "player:1" ? "player:2" : "player:1";

  // Guard : si ce n'est plus le tour du bot (ex. déconnexion humain entre-temps), on abort
  if (game.gameState.currentTurn !== botKey) return;

  const deck = game.gameState.deck;

  // Lancer 1
  await sleep(THINK_DELAY);
  if (game.gameState.currentTurn !== botKey) return;

  deck.dices = GameService.dices.roll(deck.dices);
  deck.rollsCounter++;
  const isSec = deck.rollsCounter === 2;

  game.gameState.choices.availableChoices =
    GameService.choices.findCombinations(deck.dices, false, isSec);
  game.gameState.choices.isYamPredatorMode =
    GameService.score.canUseYamPredator(deck.dices);

  updateClientsViewDecks(game);
  updateClientsViewChoices(game);

  // Lancer 2
  if (
    !shouldStopRolling(game.gameState.choices.availableChoices, difficulty) &&
    deck.rollsCounter <= deck.rollsMaximum
  ) {
    await sleep(THINK_DELAY);
    if (game.gameState.currentTurn !== botKey) return;

    const toKeep = getBotDicesToLock(deck.dices, difficulty);
    for (const id of toKeep) {
      const idx = GameService.utils.findDiceIndexByDiceId(deck.dices, id);
      if (idx !== -1) deck.dices[idx].locked = true;
    }
    updateClientsViewDecks(game);

    await sleep(THINK_DELAY);
    if (game.gameState.currentTurn !== botKey) return;

    deck.dices = GameService.dices.roll(deck.dices);
    deck.rollsCounter++;

    game.gameState.choices.availableChoices =
      GameService.choices.findCombinations(deck.dices, false, false);
    game.gameState.choices.isYamPredatorMode =
      GameService.score.canUseYamPredator(deck.dices);

    updateClientsViewDecks(game);
    updateClientsViewChoices(game);

    // Lancer 3
    if (
      !shouldStopRolling(game.gameState.choices.availableChoices, difficulty) &&
      deck.rollsCounter <= deck.rollsMaximum
    ) {
      await sleep(THINK_DELAY);
      if (game.gameState.currentTurn !== botKey) return;

      const toKeep2 = getBotDicesToLock(deck.dices, difficulty);
      for (const id of toKeep2) {
        const idx = GameService.utils.findDiceIndexByDiceId(deck.dices, id);
        if (idx !== -1) deck.dices[idx].locked = true;
      }
      updateClientsViewDecks(game);

      await sleep(THINK_DELAY);
      if (game.gameState.currentTurn !== botKey) return;

      deck.dices = GameService.dices.roll(deck.dices);
      deck.rollsCounter++;
      deck.dices = GameService.dices.lockEveryDice(deck.dices);

      game.gameState.choices.availableChoices =
        GameService.choices.findCombinations(deck.dices, false, false);
      game.gameState.choices.isYamPredatorMode =
        GameService.score.canUseYamPredator(deck.dices);

      updateClientsViewDecks(game);
      updateClientsViewChoices(game);
    }
  }

  await sleep(THINK_DELAY);
  if (game.gameState.currentTurn !== botKey) return;

  // Yam Predator
  if (game.gameState.choices.isYamPredatorMode) {
    if (shouldUseYamPredator(game.gameState, opponentKey, difficulty)) {
      const cellToRemove = selectCellToRemove(
        game.gameState,
        opponentKey,
        difficulty,
      );
      if (cellToRemove) {
        game.gameState.grid = GameService.grid.removeCell(
          cellToRemove.rowIndex,
          cellToRemove.cellIndex,
          game.gameState.grid,
        );
        if (opponentKey === "player:1") game.gameState.player1PiecesLeft++;
        else game.gameState.player2PiecesLeft++;

        game.gameState.choices.isYamPredatorMode = false;
        updateClientsViewGrid(game);
        updateClientsViewScores(game);
        endTurn(game);
        return;
      }
    }
    game.gameState.choices.isYamPredatorMode = false;
  }

  // Sélection combo à jouer
  const choiceId = selectBestCombo(
    game.gameState.choices.availableChoices,
    game.gameState,
    difficulty,
  );

  if (!choiceId) {
    // Aucune combo disponible → passe le tour
    endTurn(game);
    return;
  }

  game.gameState.choices.idSelectedChoice = choiceId;
  game.gameState.grid = GameService.grid.resetCanBeCheckedCells(
    game.gameState.grid,
  );
  game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(
    choiceId,
    game.gameState.grid,
  );
  updateClientsViewChoices(game);
  updateClientsViewGrid(game);

  await sleep(THINK_DELAY);
  if (game.gameState.currentTurn !== botKey) return;

  // Placement
  const cellChoice = selectBestCell(
    choiceId,
    game.gameState,
    botKey,
    opponentKey,
    difficulty,
  );

  if (!cellChoice) {
    endTurn(game);
    return;
  }

  game.gameState.grid = GameService.grid.resetCanBeCheckedCells(
    game.gameState.grid,
  );
  game.gameState.grid = GameService.grid.selectCell(
    cellChoice.cellId,
    cellChoice.rowIndex,
    cellChoice.cellIndex,
    botKey,
    game.gameState.grid,
  );

  if (botKey === "player:1") game.gameState.player1PiecesLeft--;
  else game.gameState.player2PiecesLeft--;

  updateClientsViewGrid(game);

  const { points, isInstantWin } = GameService.score.checkAlignments(
    botKey,
    game.gameState.grid,
  );

  if (isInstantWin) {
    endGame(game, botKey, "ALIGNMENT");
    return;
  }

  if (points > 0) {
    if (botKey === "player:1") game.gameState.player1Score += points;
    else game.gameState.player2Score += points;
    updateClientsViewScores(game);
  }

  if (GameService.score.checkWinByPiecesOut(game.gameState)) {
    const winnerKey =
      game.gameState.player1Score >= game.gameState.player2Score
        ? "player:1"
        : "player:2";
    endGame(game, winnerKey, "PIECES_OUT");
    return;
  }

  endTurn(game);
};

registerBotTurnCallback(botTakeTurn);
