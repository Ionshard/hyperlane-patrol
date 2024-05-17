import { Scene } from "phaser";

export class Bootloader extends Scene {
  constructor() {
    super("Bootloader");
  }

  preload() {
    this.load.setPath("assets");
    this.load.atlas("sprites", "sprites.png", "sprites.json");

    this.load.image("player", "player.png");
    this.load.spritesheet("playerShot", "playerShot.png", {
      frameWidth: 19,
      frameHeight: 38,
    });
    this.load.image("blueShot", "blueShot.png");
    this.load.image("pinkShot", "pinkShot.png");
    this.load.image("enemy", "enemy.png");
    this.load.on("complete", () => {
      this.scene.run("Background");
      this.scene.start("Splash");
    });
  }
}
