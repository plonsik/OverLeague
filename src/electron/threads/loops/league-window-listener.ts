import { BrowserWindow } from "electron";
import { getLeagueWindowHWND } from "../../utils/league-window";
import { MAIN_LOOP_INTERVAL } from "../../main";
import { startOverlayPostionUpdater } from "./overlay-position-updater";
import { getLCUArguments, getLCUCmd } from "../../utils/lcu";
import { startLobbyStatusUpdater } from "./lobby-status-updater";
import axios from "axios";

export const startLeagueWindowListener = (overlayWindow: BrowserWindow) => {
  let leagueWindowHWND: number | null | undefined;

  let updateOverlayPositionInterval: NodeJS.Timeout | null = null;
  let lobbyStatusInterval: NodeJS.Timeout | null = null;

  setInterval(async () => {
    leagueWindowHWND = getLeagueWindowHWND();
    const LCUCmd = await getLCUCmd();

    if (!leagueWindowHWND || !LCUCmd) {
      if (overlayWindow.isVisible()) overlayWindow.hide();
      if (updateOverlayPositionInterval) {
        clearInterval(updateOverlayPositionInterval);
        clearInterval(lobbyStatusInterval);

        updateOverlayPositionInterval = null;
        lobbyStatusInterval = null;
      }

      return;
    }

    if (updateOverlayPositionInterval) return;

    updateOverlayPositionInterval = startOverlayPostionUpdater({
      overlayWindow,
      leagueWindowHWND,
      lobbyStatusInterval,
    });

    const LCUArguments = await getLCUArguments(LCUCmd);

    lobbyStatusInterval = startLobbyStatusUpdater({
      LCUArguments,
      overlayWindow
    });
  }, MAIN_LOOP_INTERVAL);
};
