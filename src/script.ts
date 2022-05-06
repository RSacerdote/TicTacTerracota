const X_CLASS = 'x'
const O_CLASS = 'o'
const C_CLASS = 'c'
const MM_CLASS = 'mm'
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
const cellElements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const menu = document.getElementById('Menu')
const menuMessageElement: HTMLElement | null = document.querySelector('[data-initial-message-text]')
const restartButton = document.getElementById('restartButton')
const computerModeButton = document.getElementById('computerModeButton')
let currentClass: string
let computerMode: boolean = false
let firstRound: boolean
let firstExecution: boolean = true
type playScore = {
    cell: HTMLElement
    score: number
}

startGame();
restartButton?.addEventListener('click', startGame)
computerModeButton?.addEventListener('click', changeMode)

function startGame(): void {
    currentClass = X_CLASS
    firstRound = true
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.classList.remove(C_CLASS)
        cell.removeEventListener('click', handleCLick);
        cell.addEventListener('click', handleCLick)
    })
    setBoardHoverClass();
    if (firstExecution) {
        firstExecution = false
        menu?.classList.add('show')
    }
    else {
        menu?.classList.remove('show')
    }
}

function handleCLick(e: Event): void {
    const cell = e.target
    if ((cell !== null) && (cell instanceof HTMLElement)) {
        if (cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS) || cell.classList.contains(C_CLASS)) {
            return
        } else {
            if (currentClass !== C_CLASS) {
                placeMark(cell)
            } else {
                return
            }
        }
    }
    if (checkWin(currentClass)){
        endGame(false)
    } 
    else if (isDraw()){
        endGame(true)
    }
    else {
        if (computerMode) {
            currentClass = C_CLASS
            aiPlays()
            if (checkWin(currentClass)){
                endGame(false)
            }
            else if (isDraw()) {
                endGame(true)
            }
            currentClass = X_CLASS
        } else {
            currentClass = (currentClass == X_CLASS) ? O_CLASS : X_CLASS
        }
        setBoardHoverClass()
    }
}

function placeMark(cell: HTMLElement): void{
    cell.classList.add(currentClass)
}

function aiPlays(): void {
    /*
    Made this hardcoded because if the opponent place a marker in the center in the first round, then the computer needs to place in the corner
    And if the opponent place other positions, the best move is to place a marker in the center
    That is a little cheating, but it increases the performance by A LOT
    If you wanna see the pure Min Max algorithm in action just comment out the lines: 23, and 95-103
    */
    if (firstRound) { 
        if (cellElements[4].classList.contains(X_CLASS)) {
            cellElements[2].classList.add(C_CLASS)
        } else {
            cellElements[4].classList.add(C_CLASS)
        }
        firstRound = false
        return
    }
    let startingStateOfBoard = getCurrentStateOfBoard()
    let bestPlay = recursiveMinMax(startingStateOfBoard, true)
    resetBoard(startingStateOfBoard)
    bestPlay.cell.classList.add(C_CLASS)
}

function recursiveMinMax(stateOfBoard: string[], isMax: boolean): playScore {
    let bestPlay: playScore = { cell: cellElements[10], score: -Infinity };
    let possiblePlays = 0
    for (let i = 0; i < cellElements.length; i++) {
        let possibleCell = cellElements[i]
        if (!(possibleCell.classList.contains(C_CLASS) || (possibleCell.classList.contains(X_CLASS)))) {
            possiblePlays++
            possibleCell.classList.add(MM_CLASS)
            possibleCell.classList.add(isMax ? C_CLASS : X_CLASS)
            if (checkWin(isMax ? C_CLASS : X_CLASS)) {
                bestPlay.score = 1
                bestPlay.cell = possibleCell
                resetBoard(stateOfBoard)
                return bestPlay
            }
            let score = 0
            if (!isDraw()) {
                score = -recursiveMinMax(getCurrentStateOfBoard(), !isMax).score
            }
            if (score >= bestPlay.score) {
                bestPlay.score = score
                bestPlay.cell = possibleCell
            }
            resetBoard(stateOfBoard)
        }
    }
    return bestPlay
}

function getCurrentStateOfBoard(): string[] {
    let currentStateOfBoard: string[] = new Array(9)
    for (let i = 0; i < cellElements.length; i++){
        const cellClasses = cellElements[i].classList
        currentStateOfBoard[i] = (cellClasses.contains(C_CLASS))? C_CLASS : ((cellClasses.contains(X_CLASS))? X_CLASS : '')
    }
    return currentStateOfBoard
}

function resetBoard(stateOfBoard: string[]): void {
    for (let i = 0; i < stateOfBoard.length; i++){
        cellElements[i].classList.remove(C_CLASS)
        cellElements[i].classList.remove(X_CLASS)
        cellElements[i].classList.remove(MM_CLASS)
        if (stateOfBoard[i] !== '') {
            cellElements[i].classList.add(stateOfBoard[i])
        }
    }
}

function endGame(draw: boolean): void{
    if (menuMessageElement !== null) {
        if (draw) {
            menuMessageElement.innerText = 'Draw!'
        }
        else {
            switch (currentClass) {
                case X_CLASS:
                    menuMessageElement.innerText = (computerMode)?'You won!':'X Won!'
                    break
                case O_CLASS:
                    menuMessageElement.innerText = 'Circle Won'
                    break
                case C_CLASS:
                    menuMessageElement.innerText = 'Computer Won'
                    break
            }
        }
    }
    menu?.classList.add('show')
}

function setBoardHoverClass(): void {
    board?.classList.remove(X_CLASS)
    board?.classList.remove(O_CLASS)
    board?.classList.remove(C_CLASS)
    board?.classList.add(currentClass)
}

function isDraw(): boolean {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS) || cell.classList.contains(C_CLASS)
    })
}

function checkWin( possibleWinnerClass: string): boolean {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(possibleWinnerClass)
        })
    })
}

function changeMode(): void {
    computerMode = !computerMode
    if (computerModeButton !== null) {
        if (computerMode) {
            computerModeButton.innerText = 'Vs Computer'
        } else {
            computerModeButton.innerText = '2 players'
        }
    }
}