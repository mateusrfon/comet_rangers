import type { InputState } from "../game/InputHandler";
import {
  decodeMessage,
  encodeMessage,
  type ClientMessage,
  type GameStateDTO,
} from "./protocol";

export class GameClient {
  private onStateCallback?: (state: GameStateDTO) => void;
  private ws: WebSocket;
  public userId?: string | undefined;
  public roomId?: string | undefined;

  constructor() {
    this.ws = new WebSocket(`ws://localhost:8080`);

    this.ws.onopen = () => {
      console.log(`WebSocket connection opened`);
    };

    this.ws.onmessage = (event) => {
      const data = event.data;
      const msg = decodeMessage(data);

      switch (msg?.type) {
        case "user_connected":
          console.log(`Connected to server as: ${msg.userId}`);
          this.userId = msg.userId;
          break;
        case "game_started":
          // set width and height of canvas here if possible to change resolution in the future
          break;
        case "game_state":
          this.onStateCallback?.(msg.state);
          break;
      }
    };

    this.ws.onerror = (err) => {
      console.error("ws error", err);
    };

    this.ws.onclose = () => {
      console.log("disconnected");
    };
  }

  public onState(cb: (state: GameStateDTO) => void) {
    this.onStateCallback = cb;
  }

  public isReady() {
    return this.ws.readyState === this.ws.OPEN;
  }

  private send(data: ClientMessage) {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      this.ws.send(encodeMessage(data));
    } else {
      console.log("Socket not open");
    }
  }

  public reconnect() {
    this.ws = new WebSocket(
      `ws://localhost:8080/?userId=${this.userId}&roomId=${this.roomId}`,
    );
  }

  public sendInput(input: InputState) {
    this.send({
      type: "input",
      ...input,
    });
  }

  public createRoom() {
    this.send({
      type: "create_room",
    });
  }

  public startGame() {
    this.send({
      type: "start_game",
    });
  }
}
