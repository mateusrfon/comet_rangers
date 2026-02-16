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

  public angularVelocity = 0;

  private localVertices: { x: number; y: number }[];

  constructor({ id, x, y, angle, accel, rot }: PlayerConfig) {
    super("player", x, y, 20);
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle || 0;
    this.acceleration = accel || 0.1;
    this.rotationSpeed = rot || 0.05;
    this.localVertices = [
      { x: this.size, y: 0 }, // tip
      { x: -this.size, y: this.size / 1.5 }, // left
      { x: -this.size, y: -this.size / 1.5 }, // right
    ];
  }

  getWorldVertices() {
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);
    return this.localVertices.map((v) => ({
      x: this.x + v.x * cos - v.y * sin,
      y: this.y + v.x * sin + v.y * cos,
    }));
  }

  public applyImpulse(ix: number, iy: number, hitX: number, hitY: number) {
    // impulso linear
    this.vx += ix; // Should divide by mass if we had it, but we'll assume mass = 1 for simplicity
    this.vy += iy;

    // torque simplificado
    const rx = hitX - this.x;
    const ry = hitY - this.y;

    const torque = rx * iy - ry * ix;
    this.angularVelocity += torque * 0.001; // Fine adjustment factor for feel
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

    // Update angle based on angular velocity
    this.angle += this.angularVelocity;
    this.angularVelocity *= 0.98;

    if (input.shoot && this.currentShootCooldown <= 0) {
      response.shoot = true;
      this.currentShootCooldown = this.shootCooldown; // Reset cooldown
    }

    return response;
  }
}
