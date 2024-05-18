import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    const width = Number(this.game.config.width);
    const height = Number(this.game.config.height);

    this.sound.add("select");
    this.sound.add("gameOver").play();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () =>
      this.sound.stopByKey("gameOver")
    );

    this.add
      .bitmapText(width / 2, height / 2, "OceanicDrift", "Game Over!", 38)
      .setOrigin(0.5)
      .setDepth(100);

    this.add
      .bitmapText(width / 2, height - 100, "OceanicDrift", "Restart?", 38)
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
