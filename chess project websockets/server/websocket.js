const { Game } = require('./gameLogic');

let game = new Game();

function handleWebSocketConnection(ws) {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        switch (parsedMessage.type) {
            case 'INIT_GAME':
                game = new Game();
                game.setPlayerTeam('A', parsedMessage.playerA);
                game.setPlayerTeam('B', parsedMessage.playerB);
                broadcastGameState(ws);
                break;
            case 'MAKE_MOVE':
                const { player, character, move } = parsedMessage;
                if (player === game.currentPlayer) {
                    const validMove = game.moveCharacter(player, character, move);
                    if (validMove) {
                        broadcastGameState(ws);
                    } else {
                        ws.send(JSON.stringify({ type: 'INVALID_MOVE' }));
                    }
                }
                break;
            default:
                break;
        }
    });
}

function broadcastGameState(ws) {
    const gameState = game.getGameState();
    ws.send(JSON.stringify({ type: 'UPDATE_GAME', gameState }));
}

module.exports = { handleWebSocketConnection };
