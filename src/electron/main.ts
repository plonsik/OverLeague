import { app } from "electron";
import { setupIpcHandlers } from "./managers/ipc-handler-manager";
import { setupTray } from "./managers/tray-manager";
import { checkAvailabilityAndCreateWindow } from "./managers/window-manager";

app.on("ready", () => {
  console.log("App is ready");
  // scrapePlayersData('EUNE', 'Maruaj', 'RANKED_SOLO_5x5')
  setupIpcHandlers();
  setupTray();
  setInterval(checkAvailabilityAndCreateWindow, 2000);
});
