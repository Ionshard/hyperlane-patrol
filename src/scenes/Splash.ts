import { Scene } from "phaser";

export class Splash extends Scene {
  constructor() {
    super("Splash");
  }

  create() {
    const width = Number(this.game.config.width);
    const height = Number(this.game.config.height);
    this.sound.add("select");
    this.sound.add("menu").play({ volume: 0.3 });
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () =>
      this.sound.stopByKey("menu")
    );

    this.add
      .text(width / 2, height - 100, "Click Here to Start", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
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
