import { app } from "electron";
import { setupIpcHandlers } from "./managers/ipc-handler-manager";
import { setupTray } from "./managers/tray-manager";
import { createWindow } from "./managers/window-manager";

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.on("ready", () => {
  console.log("App is ready");
  // scrapePlayersData('EUNE', 'Maruaj', 'RANKED_SOLO_5x5')
  setupIpcHandlers();
  setupTray();
  setInterval(createWindow, 2000);
});
