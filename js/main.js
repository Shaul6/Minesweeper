'use strict'

var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2,
}

const gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

function initGame() {
    gBoard = buildBoard()
    createRandomBomb(gLevel.MINES)
    renderBoard(gBoard)
    setMinesNegsCount()
    console.log('dddd', gBoard)
}

function buildBoard() {
    const size = gLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }

            board[i][j] = cell
        }
    }
    return board
}
