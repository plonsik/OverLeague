import {
  checkChampionSelectionSession,
  getGameMode,
  getLobbyParticipants,
} from "../../utils/league-lobby";
import { UPDATE_LOBBY_STATUS_LOOP_INTERVAL } from "../../main";
import { LCUArguments } from "../../utils/lcu";
import { BrowserWindow } from "electron";
import { sendToChannel } from "../../utils/channel";

type LobbyStatusLoopParams = {
  LCUArguments: LCUArguments;
  overlayWindow: BrowserWindow;
};

type LobbyStatusLoop = NodeJS.Timeout | null;

export const startLobbyStatusUpdater = ({
  LCUArguments,
  overlayWindow,
}: LobbyStatusLoopParams) => {
  let wasInChamionSelection = false;
  let gameMode: string | undefined = undefined;

  let lobbyStatusIntervalId: LobbyStatusLoop = setInterval(async () => {
    const isInChamionSelection = await checkChampionSelectionSession(
      LCUArguments
    );

    if (!isInChamionSelection && !wasInChamionSelection) return;
    if (!isInChamionSelection && wasInChamionSelection) {
      console.log("Is not in chamption selection");

      sendToChannel<LobbyStatusPayload>(overlayWindow, "lobby-status", false);

      wasInChamionSelection = false;

      return;
    }

    if (isInChamionSelection && !wasInChamionSelection) {
      console.log("Is in chamption selection");

      sendToChannel<LobbyStatusPayload>(overlayWindow, "lobby-status", true);
    }

    console.log("sending other data");

    //   gameMode = await getGameMode(LCUArguments);

    // const lobbyParticipants = await getLobbyParticipants(LCUArguments);

    wasInChamionSelection = true;
  }, UPDATE_LOBBY_STATUS_LOOP_INTERVAL);

  return lobbyStatusIntervalId;
};
