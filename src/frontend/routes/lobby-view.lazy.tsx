import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import Opgg from "../assets/images/opgg.png";
import { useEffect } from "react";
import { Player } from "../components/lobby-view/Player";

const LobbyView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let listenerFunc: { (): void; (): void };
    const handleLobbyStatus = (lobbyData: any) => {
      if (lobbyData === null) {
        navigate({ to: "/" });
      }
    };

    listenerFunc = window.electronAPI.receive(
      "lobby-status",
      handleLobbyStatus
    );

    return () => {
      if (listenerFunc) {
        window.electronAPI.removeListener("lobby-status", listenerFunc);
      }
    };
  }, [navigate]);

  return (
    <div className="h-full flex flex-col">
      <div className="h-[5%]">
        <h2 className="text-xl text-red-600 text-center">Queue Type</h2>
      </div>
      <div className="h-[95%] gap-16 flex flex-col justify-between">
        <div className="h-[85%] mx-3.5">
          <Player nickname={"PlayerOne"} rank={"Gold"} winRatio={"52%"} kda={"2.5"} />
          <Player nickname={"PlayerTwo"} rank={"Silver"} winRatio={"47%"} kda={"1.8"} />
          <Player nickname={"PlayerThree"} rank={"Platinum"} winRatio={"60%"} kda={"3.1"} />
          <Player nickname={"PlayerFour"} rank={"Bronze"} winRatio={"40%"} kda={"1.2"} />
          <Player nickname={"PlayerFive"} rank={"Diamond"} winRatio={"65%"} kda={"3.8"} />
        </div>

        <div className="h-[15%] flex flex-row items-center justify-center">
          <button
            id="generateOPGGLinksBtn"
            className="w-17.5 h-17.5 flex justify-center items-center border border-white m-5 cursor-pointer bg-none"
          >
            <img src={Opgg} className="h-16" />
          </button>
          <button
            id="dodgeQueueBtn"
            className="w-17.5 h-17.5 bg-[#d9534f] text-white cursor-pointer font-[Beaufort, serif] text-xl transition-colors duration-300 ease-in-out"
          >
            Dodge
          </button>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/lobby-view")({
  component: LobbyView,
});
