import { app } from "electron";
import { setupIpcHandlers } from "./managers/ipc-handler-manager";
import { setupTray } from "./managers/tray-manager";
import {
  startUpdatingWindowPosition,
  createOverlayWindow,
  getOverlayWindow,
  showWindow,
  hideWindow,
} from "./managers/window-manager";
import {
  getLCUArguments,
  getLCUName,
  getLCUWindowPositionAndSize,
  isLCUAvailable,
} from "./utils/LCU";
import { startLobbyStatusWorker } from "./managers/worker-manager";

app.on("ready", () => {
  console.log("App is ready");
  // scrapePlayersData('EUNE', 'Maruaj', 'RANKED_SOLO_5x5')
  setupIpcHandlers();
  setupTray().then((_) => startCheckInterval());
});

let windowPositionUpdatingStatus = false;
let lobbyUpdatingFunction: (() => void) | null = null;

const startCheckInterval = async () => {
  await createOverlayWindow();
  const lcu_name = getLCUName();
  const overlayWindow = getOverlayWindow();

  setInterval(async () => {
    const isAvailable = await isLCUAvailable(lcu_name);
    if (isAvailable && overlayWindow && !windowPositionUpdatingStatus) {
      try {
        const lcuArguments = await getLCUArguments(lcu_name);

        await getLCUWindowPositionAndSize();
        showWindow();
        startUpdatingWindowPosition();
        windowPositionUpdatingStatus = true;

        lobbyUpdatingFunction = startLobbyStatusWorker(
          lcuArguments,
          overlayWindow,
        );
      } catch (error) {
        console.log(error);
        hideWindow();
        windowPositionUpdatingStatus = false;
        lobbyUpdatingFunction(); //stops lobby status checks
      }
    } else if (!isAvailable && overlayWindow && windowPositionUpdatingStatus) {
      hideWindow();
      windowPositionUpdatingStatus = false;
      lobbyUpdatingFunction(); //stops lobby status checks
    }
  }, 2000);
};
