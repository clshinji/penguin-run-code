# デザイン文書

## 概要

ペンギンの横スクロールアクションゲームは、HTML5 CanvasとJavaScriptを使用したウェブベースのゲームです。Phaser.jsフレームワークを採用し、子供向けの直感的なUI/UXと、マルチユーザー対応のデータ管理システムを実装します。

## アーキテクチャ

### システム全体構成

```
┌─────────────────────────────────────────┐
│              Frontend (Browser)          │
├─────────────────────────────────────────┤
│  Game Engine (Phaser.js)                │
│  ├── Scene Manager                       │
│  ├── Physics Engine                      │
│  ├── Audio Manager                       │
│  └── Input Handler                       │
├─────────────────────────────────────────┤
│  Game Logic Layer                        │
│  ├── Player Controller                   │
│  ├── Enemy AI                            │
│  ├── Collision Detection                 │
│  ├── Power-up System                     │
│  └── Achievement System                  │
├─────────────────────────────────────────┤
│  Data Management Layer                   │
│  ├── User Manager                        │
│  ├── Save System                         │
│  ├── Settings Manager                    │
│  └── Backup/Restore                      │
├─────────────────────────────────────────┤
│  Storage Layer                           │
│  ├── LocalStorage (User Data)           │
│  ├── SessionStorage (Temp Data)         │
│  └── File System (Backup/Restore)       │
└─────────────────────────────────────────┘
```

### レイヤー構成

1. **プレゼンテーション層**: UI/UX、シーン管理
2. **ゲームロジック層**: ゲームルール、物理演算
3. **データ管理層**: ユーザーデータ、設定管理
4. **ストレージ層**: データ永続化

## コンポーネントとインターフェース

### 1. ゲームエンジンコンポーネント

#### GameEngine クラス
```javascript
class GameEngine {
  constructor(config)
  init()
  start()
  pause()
  resume()
  stop()
}
```

#### SceneManager クラス
```javascript
class SceneManager {
  loadScene(sceneName)
  getCurrentScene()
  transitionTo(sceneName, transitionType)
}
```

### 2. プレイヤー管理コンポーネント

#### Player クラス
```javascript
class Player {
  constructor(x, y)
  move(direction)
  jump()
  float()
  takeDamage()
  applyPowerUp(powerUpType)
  getPosition()
  getState()
}
```

#### PlayerController クラス
```javascript
class PlayerController {
  handleKeyboard(event)
  handleTouch(event)
  updatePlayer(deltaTime)
}
```

### 3. 敵・障害物管理コンポーネント

#### Enemy クラス
```javascript
class Enemy {
  constructor(x, y, type)
  move()
  checkCollision(player)
  destroy()
}
```

#### Obstacle クラス
```javascript
class Obstacle {
  constructor(x, y, type)
  checkCollision(player)
}
```

### 4. アイテム・パワーアップシステム

#### PowerUp クラス
```javascript
class PowerUp {
  constructor(x, y, type)
  activate(player)
  deactivate(player)
  getRemainingTime()
}
```

#### ItemManager クラス
```javascript
class ItemManager {
  spawnItem(x, y, type)
  collectItem(item, player)
  updateItems(deltaTime)
}
```

### 5. ユーザー管理システム

#### UserManager クラス
```javascript
class UserManager {
  createUser(username)
  switchUser(userId)
  deleteUser(userId)
  getCurrentUser()
  getAllUsers()
}
```

#### SaveSystem クラス
```javascript
class SaveSystem {
  saveUserData(userId, gameData)
  loadUserData(userId)
  exportBackup(userId)
  importBackup(backupData)
}
```

### 6. 音響システム

#### AudioManager クラス
```javascript
class AudioManager {
  loadSound(soundId, url)
  playBGM(musicId)
  playSFX(soundId)
  setVolume(type, volume)
  mute(type)
  preloadAudio(audioList)
  crossfadeBGM(fromId, toId, duration)
}
```

