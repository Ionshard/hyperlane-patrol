import { Scene } from "phaser";
import { Player } from "../objects/Player";
import { Enemy } from "../objects/Enemy";
import { Shot } from "../objects/Shot";
import { shotEmitterFactory } from "../objects/ShotEmitter";
import { Script } from "../objects/Script";

export class Game extends Scene {
  player: Player;
  playerShots: Phaser.GameObjects.Group;
  enemyShots: Phaser.GameObjects.Group;
  enemies: Phaser.GameObjects.Group;
  script: Script;
  constructor() {
    super("Game");
  }

  create() {
    this.hideCursor();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => this.showCursor());

    this.sound.add("shot");
    this.sound.add("damage");
    this.sound.add("start").play();

    this.anims.create({
      key: "playerShot",
      frames: this.anims.generateFrameNumbers("playerShot", {
        start: 0,
        end: 2,
      }),
      frameRate: 20,
      yoyo: true,
    });

    this.anims.create({
      key: "sphereProbe",
      frames: this.anims.generateFrameNames("sprites", {
        start: 0,
        end: 14,
        prefix: "sprite_enemy_sphereprobe_",
        suffix: ".png",
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: "explosion",
      frames: this.anims.generateFrameNames("sprites", {
        start: 0,
        end: 17,
        prefix: "sprite_explosion_medium_",
        suffix: ".png",
      }),
      frameRate: 10,
    });
    this.player = new Player(this, 100, 100);
    this.playerShots = this.add.group({
      runChildUpdate: true,
    });

    this.enemies = this.add.group();

    this.enemyShots = this.add.group({
      runChildUpdate: true,
    });

    this.physics.add.overlap(this.player, this.enemyShots, ((
      player: Player,
      shot: Shot
    ) =>
      player.onShotCollide(
        shot
      )) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);

    this.physics.add.overlap(this.enemies, this.playerShots, ((
      enemy: Enemy,
      shot: Shot
    ) =>
      enemy.onShotCollide(
        shot
      )) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);

    this.script = new Script(this);

    // this.time.addEvent({
    //   delay: 1000,
    //   loop: true,
    //   callback: () => {
    //     console.log("Bullets: ", this.playerShots.getLength());
    //   },
    // });
  }

  /**
   * Hides the cursor
   * See: https://stackoverflow.com/a/9834929/1308390
   * and: https://newdocs.phaser.io/docs/3.52.0/focus/Phaser.Input.InputPlugin-setDefaultCursor
   */
  hideCursor() {
    const embeddedUrl = `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2P4//8/IwAI/QL/+TZZdwAAAABJRU5ErkJggg==')`;
    const hostedUrl = `url(assets/blank.cur)`;
    const fallback = `none`;
    this.input.setDefaultCursor(`${embeddedUrl}, ${hostedUrl}, ${fallback}`);
  }
  showCursor() {
    this.input.setDefaultCursor("auto");
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
