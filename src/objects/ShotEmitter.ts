import { Game } from "../scenes/Game";
import { Shot, ShotConfig } from "./Shot";

export interface ShotEmitter extends Phaser.GameObjects.Group {
  start(): void;
  stop(): void;
  isPaused(): boolean;
}

export type ShotEmitterConfig = RingShotEmitterConfig;

export type BaseShotEmitterConfig = {
  host: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform;
  shot: ShotConfig["name"];
};

export type RingShotEmitterConfig = BaseShotEmitterConfig & {
  type: "ring";
  bulletSpeed: number;
  spawnRate: number;
  numberOfShots: number;
  spinRate: number;
  initialAngle: number;
  radius: number;
  startDelay: number | null;
};
export class RingShotEmitter
  extends Phaser.GameObjects.Group
  implements ShotEmitter
{
  config: RingShotEmitterConfig;

  private prime: Phaser.Math.Vector2;
  private timerEvent: Phaser.Time.TimerEvent;

  declare scene: Game;
  constructor(scene: Game, config: RingShotEmitterConfig) {
    super(scene);
    this.config = config;
    this.scene.add.existing(this);
    this.prime = new Phaser.Math.Vector2(1, 0)
      .rotate(this.config.initialAngle)
      .normalize();

    this.timerEvent = this.scene.time.addEvent({
      paused: true,
      delay: this.config.spawnRate,
      loop: true,
      callback: () => this.emitShots(),
    });

    this.config.host.on(Phaser.GameObjects.Events.DESTROY, () =>
      this.destroy()
    );
    this.on(Phaser.GameObjects.Events.DESTROY, () => this.timerEvent.destroy());

    if (this.config.startDelay !== null) {
      if (this.config.startDelay === 0) {
        this.start();
      } else {
        this.scene.time.delayedCall(this.config.startDelay, () => this.start());
      }
    }
  }

  start(): void {
    if (this.timerEvent.paused) this.timerEvent.paused = false;
  }

  stop(): void {
    if (!this.timerEvent.paused) this.timerEvent.paused = true;
  }

  isPaused(): boolean {
    return this.timerEvent.paused;
  }

  emitShots() {
    const angleOffset = Phaser.Math.PI2 / this.config.numberOfShots;
    for (let i = 0; i < this.config.numberOfShots; i++) {
      const angle = this.prime
        .clone()
        .rotate(angleOffset * i)
        .normalize();

      const velocity = angle.clone().scale(this.config.bulletSpeed);
      const position = angle
        .clone()
        .scale(this.config.radius)
        .add(new Phaser.Math.Vector2(this.config.host.x, this.config.host.y));

      this.scene.enemyShots.add(
        new Shot(this.scene, position.x, position.y, {
          name: this.config.shot,
          velocityX: velocity.x,
          velocityY: velocity.y,
        })
      );
    }
    this.prime.rotate(this.config.spinRate);
  }
}

export function shotEmitterFactory(
  this: Phaser.GameObjects.GameObjectFactory,
  config: ShotEmitterConfig
): ShotEmitter {
  switch (config.type) {
    case "ring":
      return new RingShotEmitter(this.scene as Game, config);
  }
}
