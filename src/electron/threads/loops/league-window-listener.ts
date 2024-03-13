import { BrowserWindow } from "electron";
import {
  getLeagueWindowDimensions,
  getLeagueWindowHWND,
  leagueWindowDimensionsRect,
} from "../../utils/league-window";
import { MAIN_LOOP_INTERVAL } from "../../main";
import { startOverlayPostionUpdater } from "./overlay-position-updater";

export const startLeagueWindowListener = (overlayWindow: BrowserWindow) => {
  let leagueWindowHWND: number | null | undefined;
  let updateOverlayPositionInterval: NodeJS.Timeout | null = null;

  setInterval(() => {
    console.log("Main loop");
    leagueWindowHWND = getLeagueWindowHWND();

    console.log(leagueWindowHWND)

    if (leagueWindowHWND) {
      const isLeagueWindowDimensionsAvailable = getLeagueWindowDimensions(
        leagueWindowHWND,
        leagueWindowDimensionsRect
      );

      if (!isLeagueWindowDimensionsAvailable) {
        overlayWindow.hide();
      }

      console.log(updateOverlayPositionInterval)

      if (!updateOverlayPositionInterval) {
        if (!overlayWindow.isVisible()) {
          overlayWindow.show();
        }

        updateOverlayPositionInterval = startOverlayPostionUpdater({
          overlayWindow,
          leagueWindowHWND,
        });
      }
    } else {
      overlayWindow.hide();
      clearInterval(updateOverlayPositionInterval);
      updateOverlayPositionInterval = null;
    }
  }, MAIN_LOOP_INTERVAL);
};
