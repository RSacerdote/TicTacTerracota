"use strict";
const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const menu = document.getElementById('Menu');
const menuMessageElement = document.querySelector('[data-endgame-messsage-text]');
const restartButton = document.getElementById('restartButton');
let currentClass;
startGame();
restartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener('click', startGame);
function startGame() {
    currentClass = X_CLASS;
    console.log("a");
    cellElements.forEach(cell => {
        console.log("9");
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleCLick);
        cell.addEventListener('click', handleCLick, { once: true });
    });
    setBoardHoverClass();
    menu === null || menu === void 0 ? void 0 : menu.classList.remove('show');
}
function handleCLick(e) {
    console.log("clicked");
    const cell = e.target;
    if ((cell !== null) && (cell instanceof HTMLElement)) {
        placeMark(cell);
    }
    if (checkWin()) {
        endGame(false);
    }
    else if (isDraw()) {
        endGame(true);
    }
    else {
        currentClass = (currentClass == X_CLASS) ? O_CLASS : X_CLASS;
        setBoardHoverClass();
    }
}
function placeMark(cell) {
    cell.classList.add(currentClass);
}
function endGame(draw) {
    if (menuMessageElement !== null) {
        if (draw) {
            menuMessageElement.innerText = 'Draw!';
        }
        else {
            menuMessageElement.innerText = `${currentClass.toUpperCase()} won!`;
        }
    }
    menu === null || menu === void 0 ? void 0 : menu.classList.add('show');
}
function setBoardHoverClass() {
    board === null || board === void 0 ? void 0 : board.classList.remove(X_CLASS);
    board === null || board === void 0 ? void 0 : board.classList.remove(O_CLASS);
    board === null || board === void 0 ? void 0 : board.classList.add(currentClass);
}
function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}
function checkWin() {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}
