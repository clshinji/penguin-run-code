import Phaser from 'phaser';

/**
 * メインゲームシーン
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // 一時的なプレースホルダー画像を作成
    this.load.image('player', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iIzAwMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIzIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSIxNSIgcj0iMyIgZmlsbD0iI2ZmZiIvPjxlbGxpcHNlIGN4PSIyMCIgY3k9IjI1IiByeD0iNSIgcnk9IjMiIGZpbGw9IiNmZmEiLz48L3N2Zz4=');
    this.load.image('ground', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM4YjQ1MTMiLz48L3N2Zz4=');
  }

  create() {
    const { width, height } = this.sys.game.config;
    
    // 背景色を設定
    this.cameras.main.setBackgroundColor('#87CEEB');
    
    // 地面を作成
    this.platforms = this.physics.add.staticGroup();
    
    // メインの地面
    for (let i = 0; i < width; i += 100) {
      this.platforms.create(i + 50, height - 20, 'ground');
    }
    
    // プレイヤーを作成
    this.player = this.physics.add.sprite(100, height - 100, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    // プレイヤーと地面の衝突を設定
    this.physics.add.collider(this.player, this.platforms);
    
    // キーボード入力を設定
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // ゲーム状態の初期化
    this.gameState = {
      health: 3,
      score: 0,
      isFloating: false,
      floatTime: 0,
    };
    
    // HUD要素を作成
    this.createHUD();
    
    // ESCキーでメニューに戻る
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.escKey.on('down', () => {
      this.scene.start('MainMenuScene');
    });
  }

  createHUD() {
    // ライフ表示
    this.healthText = this.add.text(20, 20, `ライフ: ${this.gameState.health}`, {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setScrollFactor(0);
    
    // スコア表示
    this.scoreText = this.add.text(20, 50, `スコア: ${this.gameState.score}`, {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setScrollFactor(0);
    
    // 操作説明
    this.add.text(20, this.sys.game.config.height - 30, 'ESCキーでメニューに戻る', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1,
    }).setScrollFactor(0);
  }

  update() {
    // プレイヤーの移動処理
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }
    
    // ジャンプ処理
    if (this.spaceKey.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
    }
    
    // 浮遊処理（基本実装）
    if (this.spaceKey.isDown && !this.player.body.touching.down) {
      if (this.gameState.floatTime < 3000) {
        this.player.setVelocityY(this.player.body.velocity.y * 0.8);
        this.gameState.floatTime += 16; // 約60FPSで16ms
        this.gameState.isFloating = true;
      }
    } else {
      this.gameState.floatTime = Math.max(0, this.gameState.floatTime - 32);
      this.gameState.isFloating = false;
    }
  }
}