import { createRoot } from "react-dom/client";
import { GameWrapper } from "./ui/GameWrapper";
import Game from "./ui";
import "./index.css";

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

createRoot(document.getElementById("root")!).render(
  <GameWrapper>
    <Game />
  </GameWrapper>,
);
