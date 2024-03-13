import {
  checkChampionSelectionSession,
  getGameMode,
  getLobbyParticipants,
} from "../../utils/league-lobby";
import { UPDATE_LOBBY_STATUS_LOOP_INTERVAL } from "../../main";
import { LCUArguments } from "../../utils/lcu";
import { BrowserWindow } from "electron";

type LobbyStatusLoopParams = {
  LCUArguments: LCUArguments;
  overlayWindow: BrowserWindow
};

type LobbyStatusLoop = NodeJS.Timeout | null;

export const startLobbyStatusUpdater = ({
  LCUArguments,
  overlayWindow
}: LobbyStatusLoopParams) => {
  let isAlreadyInChamionSelection = false;
  let gameMode: string | undefined = undefined;

  let lobbyStatusIntervalId: LobbyStatusLoop = setInterval(async () => {
    const isInChamionSelection =
      await checkChampionSelectionSession(LCUArguments);

    if (!isInChamionSelection) {
      isAlreadyInChamionSelection = false;
      // TODO: Tell frontend that user is not in champion selection
      overlayWindow.webContents.send('lobby-status', "chuj")
      return;
    }

    if (!isAlreadyInChamionSelection) {
      isAlreadyInChamionSelection = true;

      gameMode = await getGameMode(LCUArguments);
    }

    const lobbyParticipants = await getLobbyParticipants(LCUArguments);
    overlayWindow.webContents.send('lobby-status', lobbyParticipants)
    console.log(JSON.stringify(lobbyParticipants));
  }, UPDATE_LOBBY_STATUS_LOOP_INTERVAL);

  return lobbyStatusIntervalId;
};
