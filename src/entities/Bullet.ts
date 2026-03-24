import { Entity } from "./Entity";

export class Bullet extends Entity {
  constructor({ x, y }: { x: number; y: number }) {
    super("bullet", x, y, 2);
  }
}
