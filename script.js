const cells = document.querySelectorAll('.cell');
const resultText = document.getElementById('resultText');
const resetBtn = document.getElementById('resetBtn');
const modePopup = document.getElementById('modePopup');
const friendBtn = document.getElementById('friendBtn');
const computerBtn = document.getElementById('computerBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let mode = '';
let popupShown = false; // To track if the popup is already shown

// Winning conditions
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Show the mode selection pop-up only once
if (!popupShown) {
    modePopup.style.display = 'flex';
    popupShown = true;
}

// Add event listeners for the mode selection buttons
friendBtn.addEventListener('click', () => {
    mode = 'friend';
    modePopup.style.display = 'none'; // Hide mode selection
    startGame(); // Start game with two players
});

computerBtn.addEventListener('click', () => {
    mode = 'computer';
    modePopup.style.display = 'none'; // Hide mode selection
    startGame(); // Start game with player vs. computer
});

// Start the game
function startGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    resultText.textContent = '';
    cells.forEach(cell => {
        cell.innerHTML = ''; // Clear the cell content
        cell.classList.remove('win'); // Remove winning highlight class
        cell.removeEventListener('click', handleCellClick); // Remove old event listeners
        cell.addEventListener('click', handleCellClick); // Add new event listeners
    });

    // If computer starts, make its move
    if (mode === 'computer' && currentPlayer === 'O') {
        setTimeout(computerTurn, 1000); // Trigger computer's turn after 1 second
    }
}

// Handle cell click
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = clickedCell.getAttribute('data-index');

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer; // Add the symbol to the cell

    checkResult();

    // Disable clicking on cells until the computer plays
    if (mode === 'computer' && gameActive) {
        cells.forEach(cell => cell.style.pointerEvents = 'none'); // Disable further clicks
        setTimeout(computerTurn, 1000); // Delay the computer's move by 1 second
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch players for friend mode
    }
}

// Check if the current player has won or if the game is a draw
function checkResult() {
    let roundWon = false;
    let winningCombination = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCombination = [a, b, c]; // Capture the winning combination
            break;
        }
    }

    if (roundWon) {
        highlightWinningCells(winningCombination); // Highlight all three winning cells
        resultText.textContent = `${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        resultText.textContent = 'It\'s a draw!';
        gameActive = false;
    }
}

// Highlight the winning cells
function highlightWinningCells(winCondition) {
    winCondition.forEach(index => {
        cells[index].classList.add('win'); // Add class to highlight
    });
}

// Computer's turn
function computerTurn() {
    // Smart logic for computer's turn
    let moveMade = false;

    // Check if the computer can win
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') {
            board[c] = 'O';
            cells[c].textContent = 'O';
            moveMade = true;
            break;
        }
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') {
            board[b] = 'O';
            cells[b].textContent = 'O';
            moveMade = true;
            break;
        }
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') {
            board[a] = 'O';
            cells[a].textContent = 'O';
            moveMade = true;
            break;
        }
    }

    // If no winning move, block player's winning move
    if (!moveMade) {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] === 'X' && board[b] === 'X' && board[c] === '') {
                board[c] = 'O';
                cells[c].textContent = 'O';
                moveMade = true;
                break;
            }
            if (board[a] === 'X' && board[c] === 'X' && board[b] === '') {
                board[b] = 'O';
                cells[b].textContent = 'O';
                moveMade = true;
                break;
            }
            if (board[b] === 'X' && board[c] === 'X' && board[a] === '') {
                board[a] = 'O';
                cells[a].textContent = 'O';
                moveMade = true;
                break;
            }
        }
    }

    // If no win or block, make a random move
    if (!moveMade) {
        const emptyCells = board.map((value, index) => value === '' ? index : null).filter(index => index !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        board[randomIndex] = 'O'; // Computer plays as 'O'
        cells[randomIndex].textContent = 'O'; // Add symbol to the cell
    }

    checkResult(); // Check for the result after computer's turn

    // Re-enable clicking on cells for the player
    cells.forEach(cell => cell.style.pointerEvents = 'auto'); // Enable clicks again
}

// Reset the game
resetBtn.addEventListener('click', () => {
    startGame(); // Restart the game
});