/**
 * 衝突検出システム
 * AABB（Axis-Aligned Bounding Box）による衝突判定
 */
export class CollisionDetection {
  constructor(scene) {
    this.scene = scene;
    this.collisions = [];
  }

  /**
   * プレイヤーと障害物の衝突をチェック
   * @param {Player} player - プレイヤーオブジェクト
   * @param {Array<Obstacle>} obstacles - 障害物の配列
   * @returns {Array} 衝突情報の配列
   */
  checkPlayerObstacleCollisions(player, obstacles) {
    const collisions = [];
    
    obstacles.forEach(obstacle => {
      if (obstacle.checkCollision(player)) {
        const collisionInfo = {
          type: 'obstacle',
          player: player,
          obstacle: obstacle,
          timestamp: Date.now(),
        };
        
        collisions.push(collisionInfo);
        this.collisions.push(collisionInfo);
        
        // 衝突イベントを発火
        this.scene.events.emit('player-obstacle-collision', collisionInfo);
      }
    });
    
    return collisions;
  }

  /**
   * プレイヤーの落下ダメージをチェック
   * @param {Player} player - プレイヤーオブジェクト
   * @param {number} screenHeight - 画面の高さ
   * @returns {boolean} 落下したかどうか
   */
  checkFallDamage(player, screenHeight) {
    const fallThreshold = screenHeight + 50; // 画面下50px
    
    if (player.sprite.y > fallThreshold) {
      player.takeDamage(1);
      
      const fallInfo = {
        type: 'fall',
        player: player,
        timestamp: Date.now(),
      };
      
      this.collisions.push(fallInfo);
      this.scene.events.emit('player-fall', fallInfo);
      
      return true;
    }
    
    return false;
  }

  /**
   * AABB（軸平行境界ボックス）による衝突判定
   * @param {Object} rect1 - 矩形1 {x, y, width, height}
   * @param {Object} rect2 - 矩形2 {x, y, width, height}
   * @returns {boolean} 衝突しているかどうか
   */
  checkAABB(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * 円形の衝突判定
   * @param {Object} circle1 - 円1 {x, y, radius}
   * @param {Object} circle2 - 円2 {x, y, radius}
   * @returns {boolean} 衝突しているかどうか
   */
  checkCircleCollision(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < (circle1.radius + circle2.radius);
  }

  /**
   * 点と矩形の衝突判定
   * @param {Object} point - 点 {x, y}
   * @param {Object} rect - 矩形 {x, y, width, height}
   * @returns {boolean} 衝突しているかどうか
   */
  checkPointInRect(point, rect) {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  }

  /**
   * レイキャスト（光線投射）による衝突判定
   * @param {Object} start - 開始点 {x, y}
   * @param {Object} end - 終了点 {x, y}
   * @param {Array<Object>} obstacles - 障害物の配列
   * @returns {Object|null} 最初に衝突した障害物または null
   */
  raycast(start, end, obstacles) {
    let closestHit = null;
    let closestDistance = Infinity;
    
    obstacles.forEach(obstacle => {
      const bounds = this.getBounds(obstacle.sprite);
      const hit = this.rayRectIntersection(start, end, bounds);
      
      if (hit) {
        const distance = this.getDistance(start, hit);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestHit = { obstacle, hit, distance };
        }
      }
    });
    
    return closestHit;
  }

  /**
   * 光線と矩形の交点を計算
   * @param {Object} start - 開始点
   * @param {Object} end - 終了点
   * @param {Object} rect - 矩形
   * @returns {Object|null} 交点または null
   */
  rayRectIntersection(start, end, rect) {
    // レイの方向ベクトル
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    // 矩形の各辺との交点を計算
    const t1 = (rect.x - start.x) / dx;
    const t2 = (rect.x + rect.width - start.x) / dx;
    const t3 = (rect.y - start.y) / dy;
    const t4 = (rect.y + rect.height - start.y) / dy;
    
    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
    
    // 交点が存在し、レイの範囲内にある場合
    if (tmax >= 0 && tmin <= tmax && tmin >= 0 && tmin <= 1) {
      return {
        x: start.x + tmin * dx,
        y: start.y + tmin * dy,
      };
    }
    
    return null;
  }

  /**
   * スプライトの境界を取得
   * @param {Phaser.Physics.Arcade.Sprite} sprite
   * @returns {Object} 境界情報
   */
  getBounds(sprite) {
    return {
      x: sprite.x - sprite.body.width / 2,
      y: sprite.y - sprite.body.height / 2,
      width: sprite.body.width,
      height: sprite.body.height,
    };
  }

  /**
   * 二点間の距離を計算
   * @param {Object} point1 - 点1
   * @param {Object} point2 - 点2
   * @returns {number} 距離
   */
  getDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 衝突履歴を取得
   * @returns {Array} 衝突履歴
   */
  getCollisionHistory() {
    return [...this.collisions];
  }

  /**
   * 古い衝突履歴をクリア
   * @param {number} maxAge - 保持する最大時間（ミリ秒）
   */
  clearOldCollisions(maxAge = 10000) {
    const now = Date.now();
    this.collisions = this.collisions.filter(
      collision => now - collision.timestamp < maxAge
    );
  }

  /**
   * 衝突履歴をクリア
   */
  clearCollisions() {
    this.collisions = [];
  }

  /**
   * 衝突検出の統計情報を取得
   * @returns {Object} 統計情報
   */
  getStats() {
    const now = Date.now();
    const recentCollisions = this.collisions.filter(
      collision => now - collision.timestamp < 5000 // 直近5秒
    );
    
    const obstacleCollisions = recentCollisions.filter(c => c.type === 'obstacle');
    const fallCollisions = recentCollisions.filter(c => c.type === 'fall');
    
    return {
      totalCollisions: this.collisions.length,
      recentCollisions: recentCollisions.length,
      obstacleCollisions: obstacleCollisions.length,
      fallCollisions: fallCollisions.length,
    };
  }
}