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

var isDark = false
var gThreeLivesLeft = false
var gHeart = '<span>❤️</span>'
var gHint = '<span>💡</span>'
var gHintTimout
var gHintsLeft = 3
var gIsHintActive = false
var gBombsTillLose = 1
var gFlagsNeededCount = gLevel.MINES
var gRegularCells = gLevel.SIZE ** 2 - gLevel.MINES
const gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gStartTime
var gInterval

function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
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
    clearInterval(gInterval)
    const elHeader = document.querySelector('h1')
    const elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = '😖'
    elHeader.innerHTML = 'Game Over!'
}

function checkGameOver() {
    console.log('gRegularCells', gRegularCells)
    console.log('gFlagsNeededCount', gFlagsNeededCount)
    if (gRegularCells === 0 && gFlagsNeededCount === 0) {
        clearInterval(gInterval)
        const elHeader = document.querySelector('h1')
        const elSmiley = document.querySelector('.smiley')
        elSmiley.innerHTML = '😜'
        elHeader.innerHTML = 'Victory'
    }
}

function gameLevel(level) {
    clearInterval(gInterval)
    gLevel = level
    gLevel.SIZE = level.SIZE
    gLevel.MINES = level.MINES
    gGame.isOn = false
    gBombsTillLose = 1
    gFlagsNeededCount = gLevel.MINES
    gRegularCells = gLevel.SIZE ** 2 - gLevel.MINES
    const elSmiley = document.querySelector('.smiley')
    const elHeader = document.querySelector('h1')
    elHeader.innerHTML = 'Minesweeper'
    elSmiley.innerHTML = '😀'
    if(gThreeLivesLeft) livesMode()
    initGame()
}

function darkMode() {
    const elBody = document.querySelector('body')
    const elCells = document.querySelectorAll('.cell')
    const elHeader = document.querySelector('h1')
    const elButton = document.querySelector('.dark-button')
    const elTimer = document.querySelector('.timer')
    if (!isDark) {
        isDark = !isDark
        elBody.style.backgroundColor = 'rgb(15, 15, 15)'
        // for (var i = 0; i < elCells.length; i++) {
        //     elCells[i].style.backgroundColor = 'black'
        //     elCells[i].style.color = 'rgb(235, 235, 235)'
        // }
        elHeader.style.color = 'rgb(235, 235, 235)'
        elTimer.style.color = 'rgb(235, 235, 235)'
        elButton.innerHTML = 'Bright Mode'
    } else {
        isDark = !isDark
        elBody.style.backgroundColor = 'rgb(219, 219, 219)'
        for (var i = 0; i < elCells.length; i++) {
            elCells[i].style.backgroundColor = 'grey'
            elCells[i].style.color = 'black'
            elButton.innerHTML = 'Dark Mode'
        }
        elHeader.style.color = 'rgb(15, 15, 15)'
        elTimer.style.color = 'rgb(15, 15, 15)'
    }
}

function livesMode() {
    const elButton = document.querySelector('.live-button')
    const elHearts = document.querySelector('.hearts')
    var strHTML = ''
    if (!gThreeLivesLeft) {
        gThreeLivesLeft = !gThreeLivesLeft
        strHTML = `${gHeart}${gHeart}${gHeart}`
        elHearts.innerHTML = strHTML
        gBombsTillLose = 3
        elButton.innerHTML = 'Regular Mode'
    } else {
        gThreeLivesLeft = !gThreeLivesLeft
        elButton.innerHTML = '3Lives Left'
        gBombsTillLose = 1
        strHTML = ''
        elHearts.innerHTML = strHTML
    }
}

function timer() {
    gStartTime = Date.now()
    gInterval = setInterval(() => {
        var currTime = (Date.now() - gStartTime) /1000
        var elTimer = document.querySelector('.timer')  
        elTimer.innerHTML = currTime.toFixed(2)
    }, 10)
}

function hints() {
    const elhint = document.querySelector('.hint-'+gHintsLeft)
    if(gHintsLeft === 0) return
    if (!gIsHintActive) {
        gIsHintActive = !gIsHintActive
        elhint.style.fontSize = '20px'

    }
}
