import Phaser from 'phaser';
import { GameEngine } from './game/GameEngine';
import { CONFIG } from './utils/config';

// ゲームの初期化
const game = new GameEngine(CONFIG);

// ローディング完了後にローディング画面を非表示
game.events.on('ready', () => {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'none';
  }
});

// エクスポート（テスト用）
export { game };