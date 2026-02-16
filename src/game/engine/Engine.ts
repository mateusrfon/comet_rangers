import { Asteroid } from "../entities/Asteroid";
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
    this.gameState.asteroids.push(new Asteroid(200, 150, 80, 10)); //80/10 40/30 20/90 10/270
    this.gameState.asteroids.push(new Asteroid(200, 150, 40, 30)); //80/10 40/30 20/90 10/270
    this.gameState.asteroids.push(new Asteroid(200, 150, 20, 90)); //80/10 40/30 20/90 10/270
    this.gameState.asteroids.push(new Asteroid(200, 150, 10, 270)); //80/10 40/30 20/90 10/270
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
      this.handleCollisions();
      this.cleanupEntities();
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
          player.vx,
          player.vy,
          player.angle,
          10,
        );
        this.gameState.bullets.push(bullet);
      }

      this.handleBoundaries(player);
    }

    for (const bullet of this.gameState.bullets) {
      bullet.update({ delta });
      this.handleBoundaries(bullet);
    }

    for (const asteroid of this.gameState.asteroids) {
      asteroid.update({ delta });
      this.handleBoundaries(asteroid);
    }
  }

  private cleanupEntities() {
    this.gameState.players = this.gameState.players.filter((p) => p.alive);
    this.gameState.bullets = this.gameState.bullets.filter((b) => b.alive);
    this.gameState.asteroids = this.gameState.asteroids.filter((a) => a.alive);
  }

  private handleBoundaries(entity: Entity) {
    const width = this.renderer.width;
    const height = this.renderer.height;

    entity.x = (entity.x + width) % width;
    entity.y = (entity.y + height) % height;
  }

  private handleCollisions() {
    // Check bullet-asteroid collisions
    for (const bullet of this.gameState.bullets) {
      for (const asteroid of this.gameState.asteroids) {
        if (
          this.entityDistanceToroidal(bullet, asteroid) <
          bullet.size + asteroid.size
        ) {
          bullet.alive = false;
          asteroid.alive = false;
        }
      }
    }

    // Check player-asteroid collisions
    for (const player of this.gameState.players) {
      for (const asteroid of this.gameState.asteroids) {
        if (
          this.circleVsPolygonCollision(
            asteroid.x,
            asteroid.y,
            asteroid.size,
            player.getWorldVertices(),
          )
        ) {
          player.alive = false;
          asteroid.alive = false;
        }
      }
    }
  }

  private entityDistanceToroidal(a: Entity, b: Entity): number {
    const width = this.renderer.width;
    const height = this.renderer.height;

    let dx = Math.abs(a.x - b.x);
    let dy = Math.abs(a.y - b.y);

    dx = Math.min(dx, width - dx);
    dy = Math.min(dy, height - dy);

    return Math.sqrt(dx * dx + dy * dy);
  }

  private closestPointOnSegment(
    px: number,
    py: number, // Circle position
    ax: number,
    ay: number, // Segment start
    bx: number,
    by: number, // Segment end
  ) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;

    const abLenSq = abx * abx + aby * aby;
    const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLenSq));

    return {
      x: ax + abx * t,
      y: ay + aby * t,
    };
  }

  private circleVsPolygonCollision(
    circleX: number,
    circleY: number,
    radius: number,
    vertices: { x: number; y: number }[],
  ): boolean {
    for (let i = 0; i < vertices.length; i++) {
      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % vertices.length];

      const closest = this.closestPointOnSegment(
        circleX,
        circleY,
        v1.x,
        v1.y,
        v2.x,
        v2.y,
      );

      const dx = circleX - closest.x;
      const dy = circleY - closest.y;

      if (dx * dx + dy * dy < radius * radius) {
        return true;
      }
    }

    return false;
  }
}
