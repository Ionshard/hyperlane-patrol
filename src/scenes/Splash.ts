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
      .bitmapText(width / 2, height / 2, "OceanicDrift", "Game Name", 72)
      .setOrigin(0.5);

    this.add
      .bitmapText(
        width / 2,
        height - 100,
        "OceanicDrift",
        "Click Here to Start",
        38
      )
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
