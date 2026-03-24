import { useEffect, useRef } from "react";
import { Engine } from "./engine/Engine";
import { GameClient } from "./network/GameClient";
import { InputHandler } from "./game/InputHandler";
import { Renderer } from "./game/Renderer";
import "./index.css";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);

  function resizeCanvas(canvas: HTMLCanvasElement) {
    const aspect = canvas.width / canvas.height;

    let width = window.innerWidth;
    let height = window.innerHeight;

    if (width / height > aspect) {
      width = height * aspect;
    } else {
      height = width / aspect;
    }

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
  }

  // Adjust canvas size when window is resized
  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => resizeCanvas(canvas);

    resize();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Initialize engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    engineRef.current = new Engine(
      new Renderer(canvas),
      new InputHandler(),
      new GameClient(),
    );

    engineRef.current.init().then(() => {
      engineRef.current?.start();
    });

    const visibilityHandler = () => {
      if (!engineRef.current) return;

      if (document.hidden) {
        engineRef.current.stop();
      } else {
        engineRef.current.start();
      }
    };

    document.addEventListener("visibilitychange", visibilityHandler);

    engineRef.current.start();

    return () => engineRef.current?.stop();
  }, []);

  // Transform HMR updates into full reloads to reset game state
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      window.location.reload();
    });
  }

  // todo:
  // react menu (create room, join room, start, leave)
  // static ui (score, lives, etc.)
  // gameover screen

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      style={{ backgroundColor: "white" }}
    />
  );
}
