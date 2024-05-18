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

    this.load.audio("alarm", "alarm.wav");
    this.load.audio("damage", "damage.wav");
    this.load.audio("gameLoop", "gameLoop.mp3");
    this.load.audio("gameOver", "gameOver.ogg");
    this.load.audio("longExplosion", "longExplosion.wav");
    this.load.audio("playerHit", "playerHit.wav");
    this.load.audio("menu", "menu.mp3");
    this.load.audio("select", "select.wav");
    this.load.audio("shot", "shot.wav");
    this.load.audio("start", "start.wav");
    this.load.audio("victory", "victory.ogg");

    this.load.bitmapFont(
      "OceanicDrift",
      "OceanicDrift.png",
      "OceanicDrift.xml"
    );

    this.load.on("complete", () => {
      this.scene.run("Background");
      this.scene.start("Splash");
    });
  }
}
