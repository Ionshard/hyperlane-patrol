import { Scene } from "phaser";

const TEXT_CONFIG = {
  fontFamily: "Arial Black",
  fontSize: 38,
  color: "#ffffff",
  stroke: "#000000",
  strokeThickness: 8,
  align: "center",
};

export class Win extends Scene {
  constructor() {
    super("Win");
  }

  create() {
    const width = Number(this.game.config.width);
    const height = Number(this.game.config.height);

    this.sound.add("select");
    this.sound.add("victory").play();

    this.add
      .text(width / 2, height / 2, "You Win!", TEXT_CONFIG)
      .setOrigin(0.5)
      .setDepth(100);

    this.add
      .text(width / 2, height - 100, "Restart", TEXT_CONFIG)
      .setOrigin(0.5)
      .setDepth(100)
      .setInteractive({
        useHandCursor: true,
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.sound.play("select");
        this.scene.start("Game");
      });
  }
}
