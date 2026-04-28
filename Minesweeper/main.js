// ============================================================================
// 🔹 DATA
// ============================================================================

const dom = {
    template: document.getElementById("tile-template"),
    playArea: document.getElementById("play-area"),
    minesLeft: document.getElementById("mines-left"),
    resetBtn: document.getElementById("reset-button"),
    timer: document.getElementById("time-spent"),
    userCols: document.getElementById("user-cols"),
    userRows: document.getElementById("user-rows"),
    userMines: document.getElementById("user-mines"),
    userUpdate: document.getElementById("update-settings-btn"),
};

const gameConfig = {
    rows: 10,
    cols: 10,
    mineCount: 10,
    minMines: 0.05,
    maxMines: 0.8,
};

const game = {
    bombsLeftText: gameConfig.mineCount,
    freeTiles: [],
    tiles: {},
    revealedCounter: 0,
    startTime: 0,
    elapsed: 0,
    running: false,
};

const offsets = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
];

const colorCodes = {
    1: "blue",
    2: "green",
    3: "red",
    4: "darkblue",
    5: "maroon",
    6: "cyan",
    7: "black",
    8: "darkgray",
};

// ============================================================================
// 🔹 EVENTS & HANDLERS
// ============================================================================

dom.userUpdate.addEventListener("click", setUserInput);
dom.resetBtn.addEventListener("click", resetGame);
dom.playArea.addEventListener("click", onTileClick);
dom.playArea.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    onTileRightClick(e);
});

function getTileContext(e) {
    let el = e.target.closest(".tile");
    if (!el) return;
    return { tile: game.tiles[el.id] };
}

function onTileClick(e) {
    const context = getTileContext(e);
    if (!context) return;

    const { tile } = context;

    if (tile.revealed || tile.flagged) return;

    if (game.revealedCounter === 0) {
        setBombs(tile);
        setTilesValue();
        startClock();
    }

    if (tile.bomb) {
        revealAllBombs();
        endGame();
        renderBoard();
        return;
    }

    if (tile.value === 0) {
        revealTilesRecurse(tile);
    } else {
        revealTile(tile);
    }

    renderBoard();
    renderWinCondition();
}

function onTileRightClick(e) {
    const context = getTileContext(e);
    if (!context) return;

    const { tile } = context;

    if (tile.revealed) return;

    tile.flagged = !tile.flagged;
    renderBoard();
}

// ============================================================================
// 🔹 GAME LOGIC
// ============================================================================

function findAdjacentTiles(tile) {
    const [row, col] = tile.el.id.split("-").map(Number);
    const tiles = [];

    for (const offset of offsets) {
        let x = row + offset[1];
        let y = col + offset[0];

        if (x < 0 || x >= gameConfig.rows) continue;
        if (y < 0 || y >= gameConfig.cols) continue;

        tiles.push(game.tiles[`${x}-${y}`]);
    }

    return tiles;
}

function setBombs(tile) {
    let firstTileIndex = game.freeTiles.indexOf(tile.el.id);
    game.freeTiles.splice(firstTileIndex, 1);

    for (let i = 0; i < gameConfig.mineCount; i++) {
        let index = Math.floor(Math.random() * game.freeTiles.length);
        let id = game.freeTiles[index];

        game.tiles[id].bomb = true;
        game.freeTiles.splice(index, 1);
    }
}

function setTilesValue() {
    for (const tile of Object.values(game.tiles)) {
        if (tile.bomb) {
            const tiles = findAdjacentTiles(tile);
            for (const t of tiles) {
                t.value++;
            }
        }
    }
}

function revealAllBombs() {
    for (const tile of Object.values(game.tiles)) {
        if (tile.bomb) {
            tile.revealed = true;
        }
    }
}

function updateBombsLeft() {
    let count = 0;

    for (const tile of Object.values(game.tiles)) {
        if (tile.flagged) count++;
    }

    game.bombsLeftText = gameConfig.mineCount - count;
}

function revealTile(tile) {
    if (tile.revealed) return;

    tile.revealed = true;
    tile.flagged = false;
    game.revealedCounter++;
}

function revealTilesRecurse(t) {
    for (const tile of findAdjacentTiles(t)) {
        if (tile.value > 0) {
            revealTile(tile);
        } else if (!tile.bomb && !tile.revealed) {
            revealTile(tile);
            revealTilesRecurse(tile);
        }
    }
}

