import { Game } from "../scenes/Game";
import { Shot } from "./Shot";

export interface ShotEmitter {
  start(): void;
}

export class SimpleShotEmitter
  extends Phaser.GameObjects.Group
  implements ShotEmitter
{
  host: Phaser.Types.Physics.Arcade.GameObjectWithBody;

  declare scene: Game;
  constructor(
    scene: Game,
    host: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
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
          new Shot(this.scene, this.host.body.x, this.host.body.y).setVelocityY(
            50
          )
        );
      },
    });
  }
}
