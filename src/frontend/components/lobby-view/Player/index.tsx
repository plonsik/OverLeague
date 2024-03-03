import React from "react";

type PlayerProps = {
  nickname: string;
  rank: string;
  winRatio: number | string;
  kda: string;
};

export const Player: React.FC<PlayerProps> = ({
  nickname,
  rank,
  winRatio,
  kda,
}) => {
  return (
    <div className="flex flex-col justify-center gap-4 py-4 px-2 border-b border-b-[#785a28]">
      <div className="flex justify-between items-center">
        <h4 className="text-base md:text-lg text-[#f0e6d2]">{nickname}</h4>
        <h5
          className={`text-sm md:text-base ${
            winRatio >= 50 ? "text-green-500" : "text-red-500"
          }`}
        >
          WR: {winRatio}
        </h5>
      </div>
      <div className="flex justify-between items-center">
        <h5 className="text-sm md:text-base text-[#e4dbc8]">{rank}</h5>

        <h5 className="text-sm md:text-base text-[#e4dbc8]">KDA: {kda}</h5>
      </div>
    </div>
  );
};
