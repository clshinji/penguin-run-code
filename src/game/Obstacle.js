/**
 * 障害物クラス
 * プレイヤーにダメージを与える静的な障害物
 */
export class Obstacle {
  constructor(scene, x, y, type = 'spike') {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.type = type;
    
    // 障害物タイプ別の設定
    this.config = this.getObstacleConfig(type);
    
    // スプライトの作成
    this.sprite = this.scene.physics.add.sprite(x, y, this.config.texture);
    this.sprite.setImmovable(true);
    
    // 障害物の参照をスプライトに設定
    this.sprite.obstacle = this;
  }

  /**
   * 障害物タイプ別の設定を取得
   * @param {string} type - 障害物タイプ
   * @returns {Object} 設定オブジェクト
   */
  getObstacleConfig(type) {
    const configs = {
      spike: {
        texture: 'spike',
        damage: 1,
        description: 'トゲ',
      },
      pit: {
        texture: 'pit',
        damage: 3,
        description: '落とし穴',
      },
      fire: {
        texture: 'fire',
        damage: 2,
        description: '炎',
      },
      ice: {
        texture: 'ice',
        damage: 1,
        description: '氷',
      },
    };
    
    return configs[type] || configs.spike;
  }

  /**
   * プレイヤーとの衝突をチェック
   * @param {Player} player - プレイヤーオブジェクト
   * @returns {boolean} 衝突しているかどうか
   */
  checkCollision(player) {
    const playerBounds = this.getBounds(player.sprite);
    const obstacleBounds = this.getBounds(this.sprite);
    
    const collision = this.isRectangleColliding(playerBounds, obstacleBounds);
    
    if (collision) {
      this.onCollision(player);
    }
    
    return collision;
  }

  /**
   * 矩形の境界を取得
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
   * 二つの矩形が衝突しているかチェック
   * @param {Object} rect1 - 矩形1
   * @param {Object} rect2 - 矩形2
   * @returns {boolean} 衝突しているかどうか
   */
  isRectangleColliding(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * 衝突時の処理
   * @param {Player} player - プレイヤーオブジェクト
   */
  onCollision(player) {
    // プレイヤーにダメージを与える
    player.takeDamage(this.getDamage());
    
    // 衝突エフェクトを発生（後で実装）
    this.createCollisionEffect();
    
    // 衝突イベントを発火
    this.scene.events.emit('obstacle-collision', {
      obstacle: this,
      player: player,
      damage: this.getDamage(),
    });
  }

  /**
   * 障害物のダメージ量を取得
   * @returns {number} ダメージ量
   */
  getDamage() {
    return this.config.damage;
  }

  /**
   * 衝突エフェクトを作成
   */
  createCollisionEffect() {
    // パーティクルエフェクトや画面フラッシュなど（後で実装）
    console.log(`${this.config.description}に衝突！`);
  }

  /**
   * 障害物の位置を取得
   * @returns {Object} 位置情報
   */
  getPosition() {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
    };
  }

  /**
   * 障害物の状態を取得
   * @returns {Object} 状態情報
   */
  getState() {
    return {
      type: this.type,
      position: this.getPosition(),
      damage: this.getDamage(),
      description: this.config.description,
    };
  }

  /**
   * 障害物を破壊
   */
  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}