//type, target, value
//prettier-ignore
export const stars = {
    normal: [
        { requiredPoints: 20, unlocked: false, description: `Unlocks Perks`, effect: ["unlockPerk"]},
        { requiredPoints: 40, unlocked: false, description: `Unlocks Carrot`, effect: ["unlockFood,carrot"]},
        { requiredPoints: 100, unlocked: false, description: `Unlocks Hard Mode`, effect: ["unlockMode,hard"]},
        { requiredPoints: 200, unlocked: false, description: `Adds 2 seconds to Carrot spawns`, effect: ["addSpawnTime,carrot,2000"] },
    ],
    hard: [
        { requiredPoints: 120, unlocked: false, description: `Unlocks Banana`, effect: ["unlockFood,banana"] },
        { requiredPoints: 200, unlocked: false, description: `Unlocks Expert Mode`, effect: ["unlockMode,expert"] },
        { requiredPoints: 300, unlocked: false, description: `Increases chance of Banana spawn by 20%`, effect: ["spawnChance,banana,20"] },
        { requiredPoints: 350, unlocked: false, description: `Adds 4 seconds to Banana spawns`, effect: ["addSpawnTime,banana,4000"] },
    ],
    expert: [
        { requiredPoints: 300, unlocked: false, description: `Unlocks Apricot`, effect: ["unlockFood,apricot"]},
        { requiredPoints: 400, unlocked: false, description: `Unlocks Master Mode`, effect: ["unlockMode,master"] },
        { requiredPoints: 500, unlocked: false, description: `Increases spawn chance of Apricot by 20%`, effect: ["spawnChance,apricot,10"]},
        { requiredPoints: 600, unlocked: false, description: `Adds 6 seconds to Apricot spawns`, effect: ["addSpawnTime,apricot,6000"] },
    ],
    master: [
        { requiredPoints: 400, unlocked: false, description: `Unlocks Watermelon`, effect: ["unlockFood,watermelon"]},
        { requiredPoints: 550, unlocked: false, description: `Unlocks Inferno Mode`, effect: ["unlockMode,inferno"] },
        { requiredPoints: 600, unlocked: false, description: `Increases spawn chance of Watermelon by 20%`, effect: ["spawnChance,watermelon,10"] },
        { requiredPoints: 700, unlocked: false, description: `Adds 8 seconds to Watermelon spawns`, effect: ["addSpawnTime,watermelon,8000"] },
    ],
    inferno: [
        { requiredPoints: 450, unlocked: false, description: `Unlocks Avocado`, effect: ["unlockFood,avocado"]},
        { requiredPoints: 500, unlocked: false, description: `Removes wall collision`, effect: ["wallCollision"]},
        { requiredPoints: 800, unlocked: false, description: `Adds 10 seconds to Avocado spawns`, effect: ["addSpawnTime,avocado, 10000"]},
        { requiredPoints: 1000, unlocked: false, description: `You are a winner` },
    ],
};

//prettier-ignore
export const perks = {
    apple: [
        { level: 1, collectRequired: 50, reward: 8, unlocked: false },
        { level: 2, collectRequired: 100, reward: 16, unlocked: false },
        { level: 3, collectRequired: 250, reward: 24, unlocked: false },
        { level: 4, collectRequired: 500, reward: 32, unlocked: false },
        { level: 5, collectRequired: 800, reward: 40, unlocked: false }, 
    ],
    carrot: [
        { level: 1, collectRequired: 20, reward: 6, unlocked: false },
        { level: 2, collectRequired: 40, reward: 12, unlocked: false },
        { level: 3, collectRequired: 60, reward: 18, unlocked: false },
        { level: 4, collectRequired: 80, reward: 24, unlocked: false },
        { level: 5, collectRequired: 100, reward: 30, unlocked: false },
    ],
    banana: [
        { level: 1, collectRequired: 15, reward: 4, unlocked: false },
        { level: 2, collectRequired: 30, reward: 8, unlocked: false },
        { level: 3, collectRequired: 45, reward: 12, unlocked: false },
        { level: 4, collectRequired: 60, reward: 16, unlocked: false },
        { level: 5, collectRequired: 80, reward: 20, unlocked: false },
    ],
    apricot: [
        { level: 1, collectRequired: 8, reward: 4, unlocked: false },
        { level: 2, collectRequired: 15, reward: 8, unlocked: false },
        { level: 3, collectRequired: 30, reward: 12, unlocked: false },
        { level: 4, collectRequired: 45, reward: 16, unlocked: false },
        { level: 5, collectRequired: 70, reward: 20, unlocked: false },
    ],
    watermelon: [
        { level: 1, collectRequired: 8, reward: 4, unlocked: false },
        { level: 2, collectRequired: 15, reward: 8, unlocked: false },
        { level: 3, collectRequired: 25, reward: 12, unlocked: false },
        { level: 4, collectRequired: 40, reward: 16, unlocked: false },
        { level: 5, collectRequired: 60, reward: 20, unlocked: false },
    ],
    avocado: [
        { level: 1, collectRequired: 5, reward: 4, unlocked: false },
        { level: 2, collectRequired: 10, reward: 8, unlocked: false },
        { level: 3, collectRequired: 20, reward: 12, unlocked: false },
        { level: 4, collectRequired: 30, reward: 16, unlocked: false },
        { level: 5, collectRequired: 40, reward: 20, unlocked: false },
    ],
};
