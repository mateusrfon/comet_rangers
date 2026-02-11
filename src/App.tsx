import { useEffect, useRef } from "react";
import { Engine } from "./game/Engine";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas);
    engine.start();

    return () => engine.stop();
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: "green" }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ backgroundColor: "white" }}
      />
    </div>
  );
}
