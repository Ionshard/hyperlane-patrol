import { Game } from "../scenes/Game";
import { Shot } from "./Shot";

const shotDelay = 100;
const hitBoxRadius = 3;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private lastShot: number;
  private hp: number;

  declare body: Phaser.Physics.Arcade.Body;
  declare scene: Game;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "player");
    this.hp = 3;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.lastShot = this.scene.time.now;
    this.body.setAllowGravity(false);
    this.body.setCircle(
      hitBoxRadius,
      this.width / 2.0 - hitBoxRadius * 1.5,
      this.height / 2.0 - hitBoxRadius * 1.5
    );
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.x = this.scene.input.activePointer.x;
    this.y = this.scene.input.activePointer.y;

    if (
      this.scene.input.activePointer.isDown &&
      time - this.lastShot > shotDelay
    ) {
      this.shoot();
      this.lastShot = time;
    }
  }

  shoot() {
    this.scene.playerShots.add(
      new Shot(this.scene, this.x, this.y - 25, {
        name: "playerShot",
        velocityX: 0,
        velocityY: -500,
      })
    );
  }

  onShotCollide(shot: Shot) {
    this.hp--;
    shot.destroy();

    if (this.hp <= 0) this.scene.scene.start("GameOver");
  }
}
