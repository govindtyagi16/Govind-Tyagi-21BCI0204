import React, { useState, useEffect } from 'react';
import './App.css';

const socket = new WebSocket('ws://localhost:8080');

function App() {
    const [gameState, setGameState] = useState(null);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [player, setPlayer] = useState('A');

    useEffect(() => {
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'UPDATE_GAME') {
                setGameState(message.gameState);
            } else if (message.type === 'INVALID_MOVE') {
                alert('Invalid move!');
            }
        };
    }, []);

    const handleSelectCharacter = (char) => {
        setSelectedCharacter(char);
    };

    const handleMove = (move) => {
        if (selectedCharacter) {
            socket.send(JSON.stringify({
                type: 'MAKE_MOVE',
                player,
                character: selectedCharacter,
                move,
            }));
        }
    };

    const renderBoard = () => {
        if (!gameState) return null;

        return gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                    <div key={colIndex} className="cell">
                        {cell && (
                            <div
                                className={`character ${cell.startsWith(player) ? 'my-character' : ''}`}
                                onClick={() => handleSelectCharacter(cell.split('-')[1])}
                            >
                                {cell}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ));
    };

    const renderControls = () => {
        return (
            <div className="controls">
                <button onClick={() => handleMove('L')}>Left</button>
                <button onClick={() => handleMove('R')}>Right</button>
                <button onClick={() => handleMove('F')}>Forward</button>
                <button onClick={() => handleMove('B')}>Backward</button>
                <button onClick={() => handleMove('FL')}>Forward-Left</button>
                <button onClick={() => handleMove('FR')}>Forward-Right</button>
                <button onClick={() => handleMove('BL')}>Backward-Left</button>
                <button onClick={() => handleMove('BR')}>Backward-Right</button>
            </div>
        );
    };

    const handleInitializeGame = () => {
        const playerA = prompt('Enter team A characters (e.g., S1 H1 S2):').split(' ');
        const playerB = prompt('Enter team B characters (e.g., S1 H1 S2):').split(' ');
        socket.send(JSON.stringify({
            type: 'INIT_GAME',
            playerA,
            playerB,
        }));
    };

    return (
        <div className="App">
            <h1>Turn-Based Chess-Like Game</h1>
            <button onClick={handleInitializeGame}>Initialize Game</button>
            {renderBoard()}
            {gameState && !gameState.winner && renderControls()}
            {gameState && gameState.winner && (
                <div className="winner">
                    <h2>Player {gameState.winner} Wins!</h2>
                </div>
            )}
        </div>
    );
}

export default App;
