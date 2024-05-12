import { Game } from "../scenes/Game";
import { ShotEmitter, RingShotEmitter } from "./ShotEmitter";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  shotEmitter: ShotEmitter;
  declare body: Phaser.Physics.Arcade.Body;
  declare scene: Game;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "enemy");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.shotEmitter = new RingShotEmitter(this.scene, this, {
      type: "ring",
      initialAngle: 0,
      bulletSpeed: 150,
      spawnRate: 500,
      numberOfShots: 7,
      spinRate: 0,
    });
    this.shotEmitter.start();

    // this.scene.tweens.add({
    //   targets: this,
    //   x: { from: 100, to: 300 },
    //   duration: 3000,
    //   yoyo: true,
    //   repeat: -1,
    // });
  }
}
