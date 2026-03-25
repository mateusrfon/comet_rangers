import { Asteroid } from "../entities/Asteroid";
import { Bullet } from "../entities/Bullet";
import { Player } from "../entities/Player";
import type { GameStateDTO } from "../network/protocol";

export class GameState {
  tick: number = 0;
  players: Map<string, Player> = new Map();
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];
  level: number = 0;

  applySnapshot(dto: GameStateDTO): void {
    this.tick = dto.tick;

    for (const p of dto.players) {
      let player = this.players.get(p.id);

      if (!player) {
        player = new Player({
          id: p.id,
          x: p.x,
          y: p.y,
          angle: p.angle,
        });
        this.players.set(p.id, player);
        continue;
      }

      player.updateFromDTO(p);
    }

    this.asteroids = dto.asteroids.map((a) => {
      return new Asteroid({ x: a.x, y: a.y, size: a.size });
    });

    this.bullets = dto.bullets.map((b) => {
      return new Bullet({ ...b });
    });
  }
}
