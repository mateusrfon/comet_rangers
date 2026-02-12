import { Entity } from "./Entity";

export class Bullet extends Entity {
  vx: number;
  vy: number;

  alive = true;
  lifetime = 2;

  constructor(x: number, y: number, angle: number, speed: number) {
    super(x, y, 2);

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update({ delta }: { delta: number }) {
    this.lifetime -= delta;
    if (this.lifetime <= 0) {
      this.alive = false;
      return;
    }

    this.x += this.vx * delta;
    this.y += this.vy * delta;
  }
}
