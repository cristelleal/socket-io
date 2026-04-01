import { Socket } from "socket.io";
import { games } from "../../shared/state";
import { GameService } from "./game.service";
import {
  updateClientsViewDecks,
  updateClientsViewChoices,
  updateClientsViewGrid,
  updateClientsViewScores,
} from "./game.emitter";
import { endTurn, endGame } from "./game.actions";

export const registerGameHandlers = (socket: Socket): void => {
  socket.on("game.dices.roll", () => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(
      games,
      socket.id,
    );
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
    game.gameState.choices.availableChoices =
      GameService.choices.findCombinations(deck.dices, false, isSec);
    game.gameState.choices.isYamPredatorMode =
      GameService.score.canUseYamPredator(deck.dices);

    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
  });

  socket.on("game.dices.lock", (idDice: number) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(
      games,
      socket.id,
    );
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    const diceIndex = GameService.utils.findDiceIndexByDiceId(
      game.gameState.deck.dices,
      idDice,
    );
    game.gameState.deck.dices[diceIndex].locked =
      !game.gameState.deck.dices[diceIndex].locked;

    updateClientsViewDecks(game);
  });

  socket.on("game.choices.selected", (data: { choiceId: string }) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(
      games,
      socket.id,
    );
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    game.gameState.choices.idSelectedChoice = data.choiceId;
    game.gameState.grid = GameService.grid.resetCanBeCheckedCells(
      game.gameState.grid,
    );
    game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(
      data.choiceId,
      game.gameState.grid,
    );

    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
  });

  socket.on(
    "game.grid.selected",
    (data: { cellId: string; rowIndex: number; cellIndex: number }) => {
      const gameIndex = GameService.utils.findGameIndexBySocketId(
        games,
        socket.id,
      );
      if (gameIndex === -1) return;

      const game = games[gameIndex];
      const currentTurn = game.gameState.currentTurn;

      game.gameState.grid = GameService.grid.resetCanBeCheckedCells(
        game.gameState.grid,
      );
      game.gameState.grid = GameService.grid.selectCell(
        data.cellId,
        data.rowIndex,
        data.cellIndex,
        currentTurn,
        game.gameState.grid,
      );

      if (currentTurn === "player:1") game.gameState.player1PiecesLeft--;
      else game.gameState.player2PiecesLeft--;

      const { points, isInstantWin } = GameService.score.checkAlignments(
        currentTurn,
        game.gameState.grid,
      );

      if (isInstantWin) {
        endGame(game, currentTurn, "ALIGNMENT");
        return;
      }

      if (points > 0) {
        if (currentTurn === "player:1") game.gameState.player1Score += points;
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
    },
  );

  socket.on(
    "game.grid.remove",
    (data: { rowIndex: number; cellIndex: number }) => {
      const gameIndex = GameService.utils.findGameIndexBySocketId(
        games,
        socket.id,
      );
      if (gameIndex === -1) return;

      const game = games[gameIndex];
      if (!game.gameState.choices.isYamPredatorMode) return;

      game.gameState.grid = GameService.grid.removeCell(
        data.rowIndex,
        data.cellIndex,
        game.gameState.grid,
      );

      const opponent =
        game.gameState.currentTurn === "player:1" ? "player:2" : "player:1";
      if (opponent === "player:1") game.gameState.player1PiecesLeft++;
      else game.gameState.player2PiecesLeft++;

      game.gameState.choices.isYamPredatorMode = false;

      updateClientsViewGrid(game);
      updateClientsViewScores(game);
      endTurn(game);
    },
  );
};
