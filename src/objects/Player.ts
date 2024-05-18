import { Game } from "../scenes/Game";
import { Shot } from "./Shot";

const GOD_MODE = true;
const MAX_HP = 3;
const shotDelay = 100;
const hitBoxRadius = 3;
const touchScreenOffset = "ontouchstart" in window ? 50 : 0;

export class Player extends Phaser.Physics.Arcade.Sprite {
  controllable = true;
  private lastShot: number;
  private hp: number;

  declare body: Phaser.Physics.Arcade.Body;
  declare scene: Game;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "player");
    this.hp = MAX_HP;
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

    if (!this.controllable) return;

    this.x = this.scene.input.activePointer.x;
    this.y = this.scene.input.activePointer.y - touchScreenOffset;

    if (
      this.scene.input.activePointer.isDown &&
      time - this.lastShot > shotDelay
    ) {
      this.shoot();
      this.lastShot = time;
    }
  }

  shoot() {
    this.scene.sound.play("shot");
    this.scene.playerShots.add(
      new Shot(this.scene, this.x, this.y - 25, {
        name: "playerShot",
        velocityX: 0,
        velocityY: -500,
      })
    );
  }

  onShotCollide(shot: Shot) {
    if (!this.controllable) return;
    if (!GOD_MODE) this.hp--;
    shot.destroy();

    if (this.hp <= 0) this.scene.scene.start("GameOver");
  }
}
