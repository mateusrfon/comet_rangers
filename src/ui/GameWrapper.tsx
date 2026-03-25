import { useEffect, useState, type ReactNode } from "react";
import { GAME_HEIGHT, GAME_WIDTH } from "../main";

type GameWrapperProps = {
  children: ReactNode;
};

export const GameWrapper = ({ children }: GameWrapperProps) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / GAME_WIDTH;
      const scaleY = window.innerHeight / GAME_HEIGHT;

      // mantém proporção
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const styles = {
    viewport: {
      width: "100vw",
      height: "100vh",
      backgroundColor: "black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
  };

  return (
    <div style={styles.viewport}>
      <div
        style={{
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
          transformOrigin: "center center",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(-50%, -50%) scale(${scale})`,
          left: "50%",
          top: "50%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
