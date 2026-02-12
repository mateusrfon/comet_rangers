export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

interface InputConfig {
  up: string;
  down: string;
  left: string;
  right: string;
}

interface PlayerInput {
  [playerId: number]: { config: InputConfig; state: InputState };
}

export class InputHandler {
  inputs: PlayerInput = {};

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  getState(playerId: number): InputState {
    if (!this.inputs[playerId])
      return { up: false, down: false, left: false, right: false };
    return { ...this.inputs[playerId].state };
  }

  addPlayer(playerId: number, config: InputConfig) {
    this.inputs[playerId] = {
      config,
      state: { up: false, down: false, left: false, right: false },
    };
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    for (const playerId in this.inputs) {
      const { config } = this.inputs[playerId];
      if (e.key === config.up) this.inputs[playerId].state.up = true;
      if (e.key === config.down) this.inputs[playerId].state.down = true;
      if (e.key === config.left) this.inputs[playerId].state.left = true;
      if (e.key === config.right) this.inputs[playerId].state.right = true;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    for (const playerId in this.inputs) {
      const { config } = this.inputs[playerId];
      if (e.key === config.up) this.inputs[playerId].state.up = false;
      if (e.key === config.down) this.inputs[playerId].state.down = false;
      if (e.key === config.left) this.inputs[playerId].state.left = false;
      if (e.key === config.right) this.inputs[playerId].state.right = false;
    }
  };
}
