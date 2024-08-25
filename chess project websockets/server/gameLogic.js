class Game {
    constructor() {
        this.board = this.initializeBoard();
        this.players = ['A', 'B'];
        this.currentPlayer = this.players[0];
    }

    initializeBoard() {
        const board = Array(5).fill(null).map(() => Array(5).fill(null));
        return board;
    }

    setPlayerTeam(player, positions) {
        const row = player === 'A' ? 0 : 4;
        positions.forEach((char, index) => {
            this.board[row][index] = `${player}-${char}`;
        });
    }

    moveCharacter(player, character, move) {
        const [startRow, startCol] = this.findCharacterPosition(player, character);
        if (startRow === -1 || startCol === -1) return false;
        const [newRow, newCol] = this.calculateNewPosition(startRow, startCol, move, character);
        if (!this.isValidMove(newRow, newCol, player)) return false;

        // Move character and update board
        this.board[startRow][startCol] = null;
        this.board[newRow][newCol] = `${player}-${character}`;

        // Handle kills for Hero1 and Hero2
        if (character.startsWith('H')) {
            const path = this.getPath(startRow, startCol, newRow, newCol);
            path.forEach(([r, c]) => {
                if (this.board[r][c] && !this.board[r][c].startsWith(player)) {
                    this.board[r][c] = null; // kill opponent's character
                }
            });
        }

        this.switchPlayer();
        return true;
    }

    findCharacterPosition(player, character) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j] === `${player}-${character}`) {
                    return [i, j];
                }
            }
        }
        return [-1, -1];
    }

    calculateNewPosition(row, col, move, character) {
        let newRow = row, newCol = col;
        const steps = character.startsWith('H') ? 2 : 1;

        switch (move) {
            case 'L':
                newCol -= steps;
                break;
            case 'R':
                newCol += steps;
                break;
            case 'F':
                newRow -= steps;
                break;
            case 'B':
                newRow += steps;
                break;
            case 'FL':
                newRow -= steps;
                newCol -= steps;
                break;
            case 'FR':
                newRow -= steps;
                newCol += steps;
                break;
            case 'BL':
                newRow += steps;
                newCol -= steps;
                break;
            case 'BR':
                newRow += steps;
                newCol += steps;
                break;
            default:
                break;
        }

        return [newRow, newCol];
    }

    isValidMove(newRow, newCol, player) {
        if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 5) return false;
        if (this.board[newRow][newCol] && this.board[newRow][newCol].startsWith(player)) return false;
        return true;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    getPath(startRow, startCol, newRow, newCol) {
        const path = [];
        const rowStep = newRow > startRow ? 1 : (newRow < startRow ? -1 : 0);
        const colStep = newCol > startCol ? 1 : (newCol < startCol ? -1 : 0);

        let r = startRow + rowStep;
        let c = startCol + colStep;

        while (r !== newRow || c !== newCol) {
            path.push([r, c]);
            r += rowStep;
            c += colStep;
        }

        return path;
    }

    checkWinCondition() {
        const alive = { A: false, B: false };

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j]) {
                    alive[this.board[i][j][0]] = true;
                }
            }
        }

        if (!alive.A) return 'B';
        if (!alive.B) return 'A';
        return null;
    }

    getGameState() {
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,
            winner: this.checkWinCondition(),
        };
    }
}

module.exports = { Game };
