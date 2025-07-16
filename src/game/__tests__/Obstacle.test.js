import { Obstacle } from '../Obstacle';

describe('Obstacle', () => {
  let obstacle;
  let mockScene;
  let mockPlayer;

  beforeEach(() => {
    mockScene = {
      physics: {
        add: {
          sprite: jest.fn(() => ({
            setImmovable: jest.fn(),
            body: {
              width: 40,
              height: 40,
            },
          })),
        },
      },
    };

    mockPlayer = {
      sprite: {
        x: 100,
        y: 100,
        body: {
          width: 40,
          height: 40,
        },
      },
      takeDamage: jest.fn(),
    };

    obstacle = new Obstacle(mockScene, 200, 300, 'spike');
  });

  describe('constructor', () => {
    test('障害物が正しい位置に作成される', () => {
      expect(obstacle.x).toBe(200);
      expect(obstacle.y).toBe(300);
      expect(obstacle.type).toBe('spike');
    });

    test('スプライトが不動に設定される', () => {
      expect(obstacle.sprite.setImmovable).toHaveBeenCalledWith(true);
    });
  });

  describe('checkCollision', () => {
    test('プレイヤーと衝突している場合にtrueを返す', () => {
      // プレイヤーの位置を障害物と重なるように設定
      mockPlayer.sprite.x = 200;
      mockPlayer.sprite.y = 300;
      
      const collision = obstacle.checkCollision(mockPlayer);
      expect(collision).toBe(true);
    });

    test('プレイヤーと衝突していない場合にfalseを返す', () => {
      // プレイヤーの位置を障害物から離れた場所に設定
      mockPlayer.sprite.x = 100;
      mockPlayer.sprite.y = 100;
      
      const collision = obstacle.checkCollision(mockPlayer);
      expect(collision).toBe(false);
    });

    test('衝突時にプレイヤーにダメージを与える', () => {
      mockPlayer.sprite.x = 200;
      mockPlayer.sprite.y = 300;
      
      obstacle.checkCollision(mockPlayer);
      expect(mockPlayer.takeDamage).toHaveBeenCalledWith(1);
    });
  });

  describe('getDamage', () => {
    test('スパイク障害物のダメージ量が正しい', () => {
      const spikeObstacle = new Obstacle(mockScene, 0, 0, 'spike');
      expect(spikeObstacle.getDamage()).toBe(1);
    });

    test('ピット障害物のダメージ量が正しい', () => {
      const pitObstacle = new Obstacle(mockScene, 0, 0, 'pit');
      expect(pitObstacle.getDamage()).toBe(3);
    });

    test('未知の障害物タイプのダメージ量が正しい', () => {
      const unknownObstacle = new Obstacle(mockScene, 0, 0, 'unknown');
      expect(unknownObstacle.getDamage()).toBe(1);
    });
  });

  describe('getPosition', () => {
    test('障害物の位置を正しく返す', () => {
      const position = obstacle.getPosition();
      expect(position.x).toBe(200);
      expect(position.y).toBe(300);
    });
  });
});