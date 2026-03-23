const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------
let games = [];
let queue = [];

// ------------------------------------
// -------- EMITTER METHODS -----------
// ------------------------------------

const updateClientsViewTimers = (game) => {
  game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
  game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
};

const updateClientsViewDecks = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
    game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
  }, 200);
};

const updateClientsViewChoices = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:1', game.gameState));
    game.player2Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:2', game.gameState));
  }, 200);
}

const updateClientsViewGrid = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:1', game.gameState));
    game.player2Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:2', game.gameState));
  }, 200);
};

// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------

const endTurn = (game) => {
  game.gameState.currentTurn = game.gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
  game.gameState.timer = GameService.timer.getTurnDuration();
  game.gameState.deck = GameService.init.deck();
  game.gameState.choices = GameService.init.choices();
  game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);

  updateClientsViewTimers(game);
  updateClientsViewDecks(game);
  updateClientsViewChoices(game);
  updateClientsViewGrid(game);
};

const createGame = (player1Socket, player2Socket) => {
  const newGame = GameService.init.gameState();
  newGame['idGame'] = uniqid();
  newGame['player1Socket'] = player1Socket;
  newGame['player2Socket'] = player2Socket;

  games.push(newGame);

  const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);
  const game = games[gameIndex];

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

const newPlayerInQueue = (socket) => {

  queue.push(socket);

  // 'queue' management
  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket);
  }
  else {
    socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
  }
};

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------

io.on('connection', socket => {
  console.log(`[${socket.id}] socket connected`);

  socket.on('queue.join', () => {
    console.log(`[${socket.id}] new player in queue `)
    newPlayerInQueue(socket);
  });

  socket.on('game.dices.roll', () => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    const deck = game.gameState.deck;

    if (deck.rollsCounter > deck.rollsMaximum) return;

    deck.dices = GameService.dices.roll(deck.dices);
    deck.rollsCounter++;

    const isLastRoll = deck.rollsCounter > deck.rollsMaximum;
    if (isLastRoll) {
      deck.dices = GameService.dices.lockEveryDice(deck.dices);
    }

    const isSec = deck.rollsCounter === 2;
    game.gameState.choices.availableChoices = GameService.choices.findCombinations(deck.dices, false, isSec);

    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
  });

  socket.on('game.dices.lock', (idDice) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    const diceIndex = GameService.utils.findDiceIndexByDiceId(game.gameState.deck.dices, idDice);
    game.gameState.deck.dices[diceIndex].locked = !game.gameState.deck.dices[diceIndex].locked;

    updateClientsViewDecks(game);
  });

  socket.on('game.choices.selected', (data) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    game.gameState.choices.idSelectedChoice = data.choiceId;
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);
    game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(data.choiceId, game.gameState.grid);

    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
  });

  socket.on('game.grid.selected', (data) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    if (gameIndex === -1) return;

    const game = games[gameIndex];
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);
    game.gameState.grid = GameService.grid.selectCell(data.cellId, data.rowIndex, data.cellIndex, game.gameState.currentTurn, game.gameState.grid);

    // TODO: Calculer le score
    // TODO: Vérifier les conditions de victoire (lignes / diagonales / grille pleine)

    endTurn(game);
  });

  socket.on('disconnect', reason => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get('/', (req, res) => res.sendFile('index.html'));

http.listen(3000, function () {
  console.log('listening on *:3000');
});
