import { useState } from "react";
import styles from "../screen.module.css";

type RoomProps = {
  startGame: () => void;
  leaveRoom: () => void;
  roomId: string;
};

export const Room: React.FC<RoomProps> = ({ startGame, leaveRoom, roomId }) => {
  const [copyState, setCopyState] = useState("none");

  function getCopyButton() {
    switch (copyState) {
      case "none":
        return "Copy";
      case "copied":
        return "✅";
      case "error":
        return "❌";
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.menuBox}>
        <div style={{ display: "flex" }}>
          <h2 style={{ marginRight: "10px" }}>Room: {roomId}</h2>
          <button
            className={styles.button}
            onClick={() =>
              navigator.clipboard
                .writeText(roomId)
                .then(() => {
                  setCopyState("copied");
                })
                .catch(() => {
                  setCopyState("error");
                })
            }
          >
            {getCopyButton()}
          </button>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={startGame}>
            Start
          </button>

          <button className={styles.button} onClick={leaveRoom}>
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};
