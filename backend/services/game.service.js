const TURN_DURATION = 30;

const DECK_INIT = {
    dices: [
        { id: 1, value: '', locked: true },
        { id: 2, value: '', locked: true },
        { id: 3, value: '', locked: true },
        { id: 4, value: '', locked: true },
        { id: 5, value: '', locked: true },
    ],
    rollsCounter: 1,
    rollsMaximum: 3
};

const CHOICES_INIT = {
    isDefi: false,
    isSec: false,
    idSelectedChoice: null,
    availableChoices: [],
};

const ALL_COMBINATIONS = [
    { value: 'Brelan1', id: 'brelan1' },
    { value: 'Brelan2', id: 'brelan2' },
    { value: 'Brelan3', id: 'brelan3' },
    { value: 'Brelan4', id: 'brelan4' },
    { value: 'Brelan5', id: 'brelan5' },
    { value: 'Brelan6', id: 'brelan6' },
    { value: 'Full', id: 'full' },
    { value: 'Carré', id: 'carre' },
    { value: 'Yam', id: 'yam' },
    { value: 'Suite', id: 'suite' },
    { value: '≤8', id: 'moinshuit' },
    { value: 'Sec', id: 'sec' },
    { value: 'Défi', id: 'defi' }
];

const GRID_INIT = [
    [
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    ]
];

// ------------------------------------
// -------- HELPERS -------------------
// ------------------------------------

const getSocket = (playerKey, game) =>
    playerKey === 'player:1' ? game.player1Socket : game.player2Socket;

const getOpponentSocket = (playerKey, game) =>
    playerKey === 'player:1' ? game.player2Socket : game.player1Socket;

const rollDice = () => String(Math.floor(Math.random() * 6) + 1);

const analyzeDices = (dices) => {
    const counts = Array(7).fill(0);
    let sum = 0;

    for (const dice of dices) {
        const val = parseInt(dice.value);
        counts[val]++;
        sum += val;
    }

    let hasPair = false;
    let hasThreeOfAKind = false;
    let threeOfAKindValue = null;
    let hasFourOfAKind = false;
    let hasFiveOfAKind = false;

    for (let i = 1; i <= 6; i++) {
        if (counts[i] >= 2) hasPair = true;
        if (counts[i] >= 3) { hasThreeOfAKind = true; threeOfAKindValue = i; }
        if (counts[i] >= 4) hasFourOfAKind = true;
        if (counts[i] >= 5) hasFiveOfAKind = true;
    }

    const sortedValues = dices.map(d => parseInt(d.value)).sort((a, b) => a - b);
    const hasStraight = sortedValues.every((v, i) => i === 0 || v === sortedValues[i - 1] + 1);

    return { counts, sum, hasPair, hasThreeOfAKind, threeOfAKindValue, hasFourOfAKind, hasFiveOfAKind, hasStraight };
};

// ------------------------------------
// -------- SERVICE -------------------
// ------------------------------------

