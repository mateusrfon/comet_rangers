import { Bullet } from "../entities/Bullet";
import type { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { GameState } from "../GameState";
import { InputHandler } from "../InputHandler";
import { Renderer } from "../Renderer";

export class Engine {
  private lastTime = 0;
  private accumulator = 0;
  private readonly tickRate = 1 / 60; // 60 FPS

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
      shoot: "Shift",
    });

    this.inputHandler.addPlayer(2, {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      shoot: "b",
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
    const delta = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    this.accumulator += delta;

    while (this.accumulator >= this.tickRate) {
      this.update(this.tickRate);
      this.accumulator -= this.tickRate;
    }

    this.renderer.render(this.gameState);

    requestAnimationFrame(this.loop);
  };

  private update(delta: number) {
    for (const player of this.gameState.players) {
      const inputState = this.inputHandler.getState(player.id);
      const { shoot } = player.update({ delta, input: inputState });

      if (shoot) {
        const bullet = new Bullet(
          player.x,
          player.y,
          player.velocityX,
          player.velocityY,
          player.angle,
          10,
        );
        this.gameState.bullets.push(bullet);
      }

      this.handleBoundaries(player);
    }

    this.gameState.bullets = this.gameState.bullets.filter((b) => b.alive);
    for (const bullet of this.gameState.bullets) {
      bullet.update({ delta });
      this.handleBoundaries(bullet);
    }
  }

  private handleBoundaries(entity: Entity) {
    const width = this.renderer.width;
    const height = this.renderer.height;

    entity.x = (entity.x + width) % width;
    entity.y = (entity.y + height) % height;
  }
}
