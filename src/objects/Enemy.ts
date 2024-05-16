import { Game } from "../scenes/Game";
import { Shot } from "./Shot";
import { ShotEmitter } from "./ShotEmitter";

const MAX_HP = 100;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  shotEmitter: ShotEmitter;
  hp: number;
  declare body: Phaser.Physics.Arcade.Body;
  declare scene: Game;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "sprites", "sprite_enemy_sphereprobe_0.png");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.anims.play({ key: "sphereProbe", repeat: -1 });
    this.hp = MAX_HP;
  }

  onShotCollide(shot: Shot) {
    this.hp--;
    shot.destroy();
    this.tint = Phaser.Display.Color.GetColor(
      255,
      255 * (this.hp / MAX_HP),
      255 * (this.hp / MAX_HP)
    );

    this.emit("HIT", this);
  }
}
