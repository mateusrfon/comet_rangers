import { Entity } from "./Entity";

export class Bullet extends Entity {
  vx: number;
  vy: number;

  alive = true;
  lifetime = 2;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    angle: number,
    speed: number,
  ) {
    super(x, y, 2);

    this.vx = vx * 0.5 + Math.cos(angle) * speed;
    this.vy = vy * 0.5 + Math.sin(angle) * speed;
  }

  update({ delta }: { delta: number }) {
    this.lifetime -= delta;
    if (this.lifetime <= 0) {
      this.alive = false;
      return;
    }

    this.x += this.vx;
    this.y += this.vy;
  }
}
