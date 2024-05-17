import { Bootloader } from "./scenes/Bootloader";
import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Scale, Types } from "phaser";
import { Splash } from "./scenes/Splash";
import { GameOver } from "./scenes/GameOver";
import { Win } from "./scenes/Win";
import { Background } from "./scenes/Background";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 450,
  height: 1000,
  parent: "game-container",
  backgroundColor: "#030309",
  disableContextMenu: true,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [Bootloader, Splash, MainGame, GameOver, Win, Background],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      // debug: true,
    },
  },
};

export default new Game(config);
