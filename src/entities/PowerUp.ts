import { Entity, type PowerUpType } from "./Entity";

type PowerUpConfig = { type: PowerUpType; x: number; y: number; size: number };

export class PowerUp extends Entity {
  public type: PowerUpType;

  constructor({ type, x, y, size }: PowerUpConfig) {
    super(type, x, y, size);
    this.type = type;
  }
}
