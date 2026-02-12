import type { InputState } from "../InputHandler";

interface PlayerConfig {
  id: number;
  x: number;
  y: number;
  angle?: number;
}

export class Player {
  id: number;

  x: number;
  y: number;

  size = 20;

  angle: number;
  rotationSpeed = 0.05;

  velocityX = 0;
  velocityY = 0;

  acceleration = 0.2;
  friction = 0.99;

  constructor({ id, x, y, angle }: PlayerConfig) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle || 0;
  }

  update(input: InputState) {
    // Rotation
    if (input.left) this.angle -= this.rotationSpeed;
    if (input.right) this.angle += this.rotationSpeed;

    if (input.up) {
      this.velocityX += Math.cos(this.angle) * this.acceleration;
      this.velocityY += Math.sin(this.angle) * this.acceleration;
    }

    // Apply friction
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;

    // Update position based on velocity
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}
