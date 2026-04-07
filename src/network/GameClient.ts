import type { InputState } from "../engine/InputHandler";
import {
  decodeMessage,
  encodeMessage,
  type ClientMessage,
  type GameStateDTO,
  type RoomInfo,
} from "./protocol";

export class GameClient {
  private onStateCallback?: (state: GameStateDTO) => void;
  private onLeave: () => void;
  private onPlayerLeft: (room: RoomInfo) => void;
  private onPlayerJoined: (room: RoomInfo) => void;
  private onStart: () => void;
  private onRoomCreated: (room: RoomInfo) => void;
  private onRoomJoined: () => void;
  private onConnected: () => void;
  private ws: WebSocket;
  public userId?: string | undefined;
  public roomId?: string | undefined;

  constructor({
    onLeave,
    onPlayerLeft,
    onPlayerJoined,
    onStart,
    onRoomCreated,
    onRoomJoined,
    onConnected,
  }: {
    onLeave: () => void;
    onPlayerLeft: (room: RoomInfo) => void;
    onPlayerJoined: (room: RoomInfo) => void;
    onStart: () => void;
    onRoomCreated: (room: RoomInfo) => void;
    onRoomJoined: () => void;
    onConnected: () => void;
  }) {
    this.onLeave = onLeave;
    this.onPlayerLeft = onPlayerLeft;
    this.onPlayerJoined = onPlayerJoined;
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
      console.log(msg);

      switch (msg?.type) {
        case "user_connected":
          console.log(`Connected to server as: ${msg.data.userId}`);
          this.userId = msg.data.userId;
          this.onConnected();
          break;
        case "room_created":
          this.onRoomCreated(msg.data.room);
          break;
        case "room_joined":
          this.onRoomJoined();
          break;
        case "room_left":
          this.onLeave();
          break;
        case "player_joined":
          this.onPlayerJoined(msg.data.room);
          break;
        case "player_left":
          this.onPlayerLeft(msg.data.room);
          break;
        case "game_started":
          this.onStart();
          break;
        case "game_state":
          this.onStateCallback?.(msg.data.state);
          break;
        default:
          console.log(msg);
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
      data: { roomId },
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
