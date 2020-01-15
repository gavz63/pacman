var GAMEBOARD = [];

var getXY = function(x, y) {
    var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
    var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);

    return {x: i, y: j}
};

var buildGameboard = function () {
    GAMEBOARD = [];
    for(var i = 0; i < 26; i++) {
        GAMEBOARD.push([]);
        for(var j = 0; j < 29; j++) {
            GAMEBOARD[i].push({
                bubble: false,
                superBubble: false,
                inky: false,
                pinky: false,
                blinky: false,
                clyde: false,
                pacman: false,
                eaten: false
            });
        }
    }

    for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
        var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
        var y = parseInt(bubbleParams[1]) - 1;
        var x = parseInt(bubbleParams[2]) - 1;
        var type = bubbleParams[3];
        var eaten = parseInt(bubbleParams[4]);
        if (type === "b") {
            GAMEBOARD[x][y].bubble = true;
        } else {
            GAMEBOARD[x][y].superBubble = true;
        }
        if(eaten === 0) {
            GAMEBOARD[x][y].eaten = false;
        } else {
            GAMEBOARD[x][y].eaten = true;
        }
    }

    for(var i = 0; i < 26; i++) {
        for(var j = 0; j < 29; j++) {
            if(!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble){
                GAMEBOARD[i][j] = null;
            }
        }
    }

    for(var i = 0; i < 26; i++) {
        for(var j = 0; j < 29; j++) {
            if((i === 0 && (j === 13)) ||
                (i === 1 && (j === 13)) ||
                (i === 2 && (j === 13)) ||
                (i === 3 && (j === 13)) ||
                (i === 4 && (j === 13)) ||
                (i === 6 && (j === 13)) ||
                (i === 7 && (j === 13)) ||
                (i === 8 && (j >= 10 && j <= 18)) ||
                (i === 9 && (j === 10 || j === 16)) ||
                (i === 10 && (j === 10 || j === 16)) ||
                (i === 11 && (((j >= 8) && (j <= 10)) || j === 16)) ||
                (i === 12 && (j === 10 || j === 16)) ||
                (i === 13 && (j === 10 || j === 16)) ||
                (i === 14 && (((j >= 8) && (j <= 10)) || j === 16)) ||
                (i === 15 && (j === 10 || j === 16)) ||
                (i === 16 && (j === 10 || j === 16)) ||
                (i === 17 && (j >= 10 && j <= 18)) ||
                (i === 18 && (j === 13)) ||
                (i === 19 && (j === 13)) ||
                (i === 21 && (j === 13)) ||
                (i === 22 && (j === 13)) ||
                (i === 23 && (j === 13)) ||
                (i === 24 && (j === 13)) ||
                (i === 25 && (j === 13)))  {
                GAMEBOARD[i][j] = {
                    bubble: false,
                    superBubble: false,
                    inky: false,
                    pinky: false,
                    blinky: false,
                    clyde: false,
                    pacman: false,
                    eaten: false
                };
            }
        }
    }

    var p = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
    if(p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].inky = true;
    p = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].pinky = true;
    p = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].blinky = true;
    p = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].clyde = true;

    p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].pacman = true;

};

function drawRect(i,j) {
    var ctx = PACMAN_CANVAS_CONTEXT;
    var ygap = 17.75;
    var x = BUBBLES_X_START + i*BUBBLES_GAP - BUBBLES_GAP/2;
    var y = BUBBLES_Y_START + j*ygap- 9;
    var w = BUBBLES_GAP;
    var h = ygap;

    if(GAMEBOARD && GAMEBOARD[0] && GAMEBOARD[i][j]){
        ctx.strokeStyle = "green";
        ctx.rect(x,y,w,h);
        ctx.stroke();
    }
}

function drawDebug() {
    for(var i = 0; i < 26; i++) {
        for(var j = 0; j < 29; j++) {
            drawRect(i,j);
        }
    }
}

function selectMove() {

    buildGameboard();

    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running

        var xy = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
        var x = xy.x;
        var y = xy.y;

        console.log("(" + x + ", " + y + ")");

        var directions = getDirections(x, y);
        movePacman(lookForBubble(x, y, directions, 1).dir);
    }
}

function getDirections(x, y) {
    var directions = [];
    gameboard_x = GAMEBOARD[x];
    if (GAMEBOARD[x + 1] && GAMEBOARD[x + 1][y]) { //Right
        directions.push(1);
    }
    if (gameboard_x && gameboard_x[y + 1]) { //Down
        directions.push(2);
    }
    if (GAMEBOARD[x - 1] && GAMEBOARD[x - 1][y]) { //Left
        directions.push(3);
    }
    if (gameboard_x && gameboard_x[y - 1]) { //Up
        directions.push(4);
    }
    return directions;
}

function lookForBubble(x, y, directions, count) {
    //If there's a bubble adjacent to (x, y) return the direction from (x,y) that the bubble is
    var dir = checkAdjacent(x, y, directions);
    if (dir != null) return {dir: dir, count: count};

    var right = getDirections(x + 1, y);
    var down = getDirections(x, y + 1);
    var left = getDirections(x - 1, y);
    var up = getDirections(x, y - 1);

    count++;
    var paths = [];
    paths.push(lookForBubble(x + 1, y, right, count).count);
    paths.push(lookForBubble(x, y + 1, down, count).count);
    paths.push(lookForBubble(x - 1, y, left, count).count);
    paths.push(lookForBubble(x, y - 1, up, count).count);

    return paths.indexOf(Math.min(...paths)) + 1;
}

function checkAdjacent(x, y, directions) {
    var gameboard_x = GAMEBOARD[x];
    if (directions.includes(1) && GAMEBOARD[x + 1] && !GAMEBOARD[x + 1][y].eaten) { //Right
        //console.log(GAMEBOARD[x + 1][y]);
        return 1;
    } else if (directions.includes(2) && gameboard_x && !gameboard_x[y + 1].eaten) { //Down
        //console.log(gameboard_x[y + 1]);
        return 2;
    } else if (directions.includes(3) && GAMEBOARD[x - 1] &&!GAMEBOARD[x - 1][y].eaten) { //Left
        //console.log(GAMEBOARD[x - 1][y]);
        return 3;
    } else if (directions.includes(4) && gameboard_x && !gameboard_x[y - 1].eaten) { //Up
        //console.log(gameboard_x[y - 1]);
        return 4;
    }
}