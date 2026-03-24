import { Entity } from "./Entity";

export class Asteroid extends Entity {
  constructor({ x, y, size }: { x: number; y: number; size: number }) {
    super("asteroid", x, y, size);
  }
}
