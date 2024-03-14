import { motion } from "framer-motion";
import Opgg from "../../assets/images/opgg.png";
import { useLobbyStatus } from "../hooks/useLobbyStatus";
import { pageVariants } from "../app";
import { useChannelData } from "../hooks/useChannelData";
import { Player } from "../components/lobby-view/Player";
import { useCallback } from "react";

export const LobbyView = () => {
  useLobbyStatus();

  const gamemode = useChannelData<GameModePayload>({
    channel: "gamemode",
    defaultState: "Custom",
  });

  const participants = useChannelData<ParticipantsPayload>({
    channel: "participants",
    defaultState: [],
    shouldUpdate: useCallback((previousParticipats, newParticipats) => {
      if (previousParticipats.length !== newParticipats.length) return true;

      const gameTags1 = previousParticipats.map((item) => item.gameTag).sort();
      const gameTags2 = newParticipats.map((item) => item.gameTag).sort();

      for (let i = 0; i < gameTags1.length; i++) {
        if (gameTags1[i] !== gameTags2[i]) return true;
      }

      return false
    }, []),
  });


  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="flex flex-col h-full"
    >
      <div className="flex-none">
        <h2 className="text-xl text-white text-center my-2 md:text-2xl">
          {gamemode}
        </h2>
      </div>
      <div className="flex-grow flex flex-col justify-evenly gap-4 p-3">
        <div className="flex-grow space-y-4 overflow-auto">
          {participants.map(({ gameName, gameTag }, index) => (
            <Player
              key={index}
              nickname={`${gameName} #${gameTag}`}
              rank="---"
              winRatio={10}
              kda="---"
            />
          ))}
        </div>
        <div className="flex flex-row items-center justify-center gap-8">
          <button
            id="generateOPGGLinksBtn"
            className="w-12 h-12 flex justify-center items-center border border-white cursor-pointer bg-transparent hover:bg-gray-200 transition duration-150 ease-in-out"
            aria-label="Generate OP.GG Links"
          >
            <img src={Opgg} alt="OP.GG Icon" className="w-auto h-full" />
          </button>
          <button
            id="dodgeQueueBtn"
            className="w-12 h-12 bg-[#d9534f] text-white cursor-pointer font-serif text-md transition-colors duration-300 ease-in-out hover:bg-red-700"
          >
            Dodge
          </button>
        </div>
      </div>
    </motion.div>
  );
};
