import type { PlayerDTO } from "../network/protocol";
import { Entity } from "./Entity";

interface PlayerConfig {
  id: string;
  x: number;
  y: number;
  angle?: number;
  life?: number;
  isAlive?: boolean;
}

export class Player extends Entity {
  id: string;
  angle: number;

  life: number;
  score = 0;

  constructor({ id, x, y, angle = 0, life = 5, isAlive = true }: PlayerConfig) {
    super("player", x, y, 20, isAlive);
    this.id = id;
    this.x = x;
    this.y = y;
    this.life = life;
    this.angle = angle;
  }

  updateFromDTO(dto: PlayerDTO) {
    this.x = dto.x;
    this.y = dto.y;
    this.angle = dto.angle;
    this.score = dto.score;
    this.life = dto.life;
    this.isAlive = dto.isAlive;
  }
}
