import type { InputState } from "../InputHandler";

export class Player {
  x: number;
  y: number;

  size = 20;

  angle = 0;
  rotationSpeed = 0.05;

  velocityX = 0;
  velocityY = 0;

  acceleration = 0.2;
  friction = 0.99;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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
