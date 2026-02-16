import type { InputState } from "../InputHandler";
import { Entity } from "./Entity";

interface PlayerConfig {
  id: number;
  x: number;
  y: number;
  angle?: number;
  accel?: number;
  rot?: number;
}

export class Player extends Entity {
  id: number;

  angle: number;
  rotationSpeed: number;
  acceleration: number;

  friction = 0.99;

  shootCooldown = 0.1;
  currentShootCooldown = 0;

  constructor({ id, x, y, angle, accel, rot }: PlayerConfig) {
    super("player", x, y, 20);
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle || 0;
    this.acceleration = accel || 0.1;
    this.rotationSpeed = rot || 0.05;
  }

  update({ delta, input }: { delta: number; input: InputState }): {
    shoot: boolean;
  } {
    const response = {
      shoot: false,
    };

    this.currentShootCooldown -= delta;

    // Rotation
    if (input.left) this.angle -= this.rotationSpeed;
    if (input.right) this.angle += this.rotationSpeed;

    if (input.up) {
      this.vx += Math.cos(this.angle) * this.acceleration;
      this.vy += Math.sin(this.angle) * this.acceleration;
    }

    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Update position based on velocity
    this.x += this.vx;
    this.y += this.vy;

    if (input.shoot && this.currentShootCooldown <= 0) {
      response.shoot = true;
      this.currentShootCooldown = this.shootCooldown; // Reset cooldown
    }

    return response;
  }
}
