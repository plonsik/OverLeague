import "../styles/index.css";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ParticipantData } from "../../types";

const Index = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const handleLobbyStatus = (
  //     event: Electron.IpcRendererEvent,
  //     lobbyData: {
  //       queueDescription: string | null;
  //       participantsData: ParticipantData[];
  //     } | null,
  //   ) => {
  //     console.log(lobbyData);
  //     if (lobbyData !== null) {
  //       // @ts-ignore
  //       navigate({ to: "lobby-view", state: { lobbyData } });
  //     } else {
  //     }
  //   };

  //   const unsubscribe = window.electronAPI.receive(
  //     "lobby-status",
  //     handleLobbyStatus,
  //   );

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [navigate]);

  return (
    <div
      id="waitingForLobby"
      className="flex flex-col justify-center gap-8 items-center h-full font-[Beaufort, serif] text-2xl text-white"
    >
      <div>
        <p>Waiting for lobby...</p>
        <div className="flex justify-center items-center h-full">
          <div
            className="w-2.5 h-2.5 bg-white rounded-full m-1 animate-dotFlashing"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2.5 h-2.5 bg-white rounded-full m-1 animate-dotFlashing"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2.5 h-2.5 bg-white rounded-full m-1 animate-dotFlashing"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
