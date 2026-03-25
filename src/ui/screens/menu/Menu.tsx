import { useState } from "react";
import styles from "../screen.module.css";

type MenuProps = {
  createRoom: () => void;
  goToSettings: () => void;
};

export const Menu: React.FC<MenuProps> = ({ createRoom, goToSettings }) => {
  const [join, setJoin] = useState(false);

  // =========================
  // HANDLERS (ligar depois)
  // =========================

  //   const handleCreateRoom = () => {
  //     // TODO:
  //     // Criar sala via websocket/backend
  //     // socket.emit("create-room")

  //     console.log("Criar sala");

  //     // Próxima tela (ex: waiting room)
  //     // setScreen("room")
  //   };

  //   const handleJoinRoom = () => {
  //     // TODO:
  //     // Entrar na sala via backend
  //     // socket.emit("join-room", roomCode)

  //     console.log("Entrar na sala:", roomCode);

  //     // Próxima tela
  //     // setScreen("room")
  //   };

  // =========================
  // RENDER
  // =========================

  return (
    <div className={styles.container}>
      <div className={styles.menuBox}>
        <h1 className={styles.title}>COMET RANGERS</h1>
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={() => createRoom()}>
            Create Room
          </button>

          {join ? (
            <input />
          ) : (
            <button className={styles.button} onClick={() => setJoin(true)}>
              Join Room
            </button>
          )}

          <button className={styles.button} onClick={() => goToSettings()}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};
