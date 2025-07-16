import { CollisionDetection } from '../CollisionDetection';

describe('CollisionDetection', () => {
  let collisionDetection;
  let mockScene;
  let mockPlayer;
  let mockObstacles;

  beforeEach(() => {
    mockScene = {
      events: {
        emit: jest.fn(),
      },
    };

    mockPlayer = {
      sprite: {
        x: 100,
        y: 100,
        body: {
          width: 40,
          height: 40,
          touching: { down: false },
        },
      },
      takeDamage: jest.fn(),
    };

    mockObstacles = [
      {
        sprite: { x: 200, y: 200 },
        checkCollision: jest.fn(() => false),
        type: 'spike',
      },
      {
        sprite: { x: 300, y: 300 },
        checkCollision: jest.fn(() => false),
        type: 'pit',
      },
    ];

    collisionDetection = new CollisionDetection(mockScene);
  });

  describe('constructor', () => {
    test('衝突検出システムが正しく初期化される', () => {
      expect(collisionDetection.scene).toBe(mockScene);
      expect(collisionDetection.collisions).toEqual([]);
    });
  });

  describe('checkPlayerObstacleCollisions', () => {
    test('障害物との衝突をチェックする', () => {
      collisionDetection.checkPlayerObstacleCollisions(mockPlayer, mockObstacles);
      
      mockObstacles.forEach(obstacle => {
        expect(obstacle.checkCollision).toHaveBeenCalledWith(mockPlayer);
      });
    });

    test('衝突した障害物の情報を記録する', () => {
      mockObstacles[0].checkCollision.mockReturnValue(true);
      
      const collisions = collisionDetection.checkPlayerObstacleCollisions(mockPlayer, mockObstacles);
      
      expect(collisions).toHaveLength(1);
      expect(collisions[0].obstacle).toBe(mockObstacles[0]);
      expect(collisions[0].player).toBe(mockPlayer);
    });
  });

  describe('checkFallDamage', () => {
    test('プレイヤーが画面下に落下した場合にダメージを与える', () => {
      const screenHeight = 600;
      mockPlayer.sprite.y = screenHeight + 50; // 画面下に落下
      
      const hasFallen = collisionDetection.checkFallDamage(mockPlayer, screenHeight);
      
      expect(hasFallen).toBe(true);
      expect(mockPlayer.takeDamage).toHaveBeenCalledWith(1);
    });

    test('プレイヤーが画面内にいる場合はダメージを与えない', () => {
      const screenHeight = 600;
      mockPlayer.sprite.y = 300; // 画面内
      
      const hasFallen = collisionDetection.checkFallDamage(mockPlayer, screenHeight);
      
      expect(hasFallen).toBe(false);
      expect(mockPlayer.takeDamage).not.toHaveBeenCalled();
    });
  });

  describe('checkAABB', () => {
    test('AABBによる矩形衝突判定が正しく動作する', () => {
      const rect1 = { x: 0, y: 0, width: 50, height: 50 };
      const rect2 = { x: 25, y: 25, width: 50, height: 50 }; // 重なっている
      
      const collision = collisionDetection.checkAABB(rect1, rect2);
      expect(collision).toBe(true);
    });

    test('重なっていない矩形で衝突判定がfalseを返す', () => {
      const rect1 = { x: 0, y: 0, width: 50, height: 50 };
      const rect2 = { x: 100, y: 100, width: 50, height: 50 }; // 離れている
      
      const collision = collisionDetection.checkAABB(rect1, rect2);
      expect(collision).toBe(false);
    });
  });

  describe('getCollisionHistory', () => {
    test('衝突履歴を正しく返す', () => {
      collisionDetection.collisions = [
        { timestamp: Date.now(), type: 'obstacle' },
        { timestamp: Date.now() - 1000, type: 'fall' },
      ];
      
      const history = collisionDetection.getCollisionHistory();
      expect(history).toHaveLength(2);
    });

    test('古い衝突履歴をクリアする', () => {
      collisionDetection.collisions = [
        { timestamp: Date.now(), type: 'obstacle' },
        { timestamp: Date.now() - 10000, type: 'fall' }, // 10秒前
      ];
      
      collisionDetection.clearOldCollisions(5000); // 5秒以上古いものをクリア
      
      expect(collisionDetection.collisions).toHaveLength(1);
    });
  });
});