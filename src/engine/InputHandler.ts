export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
  powerUp: boolean;
}

interface InputConfig {
  up: string;
  down: string;
  left: string;
  right: string;
  shoot: string;
  powerUp: string;
}

type Actions = "up" | "down" | "left" | "right" | "shoot" | "powerUp";

interface PlayerInputState {
  [playerId: string]: InputState;
}

interface KeyMap {
  [key: string]: { playerId: string; action: Actions };
}

export class InputHandler {
  private inputStates: PlayerInputState = {};
  private keyMap: KeyMap = {};

  constructor() {}

  public start() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public stop() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  public getState(playerId: string): InputState {
    if (!this.inputStates[playerId]) {
      return {
        up: false,
        down: false,
        left: false,
        right: false,
        shoot: false,
        powerUp: false,
      };
    }
    return { ...this.inputStates[playerId] };
  }

  public addPlayer(playerId: string, config: InputConfig) {
    for (const element in config) {
      this.keyMap[config[element as Actions].toLowerCase()] = {
        playerId,
        action: element as Actions,
      };
    }
    this.inputStates[playerId] = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
      powerUp: false,
    };
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const mappedKey = this.keyMap[e.key.toLowerCase()];
    if (mappedKey) {
      this.inputStates[mappedKey.playerId][mappedKey.action] = true;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const mappedKey = this.keyMap[e.key.toLowerCase()];
    if (mappedKey) {
      this.inputStates[mappedKey.playerId][mappedKey.action] = false;
    }
  };
}
