var GAMEBOARD = [];

var getXY = function (x, y) {
    var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP / 2) / BUBBLES_GAP);
    var j = Math.floor((y - BUBBLES_Y_START + 9) / 17.75);

    return {x: i, y: j}
};

var buildGameboard = function () {
    GAMEBOARD = [];
    for (var i = 0; i < 26; i++) {
        GAMEBOARD.push([]);
        for (var j = 0; j < 29; j++) {
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

    for (var i = 0; i < BUBBLES_ARRAY.length; i++) {
        var bubbleParams = BUBBLES_ARRAY[i].split(";");
        var y = parseInt(bubbleParams[1]) - 1;
        var x = parseInt(bubbleParams[2]) - 1;
        var type = bubbleParams[3];
        var eaten = parseInt(bubbleParams[4]);
        if (type === "b") {
            GAMEBOARD[x][y].bubble = true;
        } else {
            GAMEBOARD[x][y].superBubble = true;
        }
        if (eaten === 0) {
            GAMEBOARD[x][y].eaten = false;
        } else {
            GAMEBOARD[x][y].eaten = true;
        }
    }

    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 29; j++) {
            if (!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble) {
                GAMEBOARD[i][j] = null;
            }
        }
    }

    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 29; j++) {
            if ((i === 0 && (j === 13)) ||
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
                (i === 25 && (j === 13))) {
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

    var p = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].inky = true;
    p = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].pinky = true;
    p = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].blinky = true;
    p = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].clyde = true;

    p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].pacman = true;

};

function drawRect(i, j) {
    var ctx = PACMAN_CANVAS_CONTEXT;
    var ygap = 17.75;
    var x = BUBBLES_X_START + i * BUBBLES_GAP - BUBBLES_GAP / 2;
    var y = BUBBLES_Y_START + j * ygap - 9;
    var w = BUBBLES_GAP;
    var h = ygap;

    if (GAMEBOARD && GAMEBOARD[0] && GAMEBOARD[i][j]) {
        ctx.strokeStyle = "green";
        ctx.rect(x, y, w, h);
        ctx.stroke();
    }
}

function drawDebug() {
    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 29; j++) {
            drawRect(i, j);
        }
    }
}

function selectMove() {

    buildGameboard();

    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running
        var found = false;
        var xy = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
        if ((GAMEBOARD[xy.x][xy.y].bubble ||GAMEBOARD[xy.x][xy.y].superBubble)
            &&!GAMEBOARD[xy.x][xy.y].eaten) {
            return;
        }

        var visited = [xy];
        var queue = [];
        var directions = getDirections(xy.x, xy.y, visited);
        //Set up the queue with direction and adjacent cells
        directions.forEach(function (dir) {
            if (dir === 1) { //Right
                var newNode = {x: xy.x + 1, y: xy.y, dir: dir};
                queue.push(newNode);
                visited.push(newNode);
            } else if (dir === 2) { //Down
                var newNode = {x: xy.x, y: xy.y + 1, dir: dir};
                queue.push(newNode);
                visited.push(newNode);
            } else if (dir === 3) { //Left
                var newNode = {x: xy.x - 1, y: xy.y, dir: dir};
                queue.push(newNode);
                visited.push(newNode);
            } else { //Up
                var newNode = {x: xy.x, y: xy.y - 1, dir: dir};
                queue.push(newNode);
                visited.push(newNode);
            }
        });

        //BFS
        while (!found && queue.length < 2000) {
            var node = queue.shift();
            if (node) {
                if (((GAMEBOARD[node.x][node.y].bubble || GAMEBOARD[node.x][node.y].superBubble) && !GAMEBOARD[node.x][node.y].eaten) ||
                    (GAMEBOARD[node.x][node.y].pinky && GHOST_PINKY_AFFRAID_STATE) ||
                    (GAMEBOARD[node.x][node.y].inky && GHOST_INKY_AFFRAID_STATE) ||
                    (GAMEBOARD[node.x][node.y].blinky && GHOST_BLINKY_AFFRAID_STATE) ||
                    (GAMEBOARD[node.x][node.y].clyde && GHOST_CLYDE_AFFRAID_STATE)) {
                    found = true;
                    movePacman(node.dir);
                    return;
                } else {
                    directions = getDirections(node.x, node.y, visited);
                    directions.forEach(function (dir) {
                        if (dir === 1) { //
                            var newNode = {x: node.x + 1, y: node.y, dir: node.dir};
                            queue.push(newNode);
                            visited.push(newNode);
                        } else if (dir === 2) { //Down
                            var newNode = {x: node.x, y: node.y + 1, dir: node.dir};
                            queue.push(newNode);
                            visited.push(newNode);
                        } else if (dir === 3) { //Left
                            var newNode = {x: node.x - 1, y: node.y, dir: node.dir};
                            queue.push(newNode);
                            visited.push(newNode);
                        } else { //Up
                            var newNode = {x: node.x, y: node.y - 1, dir: node.dir};
                            queue.push(newNode);
                            visited.push(newNode);
                        }
                    });
                }
            } else {
                movePacman(oneDirection());
                return;
            }
        }
        movePacman(oneDirection());
    }
}

/**
 * Gets directions pacman can move from the given x, y coordinate
 * @param x, the x coordinate of the cell we are checking
 * @param y, the y coordinate of the cell we are checking
 * @param visited, an array of x, y coordinates that we have already tested.
 * @returns directions, an array of (numbers) directions pacman can move from this coordinate
 */
function getDirections(x, y, visited) {
    var directions = [];
    if (!visited.includes({x: x - 1, y: y}) &&
        GAMEBOARD[x - 1] && GAMEBOARD[x - 1][y]) { //Left
        directions.push(3);
        visited.push({x: x - 1, y: y});
    }
    if (!visited.includes({x: x + 1, y: y}) &&
        GAMEBOARD[x + 1] && GAMEBOARD[x + 1][y]) { //Right
        directions.push(1);
    }
    if (!visited.includes({x: x, y: y - 1}) &&
        GAMEBOARD[x] && GAMEBOARD[x][y - 1]) { //Up
        directions.push(4);
        visited.push({x: x, y: y - 1});
    }
    if (!visited.includes({x: x, y: y + 1}) &&
        GAMEBOARD[x] && GAMEBOARD[x][y + 1]){ //Down
        directions.push(2);
        visited.push({x: x, y: y + 1});
    }

    return directions;
}