#### 音楽ファイル管理構造
```
assets/
├── audio/
│   ├── bgm/
│   │   ├── main-theme.ogg
│   │   ├── stage-1.ogg
│   │   ├── stage-2.ogg
│   │   ├── boss-theme.ogg
│   │   └── ending-theme.ogg
│   ├── sfx/
│   │   ├── jump.ogg
│   │   ├── item-collect.ogg
│   │   ├── enemy-defeat.ogg
│   │   ├── damage.ogg
│   │   └── stage-clear.ogg
│   └── audio-manifest.json
```

#### 音響アセット管理
```javascript
const AudioAssets = {
  bgm: {
    mainTheme: 'assets/audio/bgm/main-theme.ogg',
    stage1: 'assets/audio/bgm/stage-1.ogg',
    stage2: 'assets/audio/bgm/stage-2.ogg',
    bossTheme: 'assets/audio/bgm/boss-theme.ogg',
    ending: 'assets/audio/bgm/ending-theme.ogg'
  },
  sfx: {
    jump: 'assets/audio/sfx/jump.ogg',
    itemCollect: 'assets/audio/sfx/item-collect.ogg',
    enemyDefeat: 'assets/audio/sfx/enemy-defeat.ogg',
    damage: 'assets/audio/sfx/damage.ogg',
    stageClear: 'assets/audio/sfx/stage-clear.ogg'
  }
}
```

#### 音楽ファイル仕様
- **フォーマット**: OGG Vorbis（主）、MP3（フォールバック）
- **品質**: 128kbps（BGM）、96kbps（効果音）
- **ループ対応**: BGMは seamless loop 対応
- **ファイルサイズ**: BGM 1-3MB、効果音 10-100KB

#### 音楽ファイル準備計画

##### 1. 音楽ファイル準備方針
- **BGM**: 別途準備されたMP3ファイルを使用
  - 全ステージで同一の音楽ファイルを共通使用
  - メインテーマとステージ音楽の2種類
- **効果音**: 必要なOGGファイルを別途準備
  - 指定フォルダ（assets/audio/sfx/）に配置

##### 2. 音楽ファイル配置構造
```
assets/
├── audio/
│   ├── bgm/
│   │   ├── main-theme.mp3      // メインメニュー用
│   │   └── stage-music.mp3     // 全ステージ共通
│   ├── sfx/
│   │   ├── jump.ogg           // ジャンプ音
│   │   ├── item-collect.ogg   // アイテム取得音
│   │   ├── enemy-defeat.ogg   // 敵撃破音
│   │   ├── damage.ogg         // ダメージ音
│   │   └── stage-clear.ogg    // ステージクリア音
│   └── audio-manifest.json
```

##### 3. 音響アセット設定
```javascript
const AudioAssets = {
  bgm: {
    mainTheme: 'assets/audio/bgm/main-theme.mp3',
    stageMusic: 'assets/audio/bgm/stage-music.mp3'  // 全ステージ共通
  },
  sfx: {
    jump: 'assets/audio/sfx/jump.ogg',
    itemCollect: 'assets/audio/sfx/item-collect.ogg',
    enemyDefeat: 'assets/audio/sfx/enemy-defeat.ogg',
    damage: 'assets/audio/sfx/damage.ogg',
    stageClear: 'assets/audio/sfx/stage-clear.ogg'
  }
}
```

