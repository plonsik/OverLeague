import { UPDATE_LOBBY_STATUS_LOOP_INTERVAL } from "../../main";
import { LCUArguments } from "../../utils/lcu";

type LobbyStatusLoopParams = {
  LCUArguments: LCUArguments;
};

type LobbyStatusLoop = NodeJS.Timeout | null;

export const startLobbyStatusUpdater = ({
  LCUArguments,
}: LobbyStatusLoopParams) => {
  let lobbyStatusIntervalId: LobbyStatusLoop = setInterval(() => {
    //
  }, UPDATE_LOBBY_STATUS_LOOP_INTERVAL);

  return lobbyStatusIntervalId;
};
