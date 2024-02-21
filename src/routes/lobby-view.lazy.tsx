import { createLazyFileRoute } from "@tanstack/react-router";
import Opgg from "../assets/opgg.png";

const Player = () => {
  return (
    <div className="flex flex-col h-1/5 justify-center gap-4 mt-4 p-2.5 border-b border-b-[#785a28] font-[Beaufort, serif]">
      <div className="flex justify-between items-center">
        <h4 className="text-[#f0e6d2] text-lg font-[Beaufort, serif]">
          Nigger
        </h4>
        <h5 className="text-[#e4dbc8]">---</h5>
      </div>
      <div className="flex justify-between items-center h-1/2">
        <h5 className="text-[#e4dbc8]">---</h5>
        <h5 className="text-[#e4dbc8]">---</h5>
      </div>
    </div>
  );
};

const LobbyView = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[5%]">
        <h2 className="text-xl text-red-600 text-center">Queue Type</h2>
      </div>
      <div className="h-[95%] gap-16 flex flex-col justify-between">
        <div className="h-[85%] mx-3.5">
          <Player />
          <Player />
          <Player />
          <Player />
          <Player />
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
