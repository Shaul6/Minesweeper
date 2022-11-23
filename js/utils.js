'use strict'
const MINE = '💣'
const FLAG = '🚩'

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (!currCell.isShown) currCell = ' '
            if (currCell.isMine && currCell.isShown) currCell = MINE
            if (currCell.isShown && !currCell.isMine) {
                currCell.minesAroundCount === 0 ? (currCell = ' ') : (currCell = currCell.minesAroundCount)
            }

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            strHTML += `\t<td data-i=${i} data-j=${j} class="cell ${cellClass}"  onclick="cellClicked(${i},${j})"  oncontextmenu="javascript:cellMarked(this);return false;">${currCell}</td>`
        }
        strHTML += '</tr>\n'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function setMinesNegsCount() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var bombsCount = 0
            bombsCount = countNeighborsMines(i, j, gBoard)
            gBoard[i][j].minesAroundCount = bombsCount
        }
    }
    renderBoard(gBoard)
}

function countNeighborsMines(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

function cellClicked(i, j) {
    var currCell = gBoard[i][j]
    if (currCell.isShown) return
    else {
        currCell.isShown = true
        if (currCell.isMine) {
            currCell = MINE
        } else {
            currCell.minesAroundCount === 0 ? (currCell = ' ') : (currCell = currCell.minesAroundCount)
        }
        renderCell({ i, j }, currCell)
    }
}

function createRandomBomb(num) {
    for (var i = 0; i < num; i++) {
        const location = findEmptyCell(gBoard)
        if (gBoard[location.i][location.j].isMine) {
            i--
        } else {
            gBoard[location.i][location.j].isMine = true
        }
    }
}

function cellMarked(elCell) {
    const currCell = gBoard[elCell.dataset.i][elCell.dataset.j]
    const location = {
        i: elCell.dataset.i,
        j: elCell.dataset.j,
    }
    if (!currCell.isMarked) {
        currCell.isMarked = true
        renderCell(location, FLAG)
    } else {
        currCell.isMarked = false
        renderCell(location, ' ')
    }
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function findEmptyCell(board) {
    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            emptyCells.push({ i, j })
        }
    }
    const randomNumIdx = getRandomInt(0, emptyCells.length)
    const randomCell = emptyCells[randomNumIdx]
    return randomCell
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}
