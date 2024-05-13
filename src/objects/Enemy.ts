import { Game } from "../scenes/Game";
import { Shot } from "./Shot";
import { ShotEmitter, RingShotEmitter } from "./ShotEmitter";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  shotEmitter: ShotEmitter;
  private hp: number;
  declare body: Phaser.Physics.Arcade.Body;
  declare scene: Game;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "enemy");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.shotEmitter = new RingShotEmitter(this.scene, {
      type: "ring",
      host: this,
      shot: "blueShot",
      initialAngle: 0,
      bulletSpeed: 150,
      spawnRate: 500,
      numberOfShots: 22,
      spinRate: 25,
      radius: 50,
    });
    this.shotEmitter.start();
    this.hp = 100;

    const otherEmitter = this.scene.add.shotEmitter({
      type: "ring",
      host: this,
      shot: "pinkShot",
      initialAngle: Math.PI,
      bulletSpeed: 150,
      spawnRate: 500,
      numberOfShots: 11,
      spinRate: -25,
      radius: 50,
    });
    this.scene.time.delayedCall(250, () => otherEmitter.start());
    // this.on(Phaser.GameObjects.Events.DESTROY, () => otherEmitter.destroy());
    // this.scene.tweens.add({
    //   targets: this,
    //   x: { from: 100, to: 300 },
    //   duration: 3000,
    //   yoyo: true,
    //   repeat: -1,
    // });
  }

  onShotCollide(shot: Shot) {
    this.hp--;
    shot.destroy();

    if (this.hp <= 0) this.scene.scene.start("Win");
  }
}
