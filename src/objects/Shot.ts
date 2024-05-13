import { Game } from "../scenes/Game";

export type ShotConfig = {
  name: "playerShot" | "blueShot" | "pinkShot";
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
    super.update();
    const width = Number(this.scene.game.config.width);
    const height = Number(this.scene.game.config.height);
    if (this.y < -10) this.destroy();
    if (this.y > height + 10) this.destroy();

    if (this.x < -10) this.destroy();
    if (this.x > width + 10) this.destroy();
  }
}
