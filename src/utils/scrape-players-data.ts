import { BrowserWindow, session } from "electron";
import { ElectronBlocker } from "@cliqz/adblocker-electron";
import fetch from "cross-fetch";

export async function scrapePlayersData(
  region: string,
  playerName: string,
  queueType: string,
) {
  const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
  blocker.enableBlockingInSession(session.defaultSession);

  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const url = details.url.toLowerCase();
    if (
      url.endsWith(".png") ||
      url.endsWith(".woff2") ||
      url.endsWith(".svg") ||
      url.endsWith(".jpg") ||
      url.startsWith("https://live.primis.tech/")
    ) {
      callback({ cancel: true });
    } else {
      callback({ cancel: false });
    }
  });

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Construct the URL using the function parameters
  const profileUrl = `https://tracker.gg/lol/profile/riot/${region}/${playerName}/overview?playlist=${queueType}`;

  await mainWindow.loadURL(profileUrl);

  try {
    mainWindow.webContents.debugger.attach();
  } catch (err) {
    console.error("Debugger attach failed: ", err);
    mainWindow.close();
    return;
  }

  mainWindow.webContents.debugger.on("detach", (event, reason) => {
    console.log("Debugger detached due to: ", reason);
  });

  mainWindow.webContents.debugger.on("message", (event, method, params) => {
    if (method === "Network.responseReceived") {
      const url = params.response.url;
      const baseUrl = "https://api.tracker.gg/api/v2/";

      const urlsToCapture = [
        `https://api.tracker.gg/api/v2/lol/standard/profile/riot/${playerName}/segments/role?region=${region}&playlist=${queueType}&season=2024-01-09T22%3A00%3A00%2B00%3A00`,
        `https://api.tracker.gg/api/v2/lol/standard/profile/riot/${playerName}/segments/champion?region=${region}&queueType=${queueType}&season=2024-01-09T22%3A00%3A00%2B00%3A00&role=ALL`,
        `https://api.tracker.gg/api/v2/lol/standard/profile/riot/${playerName}?region=${region}&forceCollect=true`,
        `https://api.tracker.gg/api/v2/lol/standard/matches/riot/${playerName}?region=${region}&forceCollect=true&type=&season=2024-01-09T22%3A00%3A00%2B00%3A00&playlist=${queueType}`,
      ];

      if (url.startsWith(baseUrl)) {
        console.log(url);
        // Uncomment the following lines to log the response body
        // mainWindow.webContents.debugger
        //     .sendCommand('Network.getResponseBody', {
        //         requestId: params.requestId,
        //     })
        //     .then((response) => {
        //         console.log(response);
        //     })
        //     .catch((err) => console.error('Failed to get response body:', err));
      }
    }
  });

  await mainWindow.webContents.debugger.sendCommand("Network.enable");

  mainWindow.webContents.once("did-finish-load", async () => {
    const clickScript = `
            const refreshButton = document.querySelector('div.updater__refresh--live');
            if (refreshButton) {
                refreshButton.click();
            }
        `;
    await mainWindow.webContents
      .executeJavaScript(clickScript)
      .catch((err) => console.error("Execute JavaScript failed: ", err));
  });

  // Optional: Close the window if needed
  // mainWindow.close();
}
