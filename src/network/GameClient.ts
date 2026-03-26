import type { InputState } from "../engine/InputHandler";
import {
  decodeMessage,
  encodeMessage,
  type ClientMessage,
  type GameStateDTO,
} from "./protocol";

export class GameClient {
  private onStateCallback?: (state: GameStateDTO) => void;
  private onLeave: () => void;
  private onPlayerLeft: (id: string) => void;
  private onStart: () => void;
  private onRoomCreated: (roomId: string) => void;
  private onRoomJoined: (roomId: string) => void;
  private onConnected: () => void;
  private ws: WebSocket;
  public userId?: string | undefined;
  public roomId?: string | undefined;

  constructor({
    onLeave,
    onPlayerLeft,
    onStart,
    onRoomCreated,
    onRoomJoined,
    onConnected,
  }: {
    onLeave: () => void;
    onPlayerLeft: (id: string) => void;
    onStart: () => void;
    onRoomCreated: (roomId: string) => void;
    onRoomJoined: (roomId: string) => void;
    onConnected: () => void;
  }) {
    this.onLeave = onLeave;
    this.onPlayerLeft = onPlayerLeft;
    this.onStart = onStart;
    this.onRoomCreated = onRoomCreated;
    this.onRoomJoined = onRoomJoined;
    this.onConnected = onConnected;

    this.ws = new WebSocket(`ws://localhost:8080`);

    this.setupWS();
  }

  private setupWS() {
    this.ws.onopen = () => {
      console.log(`WebSocket connection opened`);
    };

    this.ws.onmessage = (event) => {
      const data = event.data;
      const msg = decodeMessage(data);

      if (!msg || !msg.type) return;

      switch (msg?.type) {
        case "user_connected":
          console.log(`Connected to server as: ${msg.userId}`);
          this.userId = msg.userId;
          this.onConnected();
          break;
        case "room_created":
          this.onRoomCreated(msg.roomId);
          break;
        case "room_joined":
          this.onRoomJoined(msg.roomId);
          break;
        case "room_left":
          this.onLeave();
          break;
        case "player_left":
          this.onPlayerLeft(msg.playerId);
          break;
        case "game_started":
          this.onStart();
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

    return () => {
      this.onStateCallback = undefined;
    };
  }

  public isReady() {
    return this.ws.readyState === WebSocket.OPEN;
  }

  private send(data: ClientMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(encodeMessage(data));
    } else {
      throw new Error("Socket not open");
    }
  }

  public reconnect() {
    this.ws = new WebSocket(
      `ws://localhost:8080/?userId=${this.userId}&roomId=${this.roomId}`,
    );

    // set onmessage and onopen, move constructor to function and reuse here
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

  public joinRoom(roomId: string) {
    this.send({
      type: "join_room",
      roomId,
    });
  }

  public startGame() {
    this.send({
      type: "start_game",
    });
  }

  public leaveRoom() {
    this.send({
      type: "leave_room",
    });
  }
}
