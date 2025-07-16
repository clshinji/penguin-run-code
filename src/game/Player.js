import { GAME_SETTINGS } from '../utils/config';

/**
 * プレイヤーキャラクター（ペンギン）クラス
 */
export class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    
    // プレイヤーの基本設定
    this.health = GAME_SETTINGS.player.health;
    this.speed = GAME_SETTINGS.player.speed;
    this.jumpVelocity = GAME_SETTINGS.player.jumpVelocity;
    this.maxFloatTime = GAME_SETTINGS.player.maxFloatTime;
    
    // 状態管理
    this.isFloating = false;
    this.floatTime = 0;
    this.isDead = false;
    this.powerUps = [];
    
    // スプライトの作成
    this.sprite = this.scene.physics.add.sprite(x, y, 'player');
    this.sprite.setBounce(0.2);
    this.sprite.setCollideWorldBounds(true);
    
    // プレイヤーの参照をスプライトに設定
    this.sprite.player = this;
  }

  /**
   * プレイヤーを移動させる
   * @param {string} direction - 移動方向 ('left', 'right', 'stop')
   */
  move(direction) {
    if (this.isDead) return;
    
    switch (direction) {
      case 'left':
        this.sprite.setVelocityX(-this.speed);
        break;
      case 'right':
        this.sprite.setVelocityX(this.speed);
        break;
      case 'stop':
      default:
        this.sprite.setVelocityX(0);
        break;
    }
  }

  /**
   * プレイヤーをジャンプさせる
   */
  jump() {
    if (this.isDead) return;
    
    // 地面に接触している場合のみジャンプ可能
    if (this.sprite.body.touching.down) {
      this.sprite.setVelocityY(this.jumpVelocity);
    }
  }

  /**
   * プレイヤーを浮遊させる（カービィ風）
   */
  float() {
    if (this.isDead) return;
    
    // 空中でかつ最大浮遊時間未満の場合のみ浮遊可能
    if (!this.sprite.body.touching.down && this.floatTime < this.maxFloatTime) {
      // 現在の落下速度を減速
      this.sprite.setVelocityY(this.sprite.body.velocity.y * 0.8);
      this.isFloating = true;
      this.floatTime += 16; // 約60FPSで16ms
    } else {
      this.isFloating = false;
    }
  }

  /**
   * 浮遊を停止する
   */
  stopFloat() {
    this.isFloating = false;
  }

  /**
   * ダメージを受ける
   * @param {number} damage - ダメージ量
   */
  takeDamage(damage = 1) {
    if (this.isDead) return;
    
    this.health -= damage;
    
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.die();
    }
  }

  /**
   * 死亡処理
   */
  die() {
    // 死亡アニメーション（後で実装）
    this.sprite.setTint(0xff0000); // 赤色に変更
    
    // 死亡イベントを発火
    this.scene.events.emit('player-death');
  }

  /**
   * プレイヤーをリセット（復活）
   */
  reset() {
    this.health = GAME_SETTINGS.player.health;
    this.isDead = false;
    this.isFloating = false;
    this.floatTime = 0;
    this.powerUps = [];
    this.speed = GAME_SETTINGS.player.speed;
    this.jumpVelocity = GAME_SETTINGS.player.jumpVelocity;
    
    // スプライトの色を元に戻す
    this.sprite.clearTint();
  }

  /**
   * パワーアップを適用
   * @param {string} powerUpType - パワーアップの種類
   */
  applyPowerUp(powerUpType) {
    if (this.powerUps.includes(powerUpType)) return;
    
    this.powerUps.push(powerUpType);
    
    switch (powerUpType) {
      case 'speed':
        this.speed = GAME_SETTINGS.player.speed * 1.5;
        break;
      case 'jump':
        this.jumpVelocity = GAME_SETTINGS.player.jumpVelocity * 1.5;
        break;
      default:
        break;
    }
  }

  /**
   * パワーアップを解除
   * @param {string} powerUpType - パワーアップの種類
   */
  removePowerUp(powerUpType) {
    const index = this.powerUps.indexOf(powerUpType);
    if (index > -1) {
      this.powerUps.splice(index, 1);
    }
    
    // パワーアップ効果を元に戻す
    switch (powerUpType) {
      case 'speed':
        this.speed = GAME_SETTINGS.player.speed;
        break;
      case 'jump':
        this.jumpVelocity = GAME_SETTINGS.player.jumpVelocity;
        break;
      default:
        break;
    }
  }

  /**
   * プレイヤーの位置を取得
   * @returns {Object} - {x, y}
   */
  getPosition() {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
    };
  }

  /**
   * プレイヤーの状態を取得
   * @returns {Object} - プレイヤーの状態
   */
  getState() {
    return {
      health: this.health,
      isDead: this.isDead,
      isFloating: this.isFloating,
      floatTime: this.floatTime,
      powerUps: [...this.powerUps],
      position: this.getPosition(),
    };
  }

  /**
   * 毎フレーム更新処理
   * @param {number} deltaTime - 前フレームからの経過時間（ms）
   */
  update(deltaTime) {
    // 浮遊時間の管理
    if (this.isFloating) {
      this.floatTime += deltaTime;
      if (this.floatTime >= this.maxFloatTime) {
        this.isFloating = false;
      }
    } else {
      // 浮遊していない時は浮遊時間を減少
      this.floatTime = Math.max(0, this.floatTime - deltaTime * 2);
    }
  }
}