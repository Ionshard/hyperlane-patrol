import { Game } from "../scenes/Game";

export class Shot extends Phaser.Physics.Arcade.Image {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "shot");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  update(): void {
    const height = Number(this.scene.game.config.height);
    if (this.y < -10) this.destroy();
    if (this.y > height + 10) this.destroy();
  }
}
