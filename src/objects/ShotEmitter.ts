import { Game } from "../scenes/Game";
import { Shot } from "./Shot";

export interface ShotEmitter extends Phaser.GameObjects.Group {
  start(): void;
}

export type ShotEmitterConfig = RingShotEmitterConfig;

export type BaseShotEmitterConfig = {
  host: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform;
};

export type RingShotEmitterConfig = BaseShotEmitterConfig & {
  type: "ring";
  bulletSpeed: number;
  spawnRate: number;
  numberOfShots: number;
  spinRate: number;
  initialAngle: number;
};
export class RingShotEmitter
  extends Phaser.GameObjects.Group
  implements ShotEmitter
{
  config: RingShotEmitterConfig;
  prime: Phaser.Math.Vector2;

  declare scene: Game;
  constructor(scene: Game, config: RingShotEmitterConfig) {
    super(scene);
    this.config = config;
    this.scene.add.existing(this);
    this.prime = new Phaser.Math.Vector2(1, 0)
      .rotate(this.config.initialAngle)
      .normalize();
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
        new Shot(this.scene, this.config.host.x, this.config.host.y, {
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

function shotEmitterFactory(
  this: Phaser.GameObjects.GameObjectFactory,
  config: ShotEmitterConfig
): ShotEmitter {
  switch (config.type) {
    case "ring":
      return new RingShotEmitter(this.scene as Game, config);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "shotEmitter",
  shotEmitterFactory
);

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      shotEmitter: typeof shotEmitterFactory;
    }
  }
}
