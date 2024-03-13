import { BrowserWindow } from "electron";
import {
  getLeagueWindowDimensions,
  getLeagueWindowHWND,
} from "../../utils/league-window";
import { MAIN_LOOP_INTERVAL } from "../../main";
import { startOverlayPostionUpdater } from "./overlay-position-updater";
import { getLCUArguments, getLCUCmd } from "../../utils/lcu";

export const startLeagueWindowListener = (overlayWindow: BrowserWindow) => {
  let leagueWindowHWND: number | null | undefined;
  let updateOverlayPositionInterval: NodeJS.Timeout | null = null;

  setInterval(async () => {
    leagueWindowHWND = getLeagueWindowHWND();
    const LCUCmd = await getLCUCmd();

    if (!leagueWindowHWND || !LCUCmd) {
      if (overlayWindow.isVisible()) overlayWindow.hide();
      if (updateOverlayPositionInterval) {
        clearInterval(updateOverlayPositionInterval);
        updateOverlayPositionInterval = null;
      }

      return;
    }

    if (updateOverlayPositionInterval) return;

    updateOverlayPositionInterval = startOverlayPostionUpdater({
      overlayWindow,
      leagueWindowHWND,
    });

    console.log(await getLCUArguments(LCUCmd));
  }, MAIN_LOOP_INTERVAL);
};
