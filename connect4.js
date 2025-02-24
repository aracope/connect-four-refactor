/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
document.addEventListener("DOMContentLoaded", () => {

  let game; // Global variable for game instance

  class Player {
    constructor(color) {
      this.color = color;
    }
  }

  class Game {
    constructor(height = 6, width = 7, playerColors = ['red', 'blue']) {
      this.height = height;
      this.width = width;

      // Ensure colors are set
      this.players = playerColors.map(color => new Player(color));
      this.currPlayer = this.players[0]; // active player: 1 or 2
      this.board = []; // array of rows, each row is array of cells  (board[y][x])
      this.isGameOver = false; // New property to track game state
      this.makeBoard();
      this.makeHtmlBoard();
    }

    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */

    makeBoard() {
      this.board = Array.from({ length: this.height }, () => Array(this.width).fill(null));
    }

    /** makeHtmlBoard: make HTML table and row of column tops. */

    makeHtmlBoard() {
      const board = document.getElementById('board');
      if (!board) return; // Safety check 
      board.innerHTML = ''; // Clear any existing content

      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
      top.addEventListener('click', this.handleClick.bind(this));

      for (let x = 0; x < this.width; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
      board.append(top);

      // make main part of board (grid)
      for (let y = 0; y < this.height; y++) {
        const row = document.createElement('tr');

        for (let x = 0; x < this.width; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
        board.append(row);
      }
    }
    /** findSpotForCol: given column x, return top empty y (null if filled) */

    findSpotForCol(x) {
      for (let y = this.height - 1; y >= 0; y--) {
        if (!this.board[y][x])
          return y;
      }
      return null;
    }

    /** placeInTable: update DOM to place piece into HTML table of board */

    placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = this.currPlayer.color; // Set piece color
      piece.style.top = -50 * (y + 2);

      document.getElementById(`${y}-${x}`).append(piece);
    }

    /** endGame: announce game end */

    endGame(msg) {
      alert(msg);
      if (this.isGameOver) return;

      this.isGameOver = true;
    }

    /** handleClick: handle click of column top to play piece */

    handleClick(evt) {
      if (this.isGameOver) return; // Prevent moves after game is over

      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null)
        return;

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin())
        return this.endGame(`Player with color ${this.currPlayer.color} won!`);

      // check for tie
      if (this.board.every(row => row.every(cell => cell)))
        return this.endGame('Tie!');

      // switch players
      this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */
    checkForWin() {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      const _win = cells => cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [
            [y, x],
            [y, x + 1],
            [y, x + 2],
            [y, x + 3]
          ];
          const vert = [
            [y, x],
            [y + 1, x],
            [y + 2, x],
            [y + 3, x]
          ];
          const diagDR = [
            [y, x],
            [y + 1, x + 1],
            [y + 2, x + 2],
            [y + 3, x + 3]
          ];
          const diagDL = [
            [y, x],
            [y + 1, x - 1],
            [y + 2, x - 2],
            [y + 3, x - 3]
          ];

          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL))
            return true;
        }
      }
      return false;
    }

    // Reset the game state to start a new game
    startNewGame() {
      const p1Color = document.getElementById('p1Color').value;
      const p2Color = document.getElementById('p2Color').value;

      // Re-create the players with the new colors
      this.players = [new Player(p1Color), new Player(p2Color)];
      this.currPlayer = this.players[0]; // Ensure the first player starts correctly

      this.isGameOver = false;

      // Clear old pieces from the board
      const pieces = document.querySelectorAll('.piece');
      pieces.forEach(piece => piece.remove());

      this.makeBoard(); // Reset board
      this.makeHtmlBoard(); // Render new board

      // Hide the modal when the game starts
      document.getElementById('color-modal').classList.add('hidden');
    }
  }

  // Start a new game when "Start Game" button is clicked
  document.getElementById('startGame').addEventListener('click', () => {
    if (game) {
      game.startNewGame(); // Reset existing game
    } else {
      const p1Color = document.getElementById('p1Color').value;
      const p2Color = document.getElementById('p2Color').value;
      game = new Game(6, 7, [p1Color, p2Color]);
    }
  });

  // Create a new game instance with chosen colors
  game = new Game();
});