export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
}

interface InputConfig {
  up: string;
  down: string;
  left: string;
  right: string;
  shoot: string;
}

type Actions = "up" | "down" | "left" | "right" | "shoot";

interface PlayerInputState {
  [playerId: number]: InputState;
}

interface KeyMap {
  [key: string]: { playerId: number; action: Actions };
}

export class InputHandler {
  inputStates: PlayerInputState = {};
  keyMap: KeyMap = {};

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  getState(playerId: number): InputState {
    if (!this.inputStates[playerId])
      return {
        up: false,
        down: false,
        left: false,
        right: false,
        shoot: false,
      };
    return { ...this.inputStates[playerId] };
  }

  addPlayer(playerId: number, config: InputConfig) {
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
