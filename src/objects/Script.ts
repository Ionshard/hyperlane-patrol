import { Game } from "../scenes/Game";
import { Enemy } from "./Enemy";

const STEPS = ["START", "STAGE1", "END"] as const;
type Step = (typeof STEPS)[number];

const TRANSITIONS: Record<Step, Step | null> = {
  START: "STAGE1",
  STAGE1: "END",
  END: null,
} as const;

export class Script extends Phaser.Events.EventEmitter {
  scene: Game;
  sphereProbe: Enemy;
  private step: Step;
  constructor(scene: Game) {
    super();
    this.scene = scene;
    this.registerSteps();
    this.step = "START";
    this.emit(this.step);
  }

  registerSteps() {
    this.on("START", this.start, this);
    this.on("STAGE1", this.stage1, this);
    this.on("END", this.end, this);
  }

  nextStep() {
    this.emit("STAGE_END");

    const nextStep = TRANSITIONS[this.step];
    if (!nextStep) return;

    this.step = nextStep;
    this.emit(nextStep);
  }

  start() {
    const width = Number(this.scene.game.config.width);
    const height = Number(this.scene.game.config.height);

    this.sphereProbe = new Enemy(this.scene, 0, -100);
    this.scene.enemies.add(this.sphereProbe);

    this.scene.tweens.addMultiple([
      {
        targets: this.sphereProbe,
        x: width / 2,
        ease: "Quad.easeIn",
        duration: 1000,
      },
      {
        targets: this.sphereProbe,
        y: { from: -10, to: height * 0.25 },
        duration: 1000,
        onComplete: () => this.nextStep(),
      },
    ]);
  }

  stage1() {
    const blueEmitter = this.scene.add.shotEmitter({
      type: "ring",
      host: this.sphereProbe,
      shot: "blueShot",
      initialAngle: 0,
      bulletSpeed: 150,
      spawnRate: 500,
      numberOfShots: 22,
      spinRate: 25,
      radius: 50,
      startDelay: 0,
    });
    const pinkEmitter = this.scene.add.shotEmitter({
      type: "ring",
      host: this.sphereProbe,
      shot: "pinkShot",
      initialAngle: Math.PI,
      bulletSpeed: 150,
      spawnRate: 500,
      numberOfShots: 11,
      spinRate: -25,
      radius: 50,
      startDelay: 250,
    });

    this.scene.tweens.chain({
      tweens: [
        {
          targets: this.sphereProbe,
          x: 300,
          duration: 1500,
        },
        {
          targets: this.sphereProbe,
          x: { from: 300, to: 100 },
          duration: 3000,
          yoyo: true,
          repeat: -1,
        },
      ],
    });
  }

  end() {}
}
