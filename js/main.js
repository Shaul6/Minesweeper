'use strict'

var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2,
}
const EASY = {
    SIZE: 4,
    MINES: 2,
}
const MEDIUM = {
    SIZE: 8,
    MINES: 14,
}
const HARD = {
    SIZE: 12,
    MINES: 32,
}

var gBombsTillLose = 1
var gFlagsNeededCount = gLevel.MINES
var gRegularCells = gLevel.SIZE ** 2 - gLevel.MINES
const gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
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

function gameOver() {
    const elHeader = document.querySelector('h1')
    console.log(elHeader)
    elHeader.innerHTML = 'Game Over!'
}

function checkGameOver() {
    console.log('regular cell', gRegularCells)
    console.log('flagsNeededCount', gFlagsNeededCount)
    if (gRegularCells === 0 && gFlagsNeededCount === 0) console.log('victory')
}

function gameLevel(level) {
    gLevel.SIZE = level.SIZE
    gLevel.MINES = level.MINES
    gGame.isOn = false
    gBombsTillLose = 1
    gFlagsNeededCount = gLevel.MINES
    gRegularCells = gLevel.SIZE ** 2 - gLevel.MINES
    initGame()
}
