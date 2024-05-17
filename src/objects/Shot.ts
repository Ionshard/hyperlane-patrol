import { Game } from "../scenes/Game";

const SHOT_DATA = {
  playerShot: {
    animated: true,
    shimmer: false,
  },
  blueShot: {
    animated: false,
    shimmer: true,
  },
  pinkShot: {
    animated: false,
    shimmer: true,
  },
} as const;

export type ShotConfig = {
  name: keyof typeof SHOT_DATA;
  velocityY: number;
  velocityX: number;
};
export class Shot extends Phaser.Physics.Arcade.Sprite {
  config: ShotConfig;

  constructor(scene: Game, x: number, y: number, config: ShotConfig) {
    super(scene, x, y, config.name, 0);
    this.config = config;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    //console.log("Firing shot", config);
    this.setVelocity(this.config.velocityX, this.config.velocityY);
    if (SHOT_DATA[config.name].animated) {
      this.play({ key: config.name, repeat: -1 });
    }
    if (SHOT_DATA[config.name].shimmer) {
      const tween = this.scene.tweens.add({
        targets: this,
        scale: { from: 0.8, to: 1.2 },
        duration: 200,
        repeat: -1,
        yoyo: true,
      });
      this.on(Phaser.GameObjects.Events.DESTROY, () => tween.stop());
    }
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
