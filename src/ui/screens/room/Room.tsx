import { useState } from "react";
import styles from "../screen.module.css";
import type { RoomInfo } from "../../../network/protocol";

type RoomProps = {
  startGame: () => void;
  leaveRoom: () => void;
  room: RoomInfo;
  userId: string;
};

export const Room: React.FC<RoomProps> = ({
  startGame,
  leaveRoom,
  room,
  userId,
}) => {
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
          <h2 style={{ marginRight: "10px" }}>Room: {room.id}</h2>
          <button
            className={styles.button}
            onClick={() =>
              navigator.clipboard
                .writeText(room.id)
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

        <ol>
          {room.players.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ol>

        <div className={styles.buttonGroup}>
          <button
            className={styles.button}
            onClick={startGame}
            disabled={room.hostId !== userId}
          >
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
