const winColor = "#32CD32"

function Cell(element) {
    this.element = element;
    this.type = "";
    this.value = 0;
    this.winner = function () {
        this.element.style.backgroundColor = winColor;
    };
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
        this.element.style.backgroundColor = "transparent";
    }
}

function Player(symbol, scoreboardElement) {
    this.symbol = symbol;
    this.score = 0;
    this.scoreboardElement = scoreboardElement;
    this.scoreboardElement.textContent = `Player ${this.symbol} : ${this.score}`
    this.getSymbol = function () {
        return this.symbol;
    }
    this.incrementScore = function (num) {
        this.score += num;
        this.scoreboardElement.textContent = `Player ${this.symbol} : ${this.score}`;
    }
}

function Board() {
    this.players = [];
    this.currentPlayer;
    this.turnsTaken = 0;
    this.endGameDetected = false;

    this.modal = document.querySelector(".modal");
    this.toggleModal = function () {
        this.modal.classList.toggle("show-modal");
    }
    this.startGame = function () {
        modalStart = document.querySelector(".modal-choice");
        modalStart.classList.toggle("show-modal");
    }
    this.choice = function () {
        let b = this;
        let choices = document.querySelectorAll(".choice");
        let scoreboardElements = document.querySelectorAll(".score");
        for (let i = 0; i < choices.length; i++) {
            choices[i].addEventListener("click", () => {
                let playerOne = new Player(choices[i].innerHTML, scoreboardElements[0]);
                let playerTwo = new Player((choices[i].innerHTML === "X") ? "O" : "X", scoreboardElements[1]);
                b.players.push(playerOne, playerTwo);
                b.startGame();
                b.setUp();
            });
        }
    }
    this.setUp = function () {
        let cells = document.querySelectorAll(".cell");

        this.currentPlayer = this.players[0];
        let curArr = 0;
        for (let i = 0; i < cells.length; i++) {
            if (this.cells[curArr].length === 3) {
                curArr++;
            }
            //get the board
            let b = this;
            //get instance of current player
            let c = new Cell(cells[i]);
            this.cells[curArr].push(c);

            let closeButton = document.querySelector(".close-button");
            closeButton.addEventListener("click", function () {
                b.toggleModal();
            });

            c.element.addEventListener("click", () => {
                if (!b.endGameDetected) {
                    if (c.select(b.currentPlayer.symbol)) {
                        b.turnsTaken++;
                        let endGameResults = b.isGameOver();
    
                        if (endGameResults.winningCells.length === 3) {
                            b.endGameDetected = true;
                            for (let i = 0; i < endGameResults.winningCells.length; i++) {
                                endGameResults.winningCells[i].winner();
                            }
                            b.endgameScreen(b.currentPlayer.symbol, endGameResults.winPosition);
                            b.currentPlayer.incrementScore(1);
                            b.toggleModal();
                        }
                        b.changePlayer();
                    }
                }
            });
        }
    }
    this.isGameOver = function () {
        let counterDia, counterDiaL, offsetInvertDia, outcome;
        counterDia = 0;
        counterDiaL = 0;
        offsetInvertDia = 2;
        outcome = {
            winPosition: "",
            winningCells: []
        };

        for (let i = 0; i <= 2; i++) {
            let counterAcross = 0;
            let counterDown = 0;

            for (let j = 0; j <= 2; j++) {
                counterAcross += this.cells[i][j].value;
                counterDown += this.cells[j][i].value;

                //checks across
                if ((counterAcross === 3) || (counterAcross === -3)) {
                    for (let x = 0; x <= 2; x++) {
                        outcome.winningCells.push(this.cells[i][x]);
                    }
                    outcome.winPosition = "across";
                    return outcome;
                }

                if ((counterDown === 3) || (counterDown === -3)) {
                    for (let x = 0; x <= 2; x++) {
                        outcome.winningCells.push(this.cells[x][i]);
                    }
                    outcome.winPosition = "down";
                    return outcome;
                }
            }
            counterDia += this.cells[i][i].value;
            counterDiaL += this.cells[i][offsetInvertDia].value;

            //checking win state diagonally
            if ((counterDia === 3) || (counterDia === -3)) {
                for (let x = 0; x <= 2; x++) {
                    outcome.winningCells.push(this.cells[x][x]);
                }
            }
            let = offset = 2;
            if ((counterDiaL === 3) || (counterDiaL === -3)) {
                for (let x = 0; x <= 2; x++) {
                    outcome.winningCells.push(this.cells[x][offset]);
                    offset--;
                }
            }
            offsetInvertDia--;
        }
        if ((counterDia === 3) || (counterDiaL === 3) || (counterDia === 3) || (counterDiaL === -3)) {
            outcome.winPosition = "diagonally";
            return outcome;
        }
        return outcome;
    }
    this.changePlayer = function () {
        if (this.currentPlayer === this.players[0]) {
            this.currentPlayer = this.players[1];
            return;
        }
        this.currentPlayer = this.players[0];
    }
    this.endgameScreen = function (symbol, position) {
        let headerEndGame = document.querySelector(".end-game");
        headerEndGame.insertAdjacentHTML("afterend", `<p class="won">${symbol} won ${position}!</p>`);
    }
    this.cells = [
        [],
        [],
        []
    ]
    this.restart = function () {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells.length; j++) {
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