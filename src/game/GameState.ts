import type { Asteroid } from "./entities/Asteroid";
import type { Bullet } from "./entities/Bullet";
import type { Player } from "./entities/Player";

export class GameState {
  players: Player[] = [];
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];
}
