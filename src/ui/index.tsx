import { GameClient } from "../network/GameClient";
import GameView from "./GameView";
import { Menu } from "./screens/menu/Menu";
import { useEffect, useState } from "react";
import { Room } from "./screens/room/Room";
import type { RoomInfo } from "../network/protocol";

type Screen = "menu" | "room" | "join" | "settings" | "game";

export default function Game() {
  const [gameClient, setGameClient] = useState<GameClient | null>(null);
  const [screen, setScreen] = useState<Screen>("menu");
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<RoomInfo>({
    id: "",
    hostId: "",
    players: [],
  });

  // Initialize game client
  useEffect(() => {
    const client = new GameClient({
      onLeave: () => {
        setScreen("menu");
      },
      onPlayerLeft: (room: RoomInfo) => {
        console.log(`Player left the room.`);
        setRoom(room);
      },
      onPlayerJoined: (room: RoomInfo) => {
        console.log(`Player joined the room.`);
        setRoom(room);
      },
      onStart: () => {
        setScreen("game");
      },
      onRoomCreated: (room: RoomInfo) => {
        setRoom(room);
        setScreen("room");
      },
      onConnected: () => {
        setIsConnected(true);
      },
      onRoomJoined: () => {
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

  if (!isConnected || !gameClient?.userId) return <>Loading</>;

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
      {screen === "room" && room.id && (
        <Room
          startGame={() => gameClient.startGame()}
          leaveRoom={() => gameClient.leaveRoom()}
          room={room}
          userId={gameClient.userId}
        />
      )}
      {screen === "game" && <GameView gameClient={gameClient} />}
    </>
  );
}
