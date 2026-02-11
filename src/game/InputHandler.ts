// game/InputHandler.ts
export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export class InputHandler {
  private keys: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  getState(): InputState {
    return { ...this.keys };
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "w") this.keys.up = true;
    if (e.key === "s") this.keys.down = true;
    if (e.key === "a") this.keys.left = true;
    if (e.key === "d") this.keys.right = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "w") this.keys.up = false;
    if (e.key === "s") this.keys.down = false;
    if (e.key === "a") this.keys.left = false;
    if (e.key === "d") this.keys.right = false;
  };
}
