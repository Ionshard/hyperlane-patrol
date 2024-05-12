import { Game } from "../scenes/Game";

export type ShotConfig = {
  name: string;
  velocityY: number;
  velocityX: number;
};
export class Shot extends Phaser.Physics.Arcade.Image {
  config: ShotConfig;

  constructor(scene: Game, x: number, y: number, config: ShotConfig) {
    super(scene, x, y, config.name);
    this.config = config;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    //console.log("Firing shot", config);
    this.setVelocity(this.config.velocityX, this.config.velocityY);
  }

  update(): void {
    const height = Number(this.scene.game.config.height);
    if (this.y < -10) this.destroy();
    if (this.y > height + 10) this.destroy();
  }
}