##### 4. 音楽制作ガイドライン
- **子供向け特性**: 明るく、親しみやすく、怖くない
- **音量レベル**: -6dB以下でマスタリング
- **楽器選択**: ピアノ、木管楽器、弦楽器中心
- **テンポ**: BGM 100-140 BPM、効果音は短時間（0.5-2秒）
```

### 7. UI管理システム

#### UIManager クラス
```javascript
class UIManager {
  showMenu(menuType)
  hideMenu()
  updateHUD(gameState)
  showDialog(message, options)
}
```

## データモデル

### 1. ユーザーデータモデル

```javascript
const UserData = {
  id: String,
  username: String,
  createdAt: Date,
  lastPlayedAt: Date,
  gameProgress: {
    currentStage: Number,
    completedStages: Array,
    totalScore: Number,
    bestTimes: Object
  },
  achievements: {
    unlocked: Array,
    progress: Object
  },
  settings: {
    difficulty: String,
    audioSettings: {
      bgmVolume: Number,
      sfxVolume: Number,
      muted: Boolean
    },
    controls: Object
  },
  statistics: {
    totalPlayTime: Number,
    deathCount: Number,
    itemsCollected: Number,
    secretsFound: Number
  }
}
```

### 2. ゲーム状態モデル

```javascript
const GameState = {
  currentUser: String,
  currentStage: Number,
  player: {
    position: {x: Number, y: Number},
    health: Number,
    powerUps: Array,
    score: Number
  },
  stage: {
    enemies: Array,
    items: Array,
    obstacles: Array,
    secrets: Array
  },
  ui: {
    showDebug: Boolean,
    currentMenu: String
  }
}
```

### 3. ステージデータモデル

```javascript
const StageData = {
  id: Number,
  name: String,
  background: String,
  music: String,
  layout: {
    width: Number,
    height: Number,
    platforms: Array,
    spawnPoint: {x: Number, y: Number},
    goalPoint: {x: Number, y: Number}
  },
  entities: {
    enemies: Array,
    items: Array,
    obstacles: Array,
    secrets: Array
  },
  difficulty: {
    easy: Object,
    normal: Object,
    hard: Object
  }
}
```

## エラーハンドリング

### 1. ゲームエラー処理

```javascript
class GameErrorHandler {
  handleRuntimeError(error)
  handleAssetLoadError(asset)
  handleSaveError(error)
  showErrorDialog(message)
  recoverFromError()
}
```

### 2. エラー分類

- **致命的エラー**: ゲーム続行不可、リロード必要
- **回復可能エラー**: 一時的な問題、自動復旧
- **ユーザーエラー**: 不正な入力、警告表示

### 3. エラー対応フロー

```
エラー発生 → エラー分類 → ログ記録 → ユーザー通知 → 復旧処理
```

## テスト戦略

### 1. 単体テスト
- 各クラスの個別機能テスト
- データモデルの検証
- 計算ロジックの正確性確認

### 2. 統合テスト
- コンポーネント間の連携テスト
- データフローの検証
- API呼び出しの確認

### 3. ユーザビリティテスト
- 子供による実際のプレイテスト
- 操作性の確認
- UI/UXの改善点抽出

### 4. パフォーマンステスト
- フレームレート測定
- メモリ使用量監視
- 読み込み時間計測

### 5. 互換性テスト
- 各ブラウザでの動作確認
- デバイス別の表示確認
- タッチ操作の検証

## セキュリティ設計

### 1. データ保護
- ローカルストレージのみ使用
- 個人情報の非収集
- データ暗号化（必要に応じて）

### 2. 入力検証
- ユーザー名の文字数・文字種制限
- ファイルアップロードの検証
- XSS攻撃の防止

### 3. 外部リソース管理
- 信頼できるCDNからのライブラリ読み込み
- CSP（Content Security Policy）の設定
- HTTPS接続の強制

## ステージ設計システム

### 1. ステージレイアウト管理

#### StageManager クラス
```javascript
class StageManager {
  loadStage(stageId)
  getStageData(stageId)
  generatePlatforms(layoutData)
  spawnEntities(entityData)
  checkStageCompletion()
}
```

#### CameraController クラス
```javascript
class CameraController {
  followPlayer(player)
  updateViewport(deltaTime)
  setScrollBounds(minX, maxX)
  smoothScroll(targetX, speed)
}
```

### 2. スクロール機能の実装
- **水平スクロール**: プレイヤーが画面右端に到達時に自動スクロール
- **カメラ追従**: プレイヤーを中心とした滑らかなカメラ移動
- **境界制御**: ステージ端での適切な停止処理

## 物理エンジン設計

### 1. 重力・物理システム

#### PhysicsEngine クラス
```javascript
class PhysicsEngine {
  applyGravity(entity, deltaTime)
  handleCollisions(entities)
  checkGroundContact(entity)
  calculateJumpVelocity(jumpPower)
  processFloating(entity, inputHeld)
}
```

### 2. 衝突検出システム
- **AABB衝突検出**: 矩形ベースの高速衝突判定
- **レイキャスティング**: 地面接触の精密な検出
- **衝突レイヤー**: エンティティ種別による衝突制御

### 3. 浮遊機能の物理計算
```javascript
const FloatingPhysics = {
  maxFloatTime: 3000, // 3秒
  floatForce: -200,   // 上向きの力
  normalGravity: 800, // 通常重力
  floatGravity: 100   // 浮遊時重力
}
```

## アニメーションシステム

### 1. スプライトアニメーション管理

#### AnimationManager クラス
```javascript
class AnimationManager {
  createAnimation(name, frames, frameRate)
  playAnimation(entity, animationName)
  updateAnimations(deltaTime)
  setAnimationCallback(name, callback)
}
```

### 2. キャラクター状態遷移
```
待機 ⟷ 移動 ⟷ ジャンプ
  ↓      ↓      ↓
