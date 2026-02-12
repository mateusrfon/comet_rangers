import { Player } from "../entities/Player";
import { GameState } from "../GameState";
import { InputHandler } from "../InputHandler";
import { Renderer } from "../Renderer";

export class Engine {
  private lastTime = 0;
  private accumulator = 0;
  private readonly tickRate = 1000 / 60; // 60 FPS

  private renderer: Renderer;
  private gameState = new GameState();
  private inputHandler = new InputHandler();
  private running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.gameState.players.push(new Player({ id: 1, x: 100, y: 100 }));
    this.gameState.players.push(
      new Player({
        id: 2,
        x: this.renderer.width - 100,
        y: this.renderer.height - 100,
        angle: 180 * (Math.PI / 180),
      }),
    );
    this.inputHandler.addPlayer(1, {
      up: "w",
      down: "s",
      left: "a",
      right: "d",
    });

    this.inputHandler.addPlayer(2, {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
    });
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

    this.renderer.render(this.gameState);

    requestAnimationFrame(this.loop);
  };

  private update() {
    for (const player of this.gameState.players) {
      player.update(this.inputHandler.getState(player.id));
      this.handleBoundaries(player);
    }
  }

  private handleBoundaries(player: Player) {
    const width = this.renderer.width;
    const height = this.renderer.height;

    player.x = (player.x + width) % width;
    player.y = (player.y + height) % height;
  }
}
