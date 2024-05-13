import { Scene } from "phaser";
import { Player } from "../objects/Player";
import { Enemy } from "../objects/Enemy";
import { Shot } from "../objects/Shot";

export class Game extends Scene {
  player: Player;
  playerShots: Phaser.GameObjects.Group;
  enemyShots: Phaser.GameObjects.Group;
  enemies: Phaser.GameObjects.Group;
  constructor() {
    super("Game");
  }

  create() {
    this.hideCursor();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => this.showCursor());

    this.player = new Player(this, 100, 100);
    this.playerShots = this.add.group({
      runChildUpdate: true,
    });

    this.enemies = this.add.group();

    this.enemyShots = this.add.group({
      runChildUpdate: true,
    });

    const enemy = new Enemy(this, 225, 400);

    this.enemies.add(enemy);

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
