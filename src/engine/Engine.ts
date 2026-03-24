import { GameState } from "../game/GameState";
import type { InputHandler } from "../game/InputHandler";
import { Renderer } from "../game/Renderer";
import type { GameClient } from "../network/GameClient";
import type { GameStateDTO } from "../network/protocol";

export class Engine {
  private tick = 0;
  private lastTime = 0;
  private accumulator = 0;
  private readonly tickRate = 1 / 60; // 60 FPS

  public gameState = new GameState();
  private running = false;

  constructor(
    private renderer: Renderer,
    private inputHandler: InputHandler,
    private gameClient: GameClient,
  ) {
    this.gameClient.onState((state: GameStateDTO) => {
      this.gameState.applySnapshot(state);
    });
  }

  public setLastTime(time: number) {
    this.lastTime = time;
  }

  public getLastTime() {
    return this.lastTime;
  }

  private timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  private async waitForConnection() {
    while (!this.gameClient.isReady()) {
      console.log("Waiting for server...");
      await this.timeout(500);
    }
  }

  async init() {
    await this.waitForConnection();

    this.inputHandler.addPlayer(this.gameClient.userId!, {
      up: "w",
      down: "s",
      left: "a",
      right: "d",
      shoot: "shift",
    });
    this.inputHandler.start();
    this.gameClient.createRoom();
    this.gameClient.startGame();
  }

  async start() {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
  }

  private loop = (currentTime: number) => {
    if (!this.running) return;

    if (!this.lastTime) this.lastTime = currentTime;
    const delta = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    this.accumulator += delta;

    while (this.accumulator >= this.tickRate) {
      this.tick++;
      const input = this.inputHandler.getState(this.gameClient.userId!);
      this.gameClient.sendInput(input);
      this.accumulator -= this.tickRate;
    }

    this.renderer.render(this.gameState);

    requestAnimationFrame(this.loop);
  };
}
