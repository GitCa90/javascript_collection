import { gameState, modeState } from "./gameState.js";
import {
    drawSnake,
    clearBoard,
    updateScore,
    startFoodTimer,
    drawDoubleReward,
    updateUI,
    createStarDescription,
    createHighscore,
    createPerks,
    changeGameModeBackground
} from "./gameUI.js";
import {
    setSnakeDirection,
    moveSnake,
    isGameOver,
    startGameMode,
    renderFood,
    getEatPositions,
    isStarUnlocked,
    loadGame,
    saveGame,
} from "./gameLogic.js";


loadGame();
updateUI();
createStarDescription();
createHighscore();
isStarUnlocked(modeState.modeSelected);

let lastTime = 0;
let accumulator = 0;
let step = gameState.gameSpeed;

export function resetLoop() {
    lastTime = 0;
    accumulator = 0;
}

function gameLoop(timestamp) {
    if (!gameState.isRunning) {
        requestAnimationFrame(gameLoop);
        return;
    }

    const last = lastTime || timestamp;
    const delta = timestamp - last;

    lastTime = timestamp;
    accumulator += delta;

    while (accumulator >= step && gameState.isRunning) {
        step = gameState.gameSpeed;
        accumulator -= step;

        clearBoard();
        moveSnake();
        drawSnake();
        renderFood(step);
        getEatPositions();
        updateScore();
        startFoodTimer();
        createPerks();
        isGameOver();
        isStarUnlocked(modeState.modeSelected);
        createStarDescription();
        changeGameModeBackground();
    
    }
    saveGame();
    drawDoubleReward(delta);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

document.addEventListener("keydown", setSnakeDirection);
document
    .querySelectorAll(".game-mode")
    .forEach((btn) => btn.addEventListener("click", startGameMode));

// function cheat() {
//     const up = { x: 0, y: -1 };
//     const left = { x: -1, y: 0 };
//     const right = { x: 1, y: 0 };
//     const down = { x: 0, y: 1 };
//     const snakeHead = snakeSprite.segment[0]; 

//     if (snakeHead["x"] === 775 && snakeHead["y"] === 0) {
//         gameState.nextDirection = down;
//     } else if (snakeHead["x"] === 775 && snakeHead["y"] === 575) {
//         gameState.nextDirection = left;
//     } else if (snakeHead["x"] === 0 && snakeHead["y"] % 2 === 1) {
//         gameState.nextDirection = up;
//     } else if (snakeHead["x"] === 0 && snakeHead["y"] % 2 === 0) {
//         gameState.nextDirection = right;
//     } else if (snakeHead["x"] === 750 && snakeHead["y"] !== 0 && snakeHead["y"] % 2 === 0) {
//         gameState.nextDirection = up;
//     } else if (snakeHead["x"] === 750 && snakeHead["y"] % 2 === 1) {
//         gameState.nextDirection = left;
//     }
// }