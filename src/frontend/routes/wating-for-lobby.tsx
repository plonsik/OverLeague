import { useEffect } from "react";

export const WaitingForLobby = () => {
  window.electronAPI.receive('lobby-status', console.log)
  useEffect(() => {
    
  }, []);

  return (
    <div className="flex flex-col h-full border-t-2 border-t-[#785a28] border-l border-l-[#1e282d]">
      <div className="h-[20%] text-[#cdfafa] flex justify-center items-center font-[Beaufort, serif]">
        <h2 className="text-3xl">OverLeague</h2>
      </div>

      <div
        id="waitingForLobby"
        className="flex flex-col justify-center gap-8 items-center h-full font-[Beaufort, serif] text-2xl text-white"
      >
        <div>
          <p>Waiting for lobby...</p>
          <div className="flex justify-center items-center h-full">
            <div className="w-2.5 h-2.5 bg-white rounded-full m-1 animate-[pulse_1s_infinite_0ms]" />
            <div className="w-2.5 h-2.5 bg-white rounded-full m-1 animate-[pulse_1s_infinite_200ms]" />
            <div className="w-2.5 h-2.5 bg-white rounded-full m-1 animate-[pulse_1s_infinite_400ms]" />
          </div>
        </div>
      </div>
    </div>
  );
};
