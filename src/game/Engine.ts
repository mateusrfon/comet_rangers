import { Player } from "./entities/Player";
import { InputHandler } from "./InputHandler";
import { Renderer } from "./Renderer";

export class Engine {
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
    this.loop();
  }

  stop() {
    this.running = false;
  }

  private loop = () => {
    if (!this.running) return;

    this.update();
    this.render(); // Stay at front-end

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
