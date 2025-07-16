// Jest設定ファイル
import 'jest-environment-jsdom';

// Phaserのモック
global.Phaser = {
  AUTO: 'AUTO',
  Game: class MockGame {
    constructor() {}
  },
  Scene: class MockScene {
    constructor() {}
  },
  Scale: {
    FIT: 'FIT',
    CENTER_BOTH: 'CENTER_BOTH',
  },
  Input: {
    Keyboard: {
      KeyCodes: {
        SPACE: 32,
        ESC: 27,
      },
    },
  },
};

// HTMLCanvasElementのモック
global.HTMLCanvasElement.prototype.getContext = jest.fn();