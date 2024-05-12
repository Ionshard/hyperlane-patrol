import { Game } from "../scenes/Game";
import { Shot } from "./Shot";

export interface ShotEmitter {
  start(): void;
}

export type RingShotEmitterConfig = {
  type: "ring";
  bulletSpeed: number;
  spawnRate: number;
  numberOfShots: number;
  spinRate: number;
};
export class RingShotEmitter
  extends Phaser.GameObjects.Group
  implements ShotEmitter
{
  host: Phaser.Physics.Arcade.Sprite;
  config: RingShotEmitterConfig;
  prime: Phaser.Math.Vector2;

  declare scene: Game;
  constructor(
    scene: Game,
    host: Phaser.Physics.Arcade.Sprite,
    config: RingShotEmitterConfig
  ) {
    super(scene);
    this.host = host;
    this.config = config;
    this.scene.add.existing(this);
    this.prime = new Phaser.Math.Vector2(0, 1);
  }

  start(): void {
    this.scene.time.addEvent({
      delay: this.config.spawnRate,
      loop: true,
      callback: () => this.emitShots(),
    });
  }

  emitShots() {
    let velocity = this.prime.clone();
    const angleOffset = Phaser.Math.PI2 / this.config.numberOfShots;
    for (let i = 0; i < this.config.numberOfShots; i++) {
      velocity = velocity.normalize().scale(this.config.bulletSpeed);
      this.scene.enemyShots.add(
        new Shot(this.scene, this.host.x, this.host.y, {
          name: "shot",
          velocityX: velocity.x,
          velocityY: velocity.y,
        })
      );

      velocity = velocity.rotate(angleOffset);
    }
    this.prime = this.prime.rotate(this.config.spinRate);
  }
}
