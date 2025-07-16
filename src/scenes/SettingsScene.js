import Phaser from 'phaser';

/**
 * 設定シーン
 */
export class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' });
  }

  create() {
    const { width, height } = this.sys.game.config;
    
    // 背景色を設定
    this.cameras.main.setBackgroundColor('#87CEEB');
    
    // タイトル
    this.add.text(width / 2, height / 4, '設定', {
      fontSize: '32px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    
    // 設定項目（後で実装）
    this.add.text(width / 2, height / 2 - 50, '音量設定', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1,
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height / 2, '難易度設定', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1,
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height / 2 + 50, 'ユーザー管理', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1,
    }).setOrigin(0.5);
    
    // 戻るボタン
    const backButton = this.add.text(width / 2, height - 100, 'メニューに戻る', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      backgroundColor: '#ff6b6b',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5);
    
    backButton.setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
    
    // ESCキーでメニューに戻る
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.escKey.on('down', () => {
      this.scene.start('MainMenuScene');
    });
  }
}