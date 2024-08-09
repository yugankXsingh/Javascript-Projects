const gameInfo = document.querySelector('.game-info');
const boxes = document.querySelectorAll('.box');
const newGameBtn = document.querySelector('.btn');

let currPlayer;
let gameGrid;

const winningPositions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6] // Diagonal
]

// Initialize game
function init() {
    currPlayer = "X";
    gameGrid = ["", "", "", "", "", "", "", "", ""]; // 3x3 grid
    newGameBtn.classList.remove("active");
    gameInfo.innerText = `Player ${currPlayer}'s turn`;

    // Remove CSS properties from winning boxes
    boxes.forEach((box) => {
        box.classList.remove("win");
    });

    boxes.forEach((box, index) => {
        box.innerText = "";
        box.style.pointerEvents = "all"; // Enable box
    });
}

init();

boxes.forEach((box, index) => { // Add click event to each box
    box.addEventListener("click", () => {
        handleClick(index);
    })
});

function swapPlayer() {
    if (currPlayer === "X") {
        currPlayer = "O";
    } else {
        currPlayer = "X";
    }

    // Update game info
    gameInfo.innerText = `Player ${currPlayer}'s turn`;
}

function checkGameOver() {
    let answer = "";

    winningPositions.forEach((position) => {
        if (gameGrid[position[0]] === gameGrid[position[1]] && gameGrid[position[1]] === gameGrid[position[2]] && gameGrid[position[0]] !== "") {
            answer = gameGrid[position[0]];

            // add green color to winning boxes
            boxes[position[0]].classList.add("win");
            boxes[position[1]].classList.add("win");
            boxes[position[2]].classList.add("win");

            // Disable all boxes
            // pointer events are disabled to prevent further clicks
            boxes.forEach((box) => {
                box.style.pointerEvents = "none";
            });
        }
    });

    if (answer !== "") {
        //now we have a winner
        gameInfo.innerText = `Player ${answer} wins !`;
        // Display new game button
        newGameBtn.classList.add("active");
        return;
    }

    // lets check if the game is a draw
    if (!gameGrid.includes("")) { // No empty boxes
        gameInfo.innerText = "It's a draw !";
        // Display new game button
        newGameBtn.classList.add("active");
        return;
    }
}

function handleClick(index) {
    if (gameGrid[index] == "") {
        boxes[index].innerText = currPlayer; // Update box with current player
        gameGrid[index] = currPlayer;
        boxes[index].style.pointerEvents = "none"; // Disable box

        // swap player
        swapPlayer();

        // Check for winner
        checkGameOver();
    }
}

newGameBtn.addEventListener("click", init); // Start new game
