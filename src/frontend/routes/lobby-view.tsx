import Opgg from "../../assets/images/opgg.png";

export const LobbyView = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <h2 className="text-xl text-white text-center my-2 md:text-2xl">
          {/* {queueType} */}
        </h2>
      </div>
      <div className="flex-grow flex flex-col justify-evenly gap-4 p-3">
        <div className="flex-grow space-y-4 overflow-auto">
          {/* {participants.map((participant, index) => (
            <Player
              key={index}
              nickname={`${participant[0]} #${participant[1]}`}
              rank="---"
              winRatio="---"
              kda="---"
            />
          ))} */}
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
    </div>
  );
};