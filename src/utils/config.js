// ゲーム設定
export const CONFIG = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 240,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  scene: [],
};

// ゲームプレイ設定
export const GAME_SETTINGS = {
  player: {
    speed: 200,
    jumpVelocity: -400,
    floatForce: -200,
    maxFloatTime: 3000,
    health: 3,
  },
  physics: {
    gravity: 800,
    floatGravity: 100,
  },
  difficulty: {
    easy: {
      health: 5,
      enemySpeedMultiplier: 0.5,
    },
    normal: {
      health: 3,
      enemySpeedMultiplier: 1.0,
    },
    hard: {
      health: 1,
      enemySpeedMultiplier: 1.5,
    },
  },
};