浮遊 ⟷ ダメージ ⟷ 死亡
```

### 3. エフェクトアニメーション
- **パーティクルシステム**: アイテム取得、敵撃破エフェクト
- **画面エフェクト**: ダメージ時の画面フラッシュ
- **UI アニメーション**: メニューの滑らかな遷移

## デバッグシステム設計

### 1. デバッグモード実装

#### DebugManager クラス
```javascript
class DebugManager {
  toggleDebugMode()
  showDebugInfo(gameState)
  enableStageSelect()
  displayCollisionBoxes()
  showPerformanceMetrics()
}
```

### 2. ステージ選択機能
```javascript
class StageSelector {
  showStageList()
  selectStage(stageId)
  previewStage(stageId)
  validateStageData(stageData)
}
```

### 3. デバッグ情報表示
- **座標情報**: プレイヤー位置、速度
- **パフォーマンス**: FPS、メモリ使用量
- **ゲーム状態**: ライフ、スコア、アクティブなパワーアップ
- **衝突ボックス**: 視覚的な当たり判定表示

## レスポンシブデザイン詳細

### 1. 画面サイズ対応

#### ResponsiveManager クラス
```javascript
class ResponsiveManager {
  detectScreenSize()
  adjustGameScale(screenWidth, screenHeight)
  repositionUIElements()
  updateTouchControls()
}
```

### 2. デバイス別レイアウト
```javascript
const ScreenLayouts = {
  mobile: {
    gameScale: 0.8,
    uiScale: 1.2,
    touchControlsVisible: true
  },
  tablet: {
    gameScale: 1.0,
    uiScale: 1.0,
    touchControlsVisible: true
  },
  desktop: {
    gameScale: 1.0,
    uiScale: 0.9,
    touchControlsVisible: false
  }
}
```

### 3. タッチUI要素設計
- **仮想十字キー**: 左下に配置、移動操作用
- **ジャンプボタン**: 右下に配置、大きめのサイズ
- **浮遊ボタン**: ジャンプボタンの長押しで代用
- **メニューボタン**: 右上に配置、設定・一時停止用

## 実績システム設計

### 1. 実績管理

#### AchievementManager クラス
```javascript
class AchievementManager {
  checkAchievements(gameState)
  unlockAchievement(achievementId)
  generateShareImage(achievement)
  getAchievementProgress(achievementId)
}
```

### 2. 実績データ構造
```javascript
const Achievement = {
  id: String,
  name: String,
  description: String,
  icon: String,
  condition: Function,
  reward: Object,
  shareMessage: String
}
```

## パフォーマンス最適化

### 1. レンダリング最適化
- **スプライトバッチング**: 同種オブジェクトの一括描画
- **オフスクリーンレンダリング**: 背景の事前レンダリング
- **視錐台カリング**: 画面外オブジェクトの描画スキップ

### 2. メモリ管理
- **オブジェクトプール**: 敵・弾丸・エフェクトの再利用
- **アセット管理**: 不要なテクスチャの適切な解放
- **ガベージコレクション**: 大量オブジェクト生成の回避

### 3. アセット最適化
- **画像圧縮**: WebP形式の活用、適切な解像度
- **音声最適化**: OGG/MP3の使い分け、ループ最適化
- **遅延読み込み**: ステージ別のアセット分割読み込み

### 4. ネットワーク最適化
- **CDN活用**: Phaser.jsライブラリの高速配信
- **キャッシュ戦略**: アセットの適切なキャッシュ設定
- **圧縮**: Gzip圧縮の有効化