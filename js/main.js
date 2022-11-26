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
var gSafeClicksLeft = 3
var gSafeTimeout
var gHintTimout
var gIsShownCount
var gHintsLeft = 3
var gIsHintActive = false
var gBombsTillLose = 1
var gFlagsNeededCount = gLevel.MINES
var gRegularCells = gLevel.SIZE ** 2 - gLevel.MINES
const gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var emptySevenCells = []
var gStartTime
var gInterval
var isSevenBoom = false
var isManualMode = false
var gIdx = 0
var gMineCounter = gFlagsNeededCount
var gManualTimeout

function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    flagCounter()
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
    var elSafe = document.querySelector('.safe-button')
    elSafe.innerHTML = '3 Safe Clicks'
    var elManual = document.querySelector('.manual-button')
    elManual.innerHTML = 'Put Your Mines'
    gSafeClicksLeft = 3
    gHintsLeft = 3
    gIdx = 0
    emptySevenCells = []
    gLevel = level
    gLevel.SIZE = level.SIZE
    gLevel.MINES = level.MINES
    gGame.isOn = false
    gBombsTillLose = 1
    gFlagsNeededCount = gLevel.MINES
    gMineCounter = gFlagsNeededCount
    gRegularCells = gLevel.SIZE ** 2 - gLevel.MINES
    const elSmiley = document.querySelector('.smiley')
    const elHeader = document.querySelector('h1')
    for (var i = 1; i <= 3; i++) {
        const elhint = document.querySelector('.hint-' + i)
        elhint.style.fontSize = '30px'
    }
    elHeader.innerHTML = 'Minesweeper'
    elSmiley.innerHTML = '😀'
    if (gThreeLivesLeft) livesMode()
    initGame()
}

function darkMode() {
    const elBody = document.querySelector('body')
    const elCells = document.querySelectorAll('.cell')
    const elHeader = document.querySelector('h1')
    const elButton = document.querySelector('.dark-button')
    const elTimer = document.querySelector('.timer')
    const flag = document.querySelector('.flag')
    if (!isDark) {
        isDark = !isDark
        elBody.style.backgroundColor = 'rgb(15, 15, 15)'
        elHeader.style.color = 'rgb(235, 235, 235)'
        elTimer.style.color = 'rgb(235, 235, 235)'
        elButton.innerHTML = 'Bright Mode'
        flag.style.color = 'rgb(235, 235, 235)'
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
        flag.style.color = 'rgb(15, 15, 15)'
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
        var currTime = (Date.now() - gStartTime) / 1000
        var elTimer = document.querySelector('.timer')
        elTimer.innerHTML = currTime.toFixed(2)
    }, 10)
}

function hints() {
    const elhint = document.querySelector('.hint-' + gHintsLeft)
    if (gHintsLeft === 0) return
    if (!gIsHintActive) {
        gIsHintActive = !gIsHintActive
        elhint.style.fontSize = '20px'
    }
}

function safeClick() {
    if (gSafeClicksLeft === 0) return
    var location = findEmptyCell(gBoard)
    const cellClassName = getClassName(location)
    var elCell = document.querySelector('.' + cellClassName) 
    if (gBoard[location.i][location.j].isMine || gBoard[location.i][location.j].isShown) {
        safeClick()
    } else {
        gSafeClicksLeft--
        elCell.style.backgroundColor = 'rgb(255, 213, 61)'
        gSafeTimeout = setTimeout(() => {
            elCell.style.backgroundColor = 'grey'
        }, 3000)
    }
    var elSafe = document.querySelector('.safe-button')
    elSafe.innerHTML = `${gSafeClicksLeft} Safe Clicks`
    return
}

function flagCounter() {
    var strHTML = ''
    strHTML = `<span class="flag-count">🚩 ${gFlagsNeededCount}</span>`
    const flag = document.querySelector('.flag')
    flag.innerHTML = strHTML
}

function sevenBoom(level){
    isSevenBoom = !isSevenBoom
    gameLevel(level) 
    gGame.isOn = true
    findEmptySevenCell(gBoard)
    createRandomSvevenBomb(gLevel.MINES)
    setMinesNegsCount()
}

function manualMine(level){
    isManualMode = true
    gameLevel(level) 
    gGame.isOn = true

}