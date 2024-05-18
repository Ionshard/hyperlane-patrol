import { Game } from "../scenes/Game";
import { Shot } from "./Shot";

const GOD_MODE = false;
const MAX_HP = 3;
const shotDelay = 100;
const hitBoxRadius = 3;
const touchScreenOffset = "ontouchstart" in window ? 50 : 0;

export class Player extends Phaser.Physics.Arcade.Sprite {
  controllable = true;
  redshift = 0;
  private lastShot: number;
  private hp: number;

  declare body: Phaser.Physics.Arcade.Body;
  declare scene: Game;
  damage: Phaser.Tweens.Tween;

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

    this.tint = Phaser.Display.Color.GetColor(
      255,
      255 - this.redshift,
      255 - this.redshift
    );

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

    this.damage?.stop();
    this.damage = this.scene.tweens.add({
      targets: this,
      redshift: { from: 0, to: 255 * (1 - this.hp / MAX_HP) },
      duration: 100 * (this.hp / MAX_HP),
      repeatDelay: 400 * (this.hp / MAX_HP),
      ease: "Sine",
      yoyo: true,
      repeat: -1,
    });

    this.scene.cameras.main.shake(100, 0.01);

    if (this.hp <= 0) this.scene.scene.start("GameOver");
  }
}
