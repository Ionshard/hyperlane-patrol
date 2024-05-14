import { Game } from "../scenes/Game";
import { Shot } from "./Shot";
import { ShotEmitter } from "./ShotEmitter";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  shotEmitter: ShotEmitter;
  private hp: number;
  declare body: Phaser.Physics.Arcade.Body;
  declare scene: Game;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "sprites", "sprite_enemy_sphereprobe_0.png");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.anims.play({ key: "sphereProbe", repeat: -1 });
    this.hp = 100;

    const width = Number(this.scene.game.config.width);
    const height = Number(this.scene.game.config.height);

    this.scene.tweens.addMultiple([
      {
        targets: this,
        x: width / 2,
        ease: "Quad.easeIn",
        duration: 1000,
      },
      {
        targets: this,
        y: { from: -10, to: height * 0.25 },
        duration: 1000,
        onComplete: () => this.emit("STAGE1"),
      },
    ]);

    this.on("STAGE1", () => {
      const blueEmitter = this.scene.add.shotEmitter({
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
      const pinkEmitter = this.scene.add.shotEmitter({
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
      blueEmitter.start();
      this.scene.time.delayedCall(250, () => pinkEmitter.start());

      this.scene.tweens.chain({
        tweens: [
          {
            targets: this,
            x: 300,
            duration: 1500,
          },
          {
            targets: this,
            x: { from: 300, to: 100 },
            duration: 3000,
            yoyo: true,
            repeat: -1,
          },
        ],
      });
    });
  }

  onShotCollide(shot: Shot) {
    this.hp--;
    shot.destroy();

    if (this.hp <= 0) this.scene.scene.start("Win");
  }
}
