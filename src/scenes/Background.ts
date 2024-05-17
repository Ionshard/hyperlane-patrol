import { Scene } from "phaser";

const COLOR_CLASSES = ["blue", "yellow", "white", "red"] as const;
type ColorClass = (typeof COLOR_CLASSES)[number];

const POINTS = [4, 6, 7] as const; // 5 star points are cliche

export class Background extends Scene {
  width: number;
  height: number;
  stars: Phaser.GameObjects.Layer;

  constructor() {
    super("Background");
  }

  create() {
    this.scene.sendToBack(this);
    this.width = Number(this.game.config.width);
    this.height = Number(this.game.config.height);

    this.stars = this.add.layer().setDepth(-10);

    Array.from(Array(Phaser.Math.Between(10, 30))).forEach(() =>
      this.generateStar(Phaser.Math.Between(50, this.height))
    );

    this.time.delayedCall(Phaser.Math.Between(600, 3000), () => {
      this.generateStars();
    });
  }

  generateStars() {
    Array.from(Array(Phaser.Math.Between(1, 8))).forEach(() =>
      this.generateStar()
    );
    this.time.delayedCall(
      Phaser.Math.Between(600, 3000),
      this.generateStars,
      undefined,
      this
    );
  }

  generateColor(colorClass: ColorClass) {
    const amount = Phaser.Math.Between(100, 200);
    switch (colorClass) {
      case "white":
        return 0xffffff;
      case "blue":
        return Phaser.Display.Color.GetColor(amount, amount, 255);
      case "red":
        return Phaser.Display.Color.GetColor(255, amount, amount);
      case "yellow":
        return Phaser.Display.Color.GetColor(255, 255, amount);
    }
  }

  generateStar(initialY = 0) {
    const colorClass =
      COLOR_CLASSES[Phaser.Math.Between(0, COLOR_CLASSES.length)];

    const color = this.generateColor(colorClass);
    const points = POINTS[Phaser.Math.Between(0, POINTS.length)];
    // @ts-expect-error testing
    if (points === 5) console.log("Cliche Star Alert!");

    const star = new Phaser.GameObjects.Star(
      this,
      Phaser.Math.Between(0, this.width), //x
      Phaser.Math.Between(-55 + initialY, -5 + initialY), //y
      points, // # of Points
      Phaser.Math.Between(1, 2), // Inner Radius
      Phaser.Math.Between(4, 8), // Outer Radius
      color, // Fill
      Phaser.Math.FloatBetween(0.6, 1) // Alpha
    );
    star.rotation = Phaser.Math.Between(0, 90);
    this.stars.add(star);
    const tweens = this.tweens.addMultiple([
      {
        targets: star,
        alpha: {
          from: star.alpha,
          to: Math.max(star.alpha * Phaser.Math.FloatBetween(0.8, 1.2), 1),
        },
        ease: "Sine",
        duration: Phaser.Math.Between(250, 500),
        repeatDelay: Phaser.Math.Between(250, 500),
        repeat: -1,
      },
      {
        targets: star,
        scale: { from: 1, to: Phaser.Math.FloatBetween(0.8, 1) },
        duration: Phaser.Math.Between(500, 1000),
        repeat: -1,
        yoyo: true,
      },
      {
        targets: star,
        y: this.height + 10,
        duration: Phaser.Math.Between(10_000, 18_000),
        onComplete: () => {
          tweens.forEach((tween) => tween.isPlaying() && tween.stop());
          star.destroy();
        },
      },
    ]);
  }
}
