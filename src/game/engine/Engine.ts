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
        const playerTip = player.getWorldVertices()[0];
        const bullet = new Bullet(
          player.id,
          playerTip.x,
          playerTip.y,
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

    for (const player of this.gameState.players) {
      const playerVertices = player.getWorldVertices();
      // Check player-asteroid collisions
      for (const asteroid of this.gameState.asteroids) {
        if (
          this.circleVsPolygonCollision(
            asteroid.x,
            asteroid.y,
            asteroid.size,
            playerVertices,
          )
        ) {
          player.alive = false;
          asteroid.alive = false;
        }
      }
      // Check player-bullet collisions
      for (const bullet of this.gameState.bullets) {
        if (bullet.ownerId === player.id) continue; // Skip self-collisions
        for (let i = 0; i < playerVertices.length; i++) {
          const v1 = playerVertices[i];
          const v2 = playerVertices[(i + 1) % playerVertices.length];
          const intersection = this.segmentIntersect(
            bullet.prevX,
            bullet.prevY,
            bullet.x,
            bullet.y,
            v1.x,
            v1.y,
            v2.x,
            v2.y,
          );
          if (intersection) {
            bullet.alive = false;

            const dirX = bullet.vx;
            const dirY = bullet.vy;

            const force = 0.5;
            const impulseX = dirX * force;
            const impulseY = dirY * force;

            player.applyImpulse(
              impulseX,
              impulseY,
              intersection.hitX,
              intersection.hitY,
            );
            break;
          }
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
    py: number, // Point position
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
  ): { dx: number; dy: number; distance: number } | null {
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

      const distanceSq = dx * dx + dy * dy;

      if (distanceSq < radius * radius) {
        return { dx, dy, distance: Math.sqrt(distanceSq) };
      }
    }

    return null;
  }

  private segmentIntersect(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
  ): { hitX: number; hitY: number; distance: number } | null {
    const width = this.renderer.width;
    const height = this.renderer.height;

    const d1x = x2 - x1;
    const d1y = y2 - y1;

    let closestHit = null;

    const offsets = [-1, 0, 1];

    for (const ox of offsets) {
      for (const oy of offsets) {
        const ax3 = x3 + ox * width;
        const ay3 = y3 + oy * height;
        const ax4 = x4 + ox * width;
        const ay4 = y4 + oy * height;

        const d2x = ax4 - ax3;
        const d2y = ay4 - ay3;

        const denom = d1x * d2y - d1y * d2x;

        if (denom === 0) continue;

        const dx = ax3 - x1;
        const dy = ay3 - y1;

        const t = (dx * d2y - dy * d2x) / denom;
        const u = (dx * d1y - dy * d1x) / denom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          const hitX = x1 + t * d1x;
          const hitY = y1 + t * d1y;

          const distSq = (hitX - x1) * (hitX - x1) + (hitY - y1) * (hitY - y1);

          if (!closestHit || distSq < closestHit.distance) {
            closestHit = {
              x: hitX,
              y: hitY,
              distance: distSq,
            };
          }
        }
      }
    }

    if (!closestHit) {
      return null;
    }

    return {
      hitX: closestHit.x,
      hitY: closestHit.y,
      distance: Math.sqrt(closestHit.distance),
    };
  }
}
