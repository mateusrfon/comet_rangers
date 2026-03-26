import { useState } from "react";
import styles from "../screen.module.css";

type MenuProps = {
  createRoom: () => void;
  goToSettings: () => void;
  joinRoom: (roomId: string) => void;
};

export const Menu: React.FC<MenuProps> = ({
  createRoom,
  goToSettings,
  joinRoom,
}) => {
  const [join, setJoin] = useState(false);
  const [roomId, setRoomId] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.menuBox}>
        <h1 className={styles.title}>COMET RANGERS</h1>
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={() => createRoom()}>
            Create Room
          </button>

          {join ? (
            <>
              {/* <div className={styles.buttonGroup}> */}
              <input
                className={styles.input}
                onChange={(event) => setRoomId(event.target.value)}
              />
              <button
                className={styles.button}
                onClick={() => joinRoom(roomId)}
              >
                Confirm
              </button>
              <button className={styles.button} onClick={() => setJoin(false)}>
                Cancel
              </button>
              {/* </div> */}
            </>
          ) : (
            <button className={styles.button} onClick={() => setJoin(true)}>
              Join Room
            </button>
          )}

          <button
            className={styles.button}
            disabled={true}
            onClick={() => goToSettings()}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};
