import { useEffect, useRef } from "react";
import { Engine } from "../engine/Engine";
import { GameClient } from "../network/GameClient";
import { InputHandler } from "../engine/InputHandler";
import { Renderer } from "../engine/Renderer";
import { GAME_HEIGHT, GAME_WIDTH } from "../main";

export default function GameView({ gameClient }: { gameClient: GameClient }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(
      new Renderer(canvas),
      new InputHandler(),
      gameClient,
    );

    engine.init().then(() => {
      engine.start();
    });

    const visibilityHandler = () => {
      if (!engine) return;

      if (document.hidden) {
        engine.stop();
      } else {
        engine.start();
      }
    };

    document.addEventListener("visibilitychange", visibilityHandler);

    return () => engine.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      style={{ backgroundColor: "white" }}
    />
  );
}
