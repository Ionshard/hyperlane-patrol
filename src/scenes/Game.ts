import { Scene } from "phaser";
import { Player } from "../objects/Player";
import { SimpleShotEmitter } from "../objects/ShotEmitter";

export class Game extends Scene {
  player: Player;
  enemyShots: Phaser.GameObjects.Group;
  constructor() {
    super("Game");
  }

  create() {
    // this.add.image(512, 384, "background");
    // this.add.image(512, 350, "logo").setDepth(100);
    this.add
      .text(0, 0, "Game", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0)
      .setDepth(100);

    this.player = new Player(this, 100, 100);
    this.enemyShots = this.add.group({
      runChildUpdate: true,
    });

    const enemy = this.physics.add.sprite(100, 100, "enemy");
    enemy.setOrigin(0.5);

    const testEmitter = new SimpleShotEmitter(this, enemy);
    testEmitter.start();
    this.add.existing(testEmitter);
  }
}
