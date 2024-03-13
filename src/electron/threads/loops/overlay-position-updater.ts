import { BrowserWindow } from "electron";
import { UPDATE_OVERLAY_POSTION_LOOP_INTERVAL } from "../../main";
import { getCurrentForegroundHWND } from "../../utils/koffi";
import {
  LeagueWindowHWND,
  WindowDimensions,
  getLeagueWindowDimensions,
  leagueWindowDimensionsRect,
} from "../../utils/league-window";

type StartOverlayPostionLoopParams = {
  overlayWindow: BrowserWindow;
  leagueWindowHWND: LeagueWindowHWND;
};

type StartOverlayPostionLoop = NodeJS.Timeout | null;

export const startOverlayPostionUpdater = ({
  overlayWindow,
  leagueWindowHWND,
}: StartOverlayPostionLoopParams) => {
  let updateOverlayPositionIntervalId: StartOverlayPostionLoop = setInterval(
    () => {
      const isLeagueWindowDimensionsAvailable = getLeagueWindowDimensions(
        leagueWindowHWND,
        leagueWindowDimensionsRect
      );

      if (!isLeagueWindowDimensionsAvailable) {
        overlayWindow.hide();
        clearInterval(updateOverlayPositionIntervalId);
        updateOverlayPositionIntervalId = null;
      } else {
        const currentlyFocusedWindow = getCurrentForegroundHWND();
        if (
          currentlyFocusedWindow === leagueWindowHWND &&
          overlayWindow.isVisible()
        ) {
          overlayWindow.setAlwaysOnTop(true, "screen-saver");
        } else {
          overlayWindow.setAlwaysOnTop(false);
        }

        overlayWindow.setBounds({
          x: leagueWindowDimensionsRect.left - 730,
          y: leagueWindowDimensionsRect.top,
          width: 730,
          height:
            leagueWindowDimensionsRect.bottom - leagueWindowDimensionsRect.top,
        });

        if (!overlayWindow.isVisible()) overlayWindow.show();
      }
    },
    UPDATE_OVERLAY_POSTION_LOOP_INTERVAL
  );

  return updateOverlayPositionIntervalId;
};
