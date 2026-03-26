import { GameClient } from "../network/GameClient";
import GameView from "./GameView";
import { Menu } from "./screens/menu/Menu";
import { useEffect, useState } from "react";
import { Room } from "./screens/room/Room";

type Screen = "menu" | "room" | "join" | "settings" | "game";

export default function Game() {
  const [gameClient, setGameClient] = useState<GameClient | null>(null);
  const [screen, setScreen] = useState<Screen>("menu");
  const [roomId, setRoomId] = useState<string>();
  const [isConnected, setIsConnected] = useState(false);

  // Initialize game client
  useEffect(() => {
    const client = new GameClient({
      onLeave: () => {
        setScreen("menu");
      },
      onPlayerLeft: (id: string) => {
        console.log(`Player ${id} left the room.`);
      },
      onStart: () => {
        setScreen("game");
      },
      onRoomCreated: (roomId) => {
        setRoomId(roomId);
        setScreen("room");
      },
      onConnected: () => {
        setIsConnected(true);
      },
      onRoomJoined: (roomId) => {
        setRoomId(roomId);
        setScreen("room");
      },
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGameClient(client);

    // return () => {
    //   client.disconnect?.();
    // };
  }, []);

  // Transform HMR updates into full reloads to reset game state
  // if (import.meta.hot) {
  //   import.meta.hot.accept(() => {
  //     window.location.reload();
  //   });
  // }

  if (!isConnected || !gameClient) return <>Loading</>;

  return (
    <>
      {screen === "menu" && (
        <Menu
          // status (joining - input + buttons, creating - loading effect)
          createRoom={() => gameClient.createRoom()}
          goToSettings={() => console.log("not yet")}
          joinRoom={(roomId) => gameClient.joinRoom(roomId)}
        />
      )}
      {screen === "room" && roomId && (
        <Room
          startGame={() => gameClient.startGame()}
          leaveRoom={() => gameClient.leaveRoom()}
          roomId={roomId}
        />
      )}
      {screen === "game" && <GameView gameClient={gameClient} />}
    </>
  );
}
