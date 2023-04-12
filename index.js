const startButton = document.getElementById('startGame');
const startQuestion = document.getElementById('startQuestion');
const Game = document.getElementById('game');
const gameDesc = document.getElementById('gameDesc');
const gameTable = document.getElementById('gameTable');
Game.style.display = 'none';

let Tsize = 0;
// size of the field "x by x", will be changed to actual
let hadCheckX = -1;
let hadCheckY = -1;
// Variable memorizes, which button is chosen. Generated to choose several in one turn
firstTurn = true;
// if bot's turn is first. Is used once
finalObject = {};
// object, holds data about bot's choice while going through nodes

document.getElementById("tSize").addEventListener("keyup", function (e) {
    if (e.code === 'Enter') document.getElementById("startGame").click();
});
// function to use 'Enter' button as a click

startButton.addEventListener('click', function () {
    let size = document.getElementById('tSize').value;
    let err = document.getElementById('inputErr');
    err.setAttribute('hidden', '');

    if (size > 0 && size < 6 && size != null)
        Tsize = size;
    else
        err.removeAttribute('hidden');

    if (Tsize != 0) {
        startQuestion.style.display = 'none';
        gameDesc.innerHTML = 'Board size: ' + Tsize + ' by ' + Tsize + ' cells';
        Game.style.display = 'flex';
        let tableIn = '';
        for (let i = 0; i < Tsize; i++)
            tableIn += `<row class="` + i + `"></row>`;
        gameTable.innerHTML = tableIn;
        document.querySelectorAll('row').forEach(opt => {
            let trIn = '';
            for (let i = 0; i < Tsize; i++)
                trIn += `<button class="but d` + i + opt.classList[0] + `" onclick="checkRow(` + i + `,` + opt.classList[0] + `)"></button>`;
            opt.innerHTML = trIn;
        });

        if (document.getElementById('checkAI').checked) AITurn();
        // check if bot going first and make the trn
    }
});
// button, which submits initial values and starts the game

function checkWin(str) {
    let checkwin = false;
    for (let i = 0; i < Tsize; i++) {
        for (let j = 0; j < Tsize; j++) {
            document.querySelectorAll('.d' + i + j).forEach(opt => {
                if (opt.innerHTML == '') {
                    checkwin = true;
                    return false;
                }
            });
        }
    }
    if (!checkwin) {
        let sub;
        if (str === 'bot') sub = 'Player won!'
        if (str === 'player') sub = 'Bot won!'
        if (confirm(sub + ' Want to repeat?')) {
            location.reload();
            return true;
        }
    }
}
// Checking at the end of the game and identifying the winner

function makeMark(low, big, ch, other, isBot) {
    let marked = false;
    for (let i = low; i <= big; i++) {
        if (ch) {
            document.querySelectorAll('.d' + other + i).forEach(opt => {
                if (opt.innerHTML != '') {
                    marked = true;
                    return;
                }
            });
        } else {
            document.querySelectorAll('.d' + i + other).forEach(opt => {
                if (opt.innerHTML != '') {
                    marked = true;
                    return;
                }
            });
        }
    }
    if (marked) {
        for (let i = low; i <= big; i++) {
            if (ch) {
                document.querySelectorAll('.d' + other + i).forEach(opt => {
                    opt.style.backgroundColor = '#ffffff3f';
                });
            } else {
                document.querySelectorAll('.d' + i + other).forEach(opt => {
                    opt.style.backgroundColor = '#ffffff3f';
                });
            }
        }
    } else {
        for (let i = low; i <= big; i++) {
            if (ch) {
                document.querySelectorAll('.d' + other + i).forEach(opt => {
                    if (isBot) opt.innerHTML = 'o';
                    else opt.innerHTML = 'x';
                    opt.style.backgroundColor = '#ffffff3f';
                });
            } else {
                document.querySelectorAll('.d' + i + other).forEach(opt => {
                    if (isBot) opt.innerHTML = 'o';
                    else opt.innerHTML = 'x';
                    opt.style.backgroundColor = '#ffffff3f';
                });
            }
        }
    }
}
// A little designing and buttons filling

