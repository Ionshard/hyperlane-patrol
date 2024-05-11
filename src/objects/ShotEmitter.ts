import { Game } from "../scenes/Game";
import { Shot } from "./Shot";

export interface ShotEmitter {
  start(): void;
}

export class SimpleShotEmitter
  extends Phaser.GameObjects.Group
  implements ShotEmitter
{
  host: Phaser.Physics.Arcade.Sprite;

  declare scene: Game;
  constructor(scene: Game, host: Phaser.Physics.Arcade.Sprite) {
    super(scene);
    this.host = host;
    this.scene.add.existing(this);
  }

  start(): void {
    this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.scene.enemyShots.add(
          new Shot(this.scene, this.host.x, this.host.y).setVelocityY(50)
        );
      },
    });
  }
}
