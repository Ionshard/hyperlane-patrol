import { Game } from "../scenes/Game";
import { Enemy } from "./Enemy";

const STEPS = ["START", "STAGE1", "STAGE2", "END"] as const;
type Step = (typeof STEPS)[number];

const TRANSITIONS: Record<Step, Step | null> = {
  // START: "STAGE2",
  START: "STAGE1",
  STAGE1: "STAGE2",
  STAGE2: "END",
  END: null,
} as const;

export class Script extends Phaser.Events.EventEmitter {
  scene: Game;
  sphereProbe: Enemy;
  width: number;
  height: number;
  private step: Step;
  constructor(scene: Game) {
    super();
    this.scene = scene;
    this.width = Number(this.scene.game.config.width);
    this.height = Number(this.scene.game.config.height);

    this.init();
  }

  init() {
    this.registerSteps();
    this.step = "START";
    this.emit(this.step);
  }

  registerSteps() {
    this.on("START", this.start, this);
    this.on("STAGE1", this.stage1, this);
    this.on("STAGE2", this.stage2, this);
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
    this.sphereProbe = new Enemy(this.scene, 0, -100);
    this.scene.enemies.add(this.sphereProbe);

    this.scene.tweens.addMultiple([
      {
        targets: this.sphereProbe,
        x: this.width / 2,
        ease: "Quad.easeIn",
        duration: 1000,
      },
      {
        targets: this.sphereProbe,
        y: { from: -10, to: this.height * 0.25 },
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

    const chain = this.scene.tweens.chain({
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

    let nextStageTrigger = false;
    this.sphereProbe.on("HIT", () => {
      if (this.sphereProbe.hp === 50 && !nextStageTrigger) {
        blueEmitter.destroy();
        pinkEmitter.destroy();
        chain.stop();
        // this.scene.enemyShots.clear(true, true);
        this.scene.tweens.add({
          targets: this.sphereProbe,
          x: this.width / 2,
          y: this.height * 0.25,
          duration: 100,
          onComplete: () => this.nextStep(),
        });
        nextStageTrigger = true;
      }
    });
  }

  stage2() {
    const path = new Phaser.Curves.Path();
    path.add(
      new Phaser.Curves.Ellipse(
        this.sphereProbe.x,
        this.sphereProbe.y - 100,
        100,
        100,
        90,
        90 + 360
      )
    );
    const follower = { t: 0, vec: new Phaser.Math.Vector2() };
    const tween = this.scene.tweens.add({
      targets: follower,
      t: { from: 0, to: 1 },
      ease: "Sine.easeInOut",
      duration: 2000,
      repeat: -1,
    });
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
      path.getPoint(follower.t, follower.vec);
      this.sphereProbe.x = follower.vec.x;
      this.sphereProbe.y = follower.vec.y;
    });

    this.scene.add.shotEmitter({
      type: "ring",
      host: this.sphereProbe,
      shot: "blueShot",
      initialAngle: 0,
      bulletSpeed: 300,
      spawnRate: 1000,
      numberOfShots: 40,
      spinRate: 110,
      radius: 50,
      startDelay: 0,
    });
    this.scene.add.shotEmitter({
      type: "ring",
      host: this.sphereProbe,
      shot: "pinkShot",
      initialAngle: 0,
      bulletSpeed: 150,
      spawnRate: 400,
      numberOfShots: 20,
      spinRate: 180,
      radius: 50,
      startDelay: 0,
    });

    this.sphereProbe.on("DEATH", () => {
      tween.destroy();
      this.nextStep();
    });
  }

  end() {
    this.scene.scene.start("Win");
  }
}
