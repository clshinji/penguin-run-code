/**
 * プレイヤーコントローラークラス
 * キーボードとタッチ入力を処理する
 */
export class PlayerController {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    
    this.setupKeyboard();
    this.setupTouch();
  }

  /**
   * キーボード入力の設定
   */
  setupKeyboard() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  /**
   * タッチ入力の設定
   */
  setupTouch() {
    // タッチイベントの設定（後で実装）
    this.scene.input.on('pointerdown', this.handleTouchStart.bind(this));
    this.scene.input.on('pointerup', this.handleTouchEnd.bind(this));
  }

  /**
   * キーボード入力処理
   * @param {Phaser.Input.Keyboard.Key} key
   */
  handleKeyboard(key) {
    // 移動キーの処理
    if (this.cursors.left.isDown) {
      this.player.move('left');
    } else if (this.cursors.right.isDown) {
      this.player.move('right');
    } else {
      this.player.move('stop');
    }
    
    // ジャンプキーの処理
    if (this.spaceKey.isDown && this.player.sprite.body.touching.down) {
      this.player.jump();
    }
    
    // 浮遊キーの処理
    if (this.spaceKey.isDown && !this.player.sprite.body.touching.down) {
      this.player.float();
    } else {
      this.player.stopFloat();
    }
  }

  /**
   * タッチ開始処理
   * @param {Phaser.Input.Pointer} pointer
   */
  handleTouchStart(pointer) {
    const { width, height } = this.scene.sys.game.config;
    const x = pointer.x;
    const y = pointer.y;
    
    // 画面左半分でタッチした場合は左移動
    if (x < width / 2) {
      this.touchDirection = 'left';
    } else {
      this.touchDirection = 'right';
    }
    
    // 画面下半分でタッチした場合はジャンプ
    if (y > height / 2) {
      this.touchJump = true;
    }
  }

  /**
   * タッチ終了処理
   * @param {Phaser.Input.Pointer} pointer
   */
  handleTouchEnd(pointer) {
    this.touchDirection = null;
    this.touchJump = false;
  }

  /**
   * タッチ入力処理
   * @param {Phaser.Input.Pointer} pointer
   */
  handleTouch(pointer) {
    // 移動処理
    if (this.touchDirection === 'left') {
      this.player.move('left');
    } else if (this.touchDirection === 'right') {
      this.player.move('right');
    } else {
      this.player.move('stop');
    }
    
    // ジャンプ処理
    if (this.touchJump && this.player.sprite.body.touching.down) {
      this.player.jump();
    }
    
    // 浮遊処理
    if (this.touchJump && !this.player.sprite.body.touching.down) {
      this.player.float();
    } else {
      this.player.stopFloat();
    }
  }

  /**
   * 毎フレーム更新処理
   * @param {number} deltaTime
   */
  updatePlayer(deltaTime) {
    // キーボード入力処理
    this.handleKeyboard();
    
    // タッチ入力処理
    if (this.touchDirection || this.touchJump) {
      this.handleTouch();
    }
    
    // プレイヤーの更新
    this.player.update(deltaTime);
  }
}