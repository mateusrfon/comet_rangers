import { Asteroid } from "../entities/Asteroid";
import { Bullet } from "../entities/Bullet";
import { Player } from "../entities/Player";
import { PowerUp } from "../entities/PowerUp";
import type { GameStateDTO } from "../network/protocol";

export class GameState {
  tick: number = 0;
  players: Map<string, Player> = new Map();
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];
  powerUps: PowerUp[] = [];
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
          shield: p.shield,
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

    this.powerUps = dto.powerUps.map((p) => {
      return new PowerUp({ ...p });
    });
  }
}
