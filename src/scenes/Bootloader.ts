import { Scene } from "phaser";

export class Bootloader extends Scene {
  constructor() {
    super("Bootloader");
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("player", "player.png");
    this.load.image("blueShot", "blueShot.png");
    this.load.image("pinkShot", "pinkShot.png");
    this.load.image("enemy", "enemy.png");
    this.load.on("complete", () => this.scene.start("Game"));
  }
}