function resetState() {
    game.freeTiles = [];
    game.tiles = {};
    game.revealedCounter = 0;
    game.startTime = 0;
    game.elapsed = 0;
    game.running = false;
    game.bombsLeftText = gameConfig.mineCount;
}

function setUserInput() {
    let colsValue = Number(dom.userCols.value);
    let rowsValue = Number(dom.userRows.value);
    let minesValue = Number(dom.userMines.value);

    gameConfig.cols = colsValue >= 10 && colsValue <= 25 ? colsValue : 10;
    gameConfig.rows = rowsValue >= 10 && rowsValue <= 25 ? rowsValue : 10;

    let totalTiles = gameConfig.cols * gameConfig.rows;

    gameConfig.mineCount =
        minesValue >= totalTiles * gameConfig.minMines &&
        minesValue <= totalTiles * gameConfig.maxMines
            ? minesValue
            : 5;

    resetGame();
}

function startClock() {
    game.running = true;
    game.startTime = Date.now() - game.elapsed;

    requestAnimationFrame(updateClock);
}

function pauseClock() {
    game.running = false;
    game.elapsed = Date.now() - game.startTime;
}

function updateClock() {
    if (!game.running) return;
    game.elapsed = Date.now() - game.startTime;

    renderClock(game.elapsed);
    requestAnimationFrame(updateClock);
}

// ============================================================================
// 🔹 UI RENDERING
// ============================================================================

function createTiles() {
    dom.playArea.innerHTML = "";
    dom.playArea.style.gridTemplateColumns = `repeat(${gameConfig.cols}, 1fr)`;
    dom.playArea.style.gridTemplateRows = `repeat(${gameConfig.rows}, 1fr)`;

    const fragment = document.createDocumentFragment();

    for (let row = 0; row < gameConfig.rows; row++) {
        for (let col = 0; col < gameConfig.cols; col++) {
            const clone = dom.template.content.cloneNode(true);
            const tile = clone.querySelector("div");
            const id = `${row}-${col}`;

            tile.id = id;
            game.tiles[id] = { el: tile, bomb: false, flagged: false, value: 0, revealed: false };

            fragment.append(clone);
        }
    }

    dom.playArea.append(fragment);
}

function renderBoard() {
    for (const tile of Object.values(game.tiles)) {
        resetTile(tile);

        if (tile.revealed) {
            renderRevealed(tile);
            continue;
        }

        renderFlags(tile);
    }

    updateBombsLeft();
    renderBombsLeftText();
}

function renderRevealed(tile) {
    tile.el.classList.add("revealTile");

    if (tile.bomb) {
        tile.el.textContent = "💣";
        tile.el.classList.add("red");
        dom.resetBtn.textContent = "😩";
        return;
    }

    if (tile.value > 0) {
        tile.el.textContent = tile.value;
        tile.el.style.color = colorCodes[tile.value];
    }
}

function renderFlags(tile) {
    tile.el.textContent = tile.flagged ? "🚩" : "";
}

function renderBombsLeftText() {
    dom.minesLeft.textContent = String(game.bombsLeftText).padStart(3, "0");
}

function renderWinCondition() {
    if (game.revealedCounter == gameConfig.cols * gameConfig.rows - gameConfig.mineCount) {
        dom.resetBtn.textContent = "😎";
        endGame();
    }
}

function setResetBtn() {
    dom.resetBtn.textContent = "😀";
    dom.timer.textContent = "000";
}

function renderClock(time) {
    const sec = Math.floor(time / 1000);
    dom.timer.textContent = String(sec).padStart(3, "0");

    if (sec > 999) dom.timer.textContent = "999";
}

// ============================================================================
// 🔹 OTHER
// ============================================================================

function resetTile(tile) {
    tile.el.textContent = "";
    tile.el.classList.remove("revealTile", "red");
}

function setAvailableTiles() {
    game.freeTiles = Object.keys(game.tiles);
}

function endGame() {
    dom.playArea.style.pointerEvents = "none";
    pauseClock();
}

function resetGame() {
    resetState();
    gameLoad();
}

function gameLoad() {
    dom.playArea.style.pointerEvents = "auto";

    createTiles();
    setAvailableTiles();
    setResetBtn();
    renderBoard();
}

gameLoad();
