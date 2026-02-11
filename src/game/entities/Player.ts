import type { InputState } from "../InputHandler";

export class Player {
  x: number;
  y: number;
  speed: number;
  size: number;

  constructor(x: number, y: number, speed = 1, size = 20) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
  }

  update(input: InputState) {
    if (input.up) this.y -= this.speed;
    if (input.down) this.y += this.speed;
    if (input.left) this.x -= this.speed;
    if (input.right) this.x += this.speed;
  }
}
