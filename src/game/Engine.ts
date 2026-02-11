import { Player } from "./entities/Player";
import { InputHandler } from "./InputHandler";
import { Renderer } from "./Renderer";

export class Engine {
  private lastTime = 0;
  private accumulator = 0;
  private readonly tickRate = 1000 / 60; // 60 FPS

  private renderer: Renderer;
  private player: Player;
  private input: InputHandler;
  private running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.player = new Player(100, 100);
    this.input = new InputHandler();
  }

  start() {
    this.running = true;
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
  }

  private loop = (currentTime: number) => {
    if (!this.running) return;

    if (!this.lastTime) this.lastTime = currentTime;
    const delta = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += delta;

    while (this.accumulator >= this.tickRate) {
      this.update();
      this.accumulator -= this.tickRate;
    }

    this.render();

    requestAnimationFrame(this.loop);
  };

  private update() {
    this.player.update(this.input.getState());
  }

  private render() {
    this.renderer.clear();
    // this.renderer.drawCircle(this.player.x, this.player.y, this.player.size);
    this.renderer.drawShip(
      this.player.x,
      this.player.y,
      this.player.angle,
      this.player.size,
    );
  }
}