const GameService = {

    init: {
        gameState: () => ({
            idGame: null,
            gameState: {
                currentTurn: 'player:1',
                timer: TURN_DURATION,
                player1Score: 0,
                player2Score: 0,
                deck: { ...DECK_INIT, dices: DECK_INIT.dices.map(d => ({ ...d })) },
                choices: { ...CHOICES_INIT },
                grid: GRID_INIT.map(row => row.map(cell => ({ ...cell }))),
            }
        }),

        deck: () => ({ ...DECK_INIT, dices: DECK_INIT.dices.map(d => ({ ...d })) }),

        choices: () => ({ ...CHOICES_INIT }),

        grid: () => GRID_INIT.map(row => row.map(cell => ({ ...cell }))),
    },

    send: {
        forPlayer: {
            viewGameState: (playerKey, game) => ({
                inQueue: false,
                inGame: true,
                idPlayer: getSocket(playerKey, game).id,
                idOpponent: getOpponentSocket(playerKey, game).id,
            }),

            viewQueueState: () => ({ inQueue: true, inGame: false }),

            gameTimer: (playerKey, gameState) => {
                const isMyTurn = gameState.currentTurn === playerKey;
                return {
                    playerTimer: isMyTurn ? gameState.timer : 0,
                    opponentTimer: isMyTurn ? 0 : gameState.timer,
                };
            },

            gridViewState: (playerKey, gameState) => ({
                displayGrid: true,
                canSelectCells: (playerKey === gameState.currentTurn) && (gameState.choices.availableChoices.length > 0),
                grid: gameState.grid,
            }),

            deckViewState: (playerKey, gameState) => ({
                displayPlayerDeck: gameState.currentTurn === playerKey,
                displayOpponentDeck: gameState.currentTurn !== playerKey,
                displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
                rollsCounter: gameState.deck.rollsCounter,
                rollsMaximum: gameState.deck.rollsMaximum,
                dices: gameState.deck.dices,
            }),

            choicesViewState: (playerKey, gameState) => ({
                displayChoices: true,
                canMakeChoice: playerKey === gameState.currentTurn,
                idSelectedChoice: gameState.choices.idSelectedChoice,
                availableChoices: gameState.choices.availableChoices,
            }),
        }
    },

    timer: {
        getTurnDuration: () => TURN_DURATION,
    },

    dices: {
        roll: (dices) => dices.map(dice => {
            if (dice.locked && dice.value !== '') return dice;
            return { ...dice, value: rollDice(), locked: false };
        }),

        lockEveryDice: (dices) => dices.map(dice => ({ ...dice, locked: true })),
    },

    choices: {
        findCombinations: (dices, isDefi, isSec) => {
            const { sum, hasPair, hasThreeOfAKind, threeOfAKindValue, hasFourOfAKind, hasFiveOfAKind, hasStraight } = analyzeDices(dices);
            const isLessThanEqual8 = sum <= 8;

            const availableCombinations = ALL_COMBINATIONS.filter(combination =>
                (combination.id.includes('brelan') && hasThreeOfAKind && parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
                (combination.id === 'full' && hasPair && hasThreeOfAKind) ||
                (combination.id === 'carre' && hasFourOfAKind) ||
                (combination.id === 'yam' && hasFiveOfAKind) ||
                (combination.id === 'suite' && hasStraight) ||
                (combination.id === 'moinshuit' && isLessThanEqual8) ||
                (combination.id === 'defi' && isDefi)
            );

            const notOnlyBrelan = availableCombinations.some(c => !c.id.includes('brelan'));
            if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
                availableCombinations.push(ALL_COMBINATIONS.find(c => c.id === 'sec'));
            }

            return availableCombinations;
        }
    },

    grid: {
        resetCanBeCheckedCells: (grid) =>
            grid.map(row => row.map(cell => ({ ...cell, canBeChecked: false }))),

        updateGridAfterSelectingChoice: (idSelectedChoice, grid) =>
            grid.map(row => row.map(cell =>
                cell.id === idSelectedChoice && cell.owner === null
                    ? { ...cell, canBeChecked: true }
                    : cell
            )),

        selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) =>
            grid.map((row, rIdx) => row.map((cell, cIdx) =>
                cell.id === idCell && rIdx === rowIndex && cIdx === cellIndex
                    ? { ...cell, owner: currentTurn }
                    : cell
            )),

        isAnyCombinationAvailableOnGridForPlayer: (gameState) => {
            const availableIds = new Set(gameState.choices.availableChoices.map(c => c.id));
            return gameState.grid.flat().some(cell => cell.owner === null && availableIds.has(cell.id));
        },
    },

    utils: {
        findGameIndexById: (games, idGame) =>
            games.findIndex(g => g.idGame === idGame),

        findGameIndexBySocketId: (games, socketId) =>
            games.findIndex(g => g.player1Socket.id === socketId || g.player2Socket.id === socketId),

        findDiceIndexByDiceId: (dices, idDice) =>
            dices.findIndex(d => d.id === idDice),
    }
};

module.exports = GameService;