function checkRow(row, col) {

    let Amarked = true;
    document.querySelectorAll('.d' + row + col).forEach(opt => {
        if (opt.innerHTML == 'x') {
            Amarked = false;
            return;
        }
    });
    if (Amarked) {
        if (row == hadCheckX || col == hadCheckY) {
            if (row == hadCheckX) {
                if (col < hadCheckY)
                    makeMark(col, hadCheckY, true, row, false)
                else
                    makeMark(hadCheckY, col, true, row, false)
            } else {
                if (row < hadCheckX)
                    makeMark(row, hadCheckX, false, col, false)
                else
                    makeMark(hadCheckX, row, false, col, false)
            }

            document.querySelectorAll('.d' + hadCheckX + hadCheckY).forEach(opt => {
                opt.style.backgroundColor = '#ffffff3f';
            });
            hadCheckX = -1;
            hadCheckY = -1;

            if (!checkWin('player')) AITurn(); // checks if game ends, if not, bot makes  the turn


        } else {
            document.querySelectorAll('.d' + hadCheckX + hadCheckY).forEach(opt => {
                opt.style.backgroundColor = '#ffffff3f';
            })
            hadCheckX = row;
            hadCheckY = col;
            document.querySelectorAll('.d' + row + col).forEach(opt => {
                opt.style.backgroundColor = '#f7bbff3f';
            })
        }
    }
}
// function, which acts every time player make the turn

function AITurn() {

    // I haven't got enough time and braincells to go at least 3 iterations inside the node.
    // I did it somehow, but it is absoluetly not ended.
    // For now, bot just choose most down left cells and goes to the right as it can.
    // Hope that there are something, that achieves your attention.

    let arr = {};
    for (let i = 0; i < Tsize; i++) {
        obj = {};
        for (let j = 0; j < Tsize; j++) {
            document.querySelectorAll('.d' + j + i).forEach(opt => {
                if (opt.innerHTML != '') {
                    obj[j] = 1;
                } else {
                    obj[j] = null;
                }
            });
        }
        arr[i] = obj;
    }

    turnRec(arr, 0);

    for (let i = finalObject.x; i < Tsize; i++) {
        document.querySelectorAll('.d' + i + finalObject.y).forEach(opt => {
            if (opt.innerHTML == '') {
                opt.innerHTML = 'o';
            } else {
                i = Tsize;
            }
        });
    }

    checkWin('bot');
}

function turnRec(arr, it) {
    if (it < 3) {
        let coord = null,
            row = null;
        for (let i = 0; i < Tsize; i++) {
            for (value in arr[i]) {
                if (arr[i][value] === null) {
                    row = i;
                    coord = value;
                    break;
                }
            }
        }
        if (coord !== null) {
            if (checkArr(row, coord, row, coord, arr) && it == 1) {
                finalObject.y = row;
                finalObject.x = coord;
                finalObject.endY = row;
                finalObject.endX = coord;
                finalObject.it = it;
            }
        }
        arr = addToArr(finalObject.x, finalObject.y, finalObject.x, finalObject.y, arr);

        turnRec(arr, ++it, finalObject);

    }
}
// tried to do some recursion, but I didn't understand how to get and handle all that data

function checkArr(x, y, xEnd, yEnd, arr) {
    for (let i = x; i < xEnd; i++) {
        for (let j = y; j < yEnd; j++) {
            if (arr[i][j] != '') {
                return false;
            }
        }
    }
    return true;
}
// checks if turn can be made inside recursion loop

function addToArr(x, y, xEnd, yEnd, arr) {
    for (let i = x; i < xEnd; i++) {
        for (let j = y; j < yEnd; j++) {
            arr[i][j] = 'a';
        }
    }
    return arr;
}
// fills array inside the loop to go through iterations

function endArr(arr, col) {
    for (let i = 0; i < Tsize; i++) {
        for (let j = 0; j < Tsize; j++) {
            if (arr[col][j] == '') return false;
        }
    }
    return true;
}
// check inside recursion loop if game ends