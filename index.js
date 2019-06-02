const nought = "O";
const cross = "X";

function Cell(element) {
    this.element = element;
    this.type = "";
    this.value = 0;
    this.element.style.backGroundColor = "white";
    this.select = function (symbol) {
        if (!(this.type === "")) {
            return false;
        }
        if ((symbol === "X") || (symbol === "O")) {
            this.type = symbol;
            this.element.innerHTML = symbol;
            if (symbol === "X") {
                this.value = 1;
            } else if (symbol === "O") {
                this.value = -1;
            }
            return true;
        }

        return false;

    }
    this.reset = function () {
        this.type = "";
        this.value = 0;
        this.element.innerHTML = "";
    }
}

function Player(symbol) {
    this.symbol = symbol;
    this.getSymbol = function () {
        return this.symbol;
    }
}

function Board() {
    this.players = [];
    this.currentPlayer;
    this.turnsTaken = 0;
    this.endGameDetected = false;
    this.playerChoice;
    this.playerOneScore = 0;
    this.playerTwoScore = 0;
    this.statOne = document.getElementById("score--stat1");
    this.statTwo = document.getElementById("score--stat2");;
    this.modal = document.querySelector(".modal");
    this.toggleModal = function () {
        this.modal.classList.toggle("show-modal");
    }
    this.startGame = function () {
        modalStart = document.querySelector(".modal-choice");
        modalStart.classList.toggle("show-modal");

    }
    this.choice = function () {
        // let playerChoice;
        let b = this;
        let choiceX = document.querySelector(".choice-x");
        let choiceO = document.querySelector(".choice-o");
        choiceX.addEventListener("click", function () {
            b.playerChoice = true;
            b.startGame();
            b.setUp();
        });
        choiceO.addEventListener("click", function () {
            b.playerChoice = false;
            b.startGame();
            b.setUp();
        });
    }
    this.setUp = function () {
        let cells = document.querySelectorAll(".cell");
        let scoreboard = document.querySelector(".scoreboard");
        // let modal = document.querySelector(".modal");
        let playerOne = new Player("X");
        let playerTwo = new Player("O");
        this.players.push(playerOne, playerTwo);
        if (this.playerChoice === true) {
            this.currentPlayer = playerOne;
        } else {
            this.currentPlayer = playerTwo;
        }
        //  populate cells array with cell elements. 
        let curArr = 0;
        for (let i = 0; i < cells.length; i++) {
            if (this.cells[curArr].length === 3) {
                curArr++;
            }
            //get the board
            let b = this;
            //get instance of current player
            // c refers to cell constructor (element)
            let c = new Cell(cells[i]);
            this.cells[curArr].push(c);

            let closeButton = document.querySelector(".close-button");
            closeButton.addEventListener("click", function () {
                b.toggleModal();
                // b.restart();
            });

            c.element.addEventListener("click", () => {
                if (!b.endGameDetected) {
                    if (c.select(b.currentPlayer.symbol)) {
                        b.changePlayer();
                        b.turnsTaken++;
                        b.endGameDetected = b.isGameOver();
                    }
                }
                if (b.endGameDetected) {
                    b.toggleModal();
                }
            });
        }

    }
    this.isGameOver = function () {
        let headerEndGame = document.querySelector(".end-game");
        let counterDia, counterDiaL, offsetInvertDia, winningCells;
        counterDia = 0;
        counterDiaL = 0;
        offsetInvertDia = 2;
        winningCells = [];
        // let cell = this.cells[0][0];

        for (let i = 0; i <= 2; i++) {
            let counterAcross = 0;
            let counterDown = 0;
            let row1 = 0;
            let row2 = 0;
            let row3 = 0;
            let column1 = 0;
            let column2 = 0;
            let column3 = 0;
            //checks if game is won across
            for (let j = 0; j <= 2; j++) {

                counterAcross += this.cells[i][j].value;
                counterDown += this.cells[j][i].value;

                //check each row and column
                row1 += this.cells[0][j].value;
                row2 += this.cells[1][j].value;
                row3 += this.cells[2][j].value;
                column1 += this.cells[j][0].value;
                column2 += this.cells[j][1].value;
                column3 += this.cells[j][2].value;
                if ((row1 === 3) || (row1 === -3)) {
                    for (let x = 0; x <= 2; x++) {
                        this.cells[0][x].element.style.backgroundColor = "#32CD32";
                    }
                }
                if ((row2 === 3) || (row2 === -3)) {
                    for (let x = 0; x <= 2; x++) {
                        this.cells[1][x].element.style.backgroundColor = "#32CD32";
                    }
                }

                if ((row3 === 3) || (row3 === -3)) {
                    for (let x = 0; x <= 2; x++) {
                        this.cells[2][x].element.style.backgroundColor = "#32CD32";
                    }
                }

                if ((column1 === 3) || (column1 === -3)) {
                    for (let x = 0; x <= 2; x++) {
                        this.cells[x][0].element.style.backgroundColor = "#32CD32";
                    }
                }
                if ((column2 === 3) || (column2 === -3)) {
                    for (let x = 0; x <= 2; x++) {
                        this.cells[x][1].element.style.backgroundColor = "#32CD32";
                    }
                }
                if ((column3 === 3) || (column3 === -3)) {
                    for (let x = 0; x <= 2; x++) {
                        this.cells[x][2].element.style.backgroundColor = "#32CD32";
                    }
                }


                //checking general rows and columns
                //checks across
                if (counterAcross === 3) {
                    // console.log(this.cells[i][j]);

                    headerEndGame.insertAdjacentHTML("afterend", '<p class="won">Crosses won across!</p>');
                    this.playerOneScore++;
                    this.statOne.textContent = `Player Crosses: ${this.playerOneScore}`;

                    return true;
                } else if (counterAcross === -3) {
                    headerEndGame.insertAdjacentHTML("afterend", '<p class="won">Noughts won across!</p>');
                    this.playerTwoScore++;
                    this.statTwo.textContent = `Player Noughts: ${this.playerTwoScore}`;
                    return true;
                    //checks down
                } else if (counterDown === 3) {
                    headerEndGame.insertAdjacentHTML("afterend", '<p class="won">Crosses won down!</p>');
                    this.playerOneScore++;
                    this.statOne.textContent = `Player Crosses: ${this.playerOneScore}`;
                    return true;
                } else if (counterDown === -3) {
                    headerEndGame.insertAdjacentHTML("afterend", '<p class="won">Noughts won down!</p>');
                    this.playerTwoScore++;
                    this.statTwo.textContent = `Player Noughts: ${this.playerTwoScore}`;
                    return true;
                }
                // console.log(winningCells);

            }
            counterDia += this.cells[i][i].value;
            counterDiaL += this.cells[i][offsetInvertDia].value;

            //checking win state diagonally
            if ((counterDia === 3) || (counterDia === -3)) {
                for (let x = 0; x <= 2; x++) {
                    this.cells[x][x].element.style.backgroundColor = "#32CD32";
                }
            }
            let = offset = 2;
            if ((counterDiaL === 3) || (counterDiaL === -3)) {
                for (let x = 0; x <= 2; x++) {
                    this.cells[x][offset].element.style.backgroundColor = "#32CD32";
                    offset--;
                }
            }
            offsetInvertDia--;
        }
        if ((counterDia === 3) || (counterDiaL === 3)) {
            headerEndGame.insertAdjacentHTML("afterend", '<p class="won">Crosses won diagonally!</p>');
            this.playerOneScore++;
            this.statOne.textContent = `Player Crosses: ${this.playerOneScore}`;
            return true;
        } else if ((counterDia === -3) || (counterDiaL === -3)) {
            headerEndGame.insertAdjacentHTML("afterend", '<p class="won">Noughts won diagonally!</p>');
            this.playerTwoScore++;
            this.statTwo.textContent = `Player Noughts: ${this.playerTwoScore}`;
            return true;
        }
        if (this.turnsTaken === 9) {
            headerEndGame.insertAdjacentHTML("afterend", '<p class="won">Draw! You both lost!</p>');
            return true;
        }
        return false;
    }
    this.changePlayer = function () {
        if (this.currentPlayer === this.players[0]) {
            this.currentPlayer = this.players[1];
            return;
        }
        this.currentPlayer = this.players[0];
    }
    this.cells = [
        [],
        [],
        []
    ]
    this.restart = function () {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells.length; j++) {
                this.cells[i][j].element.style.backgroundColor = "transparent";
                this.cells[i][j].reset();

            }
        }
        this.endGameDetected = false;
        this.turnsTaken = 0;
        let gameStateDescription = document.querySelector(".won");
        if (gameStateDescription) {
            gameStateDescription.remove();
        }
    }

}

window.addEventListener("load", function () {
    init();
});

function init() {
    let board = new Board();
    board.startGame();
    board.choice();
    // board.setUp();
    let resetButton = document.querySelector(".btn-game");
    let restartButton = document.querySelector(".btn-restart")
    restartButton.addEventListener("click", function () {
        board.restart();
        board.toggleModal();
    })
    resetButton.addEventListener("click", function () {
        board.restart();
    });
};