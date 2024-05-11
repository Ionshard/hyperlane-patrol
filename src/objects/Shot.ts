import { Physics } from "phaser";
import { Game } from "../scenes/Game";

export class Shot extends Phaser.Physics.Arcade.Image {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "shot");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  update(): void {
    if (this.y < -10) this.destroy();
  }
}
