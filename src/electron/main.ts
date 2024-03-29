import { app } from "electron";
import { setupOverlayWindow } from "./managers/overlay-window";
import { setupWindowTray } from "./managers/tray";
import { startLeagueWindowListener } from "./threads/loops/league-window-listener";

export const MAIN_LOOP_INTERVAL = 2_000;
export const UPDATE_OVERLAY_POSTION_LOOP_INTERVAL = 1_000 / 120;
export const UPDATE_LOBBY_STATUS_LOOP_INTERVAL = 1_000;

app.whenReady().then(() => {
  const overlayWindow = setupOverlayWindow();

  /* Setup */
  setupWindowTray();

  /* Start */
  startLeagueWindowListener(overlayWindow);
});
