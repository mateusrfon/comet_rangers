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
    this.handleBoundaries();
  }

  private render() {
    this.renderer.clear();

    const positions = this.getRenderPositions(this.player);

    for (const pos of positions) {
      this.renderer.drawShip(pos.x, pos.y, this.player.angle, 20);
    }
  }

  private handleBoundaries() {
    const width = this.renderer.width;
    const height = this.renderer.height;

    this.player.x = (this.player.x + width) % width;
    this.player.y = (this.player.y + height) % height;
  }

  private getRenderPositions(player: Player) {
    const width = 800;
    const height = 600;

    const positions = [{ x: player.x, y: player.y }];

    const nearLeft = player.x < player.size;
    const nearRight = player.x > width - player.size;
    const nearTop = player.y < player.size;
    const nearBottom = player.y > height - player.size;

    if (nearLeft) positions.push({ x: player.x + width, y: player.y });

    if (nearRight) positions.push({ x: player.x - width, y: player.y });

    if (nearTop) positions.push({ x: player.x, y: player.y + height });

    if (nearBottom) positions.push({ x: player.x, y: player.y - height });

    // Diagonals
    if (nearLeft && nearTop)
      positions.push({ x: player.x + width, y: player.y + height });

    if (nearLeft && nearBottom)
      positions.push({ x: player.x + width, y: player.y - height });

    if (nearRight && nearTop)
      positions.push({ x: player.x - width, y: player.y + height });

    if (nearRight && nearBottom)
      positions.push({ x: player.x - width, y: player.y - height });

    return positions;
  }
}
