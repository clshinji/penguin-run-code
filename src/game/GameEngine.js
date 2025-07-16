import Phaser from 'phaser';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { GameScene } from '../scenes/GameScene';
import { SettingsScene } from '../scenes/SettingsScene';

/**
 * ゲームエンジンクラス
 * Phaser.jsゲームの初期化と管理を行う
 */
export class GameEngine extends Phaser.Game {
  constructor(config) {
    // シーンをconfigに追加
    config.scene = [MainMenuScene, GameScene, SettingsScene];
    
    super(config);
    
    this.init();
  }

  /**
   * ゲームエンジンの初期化
   */
  init() {
    // ゲーム準備完了イベントを発火
    this.events.once('ready', () => {
      console.log('ゲームエンジンが初期化されました');
    });
    
    // 初期化完了を少し遅らせる（アセット読み込み完了を待つ）
    setTimeout(() => {
      this.events.emit('ready');
    }, 100);
  }

  /**
   * ゲームを開始
   */
  start() {
    this.scene.start('MainMenuScene');
  }

  /**
   * ゲームを一時停止
   */
  pause() {
    this.scene.pause();
  }

  /**
   * ゲームを再開
   */
  resume() {
    this.scene.resume();
  }

  /**
   * ゲームを停止
   */
  stop() {
    this.destroy(true);
  }
}