export type EntityType = "player" | "bullet" | "asteroid";

export abstract class Entity {
  readonly type: EntityType;
  x: number;
  y: number;
  size: number;
  isAlive = true;

  constructor(
    type: EntityType,
    x: number,
    y: number,
    size: number,
    isAlive: boolean = true,
  ) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = size;
    this.isAlive = isAlive;
  }
}
