import Phaser from 'phaser';

/**
 * メインメニューシーン
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  preload() {
    // 一時的なプレースホルダーテキストを作成
    this.load.image('logo', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDQ5OWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuODmuODs+OCtOODsz48L3RleHQ+PC9zdmc+');
  }

  create() {
    const { width, height } = this.sys.game.config;
    
    // 背景色を設定
    this.cameras.main.setBackgroundColor('#87CEEB');
    
    // タイトルロゴ
    const logo = this.add.image(width / 2, height / 4, 'logo');
    logo.setScale(1.5);
    
    // ゲームタイトル
    this.add.text(width / 2, height / 2 - 50, 'ペンギンの冒険', {
      fontSize: '32px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    
    // サブタイトル
    this.add.text(width / 2, height / 2 - 10, '家族を探す旅', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1,
    }).setOrigin(0.5);
    
    // スタートボタン
    const startButton = this.add.text(width / 2, height / 2 + 40, 'ゲームスタート', {
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      backgroundColor: '#ff6b6b',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5);
    
    startButton.setInteractive({ useHandCursor: true });
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
    
    // 設定ボタン
    const settingsButton = this.add.text(width / 2, height / 2 + 100, '設定', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      backgroundColor: '#4ecdc4',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5);
    
    settingsButton.setInteractive({ useHandCursor: true });
    settingsButton.on('pointerdown', () => {
      this.scene.start('SettingsScene');
    });
    
    // 操作説明
    this.add.text(width / 2, height - 50, '矢印キーで移動、SPACEでジャンプ・浮遊', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1,
    }).setOrigin(0.5);
  }
}