import { Scene } from "phaser";
import { Player } from "../objects/Player";
import { SimpleShotEmitter } from "../objects/ShotEmitter";

export class Game extends Scene {
  player: Player;
  enemyShots: Phaser.GameObjects.Group;
  constructor() {
    super("Game");
  }

  create() {
    // this.add.image(512, 384, "background");
    // this.add.image(512, 350, "logo").setDepth(100);
    this.add
      .text(0, 0, "Game", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0)
      .setDepth(100);

    this.hideCursor();

    document.getElementById(this.game.config.parent)!.classList.add("playing");

    this.player = new Player(this, 100, 100);
    this.enemyShots = this.add.group({
      runChildUpdate: true,
    });

    const enemy = this.physics.add.sprite(100, 100, "enemy");
    enemy.setOrigin(0.5);

    const testEmitter = new SimpleShotEmitter(this, enemy);
    testEmitter.start();
    this.add.existing(testEmitter);
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
    this.input.setDefaultCursor(
      `${embeddedUrl}, ${hostedUrl}, ${fallback} !important`
    );
  }
}
