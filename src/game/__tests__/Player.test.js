import { Player } from '../Player';

describe('Player', () => {
  let player;
  let mockScene;
  let mockPhysics;

  beforeEach(() => {
    // Phaser.jsのモックを作成
    mockPhysics = {
      add: {
        sprite: jest.fn(() => ({
          setBounce: jest.fn(),
          setCollideWorldBounds: jest.fn(),
          setVelocityX: jest.fn(),
          setVelocityY: jest.fn(),
          body: {
            touching: { down: false },
            velocity: { x: 0, y: 0 },
          },
        })),
      },
    };

    mockScene = {
      physics: mockPhysics,
      sys: {
        game: {
          config: { width: 800, height: 600 },
        },
      },
    };

    player = new Player(mockScene, 100, 300);
  });

  describe('constructor', () => {
    test('プレイヤーが正しい位置に作成される', () => {
      expect(player.x).toBe(100);
      expect(player.y).toBe(300);
    });

    test('初期状態が正しく設定される', () => {
      expect(player.health).toBe(3);
      expect(player.isFloating).toBe(false);
      expect(player.floatTime).toBe(0);
      expect(player.powerUps).toEqual([]);
    });
  });

  describe('move', () => {
    test('左方向への移動が正しく動作する', () => {
      player.move('left');
      expect(player.sprite.setVelocityX).toHaveBeenCalledWith(-200);
    });

    test('右方向への移動が正しく動作する', () => {
      player.move('right');
      expect(player.sprite.setVelocityX).toHaveBeenCalledWith(200);
    });

    test('無効な方向指定で停止する', () => {
      player.move('invalid');
      expect(player.sprite.setVelocityX).toHaveBeenCalledWith(0);
    });
  });

  describe('jump', () => {
    test('地面に接触している時のジャンプが正しく動作する', () => {
      player.sprite.body.touching.down = true;
      player.jump();
      expect(player.sprite.setVelocityY).toHaveBeenCalledWith(-400);
    });

    test('空中ではジャンプできない', () => {
      player.sprite.body.touching.down = false;
      player.jump();
      expect(player.sprite.setVelocityY).not.toHaveBeenCalled();
    });
  });

  describe('float', () => {
    test('浮遊開始時の処理が正しく動作する', () => {
      player.sprite.body.touching.down = false;
      player.sprite.body.velocity.y = 100;
      player.float();
      expect(player.isFloating).toBe(true);
      expect(player.floatTime).toBeGreaterThan(0);
    });

    test('最大浮遊時間を超えると浮遊が停止する', () => {
      player.floatTime = 3000;
      player.float();
      expect(player.isFloating).toBe(false);
    });
  });

  describe('takeDamage', () => {
    test('ダメージを受けると体力が減少する', () => {
      const initialHealth = player.health;
      player.takeDamage(1);
      expect(player.health).toBe(initialHealth - 1);
    });

    test('体力が0以下になると死亡状態になる', () => {
      player.health = 1;
      player.takeDamage(1);
      expect(player.health).toBe(0);
      expect(player.isDead).toBe(true);
    });
  });

  describe('applyPowerUp', () => {
    test('スピードアップパワーアップが正しく適用される', () => {
      player.applyPowerUp('speed');
      expect(player.powerUps).toContain('speed');
      expect(player.speed).toBe(300); // 通常200から300に増加
    });

    test('ジャンプ強化パワーアップが正しく適用される', () => {
      player.applyPowerUp('jump');
      expect(player.powerUps).toContain('jump');
      expect(player.jumpVelocity).toBe(-600); // 通常-400から-600に増加
    });
  });

  describe('update', () => {
    test('浮遊時間が正しく更新される', () => {
      player.isFloating = true;
      player.floatTime = 1000;
      player.update(16); // 16ms経過
      expect(player.floatTime).toBe(1016);
    });

    test('浮遊していない時は浮遊時間が減少する', () => {
      player.isFloating = false;
      player.floatTime = 1000;
      player.update(16); // 16ms経過
      expect(player.floatTime).toBe(968); // 32ms減少
    });
  });
});