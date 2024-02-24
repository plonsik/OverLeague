type PlayerProps = {
  nickname: string;
  rank: string;
  winRatio: string;
  kda: string;
};

export const Player = ({ nickname, rank, winRatio, kda }: PlayerProps) => {
  return (
    <div className="flex flex-col h-1/5 justify-center gap-4 mt-4 p-2.5 border-b border-b-[#785a28] font-[Beaufort, serif]">
      <div className="flex justify-between items-center">
        <h4 className="text-[#f0e6d2] text-lg font-[Beaufort, serif]">
          {nickname}
        </h4>
        <h5 className="text-[#e4dbc8]">{rank}</h5>
      </div>
      <div className="flex justify-between items-center h-1/2">
        <h5 className="text-[#e4dbc8]">{winRatio} %</h5>
        <h5 className="text-[#e4dbc8]">{kda}</h5>
      </div>
    </div>
  );
};