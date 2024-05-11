import { Game } from "../scenes/Game";
import { Shot } from "./Shot";

export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  declare scene: Game;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "player");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => this.shoot());
  }

  protected preUpdate(time: number, delta: number): void {
    this.x = this.scene.input.activePointer.x;
    this.y = this.scene.input.activePointer.y;
  }

  shoot() {
    this.scene.enemyShots.add(
      new Shot(this.scene, this.x, this.y).setVelocityY(-200)
    );
  }
}
