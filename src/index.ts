import { app, BrowserWindow } from "electron";
import {
  getLCUArguments,
  LCUAvailable,
  getLCUWindowPositionAndSize,
  getLCUName,
} from "./utils/LCU";
import { checkForLobby, getCurrentSummoner } from "./utils/requests";
import { clearInterval } from "timers";

app.on("ready", async () => {
  console.log("App is ready");

  const pollingInterval = 2000;
  const positionPollingInterval = 10;
  let positionPollingStarted = false;
  let positionInterval: string | number | NodeJS.Timeout | undefined;

  const LCUPooling = setInterval(async () => {
    try {
      const lcu_name = getLCUName();
      const isAvailable = await LCUAvailable(lcu_name);
      if (isAvailable) {
        clearInterval(LCUPooling);
        if (!positionPollingStarted) {
          let dynamicWindow = new BrowserWindow({
            width: 200,
            height: 720,
            frame: false,
            webPreferences: {
              nodeIntegration: true,
            },
          });

          await dynamicWindow.loadFile("overlay.html");

          dynamicWindow.once("ready-to-show", () => {
            dynamicWindow.show();
          });
          positionPollingStarted = true;
          positionInterval = setInterval(async () => {
            try {
              const positionAndSize = await getLCUWindowPositionAndSize();
              dynamicWindow.setBounds({
                x: positionAndSize.x - 200,
                y: positionAndSize.y,
                width: 200,
                height: positionAndSize.height,
              });
            } catch (positionError) {
              console.error(
                "Error fetching LCU position and size:",
                positionError,
              );
            }
          }, positionPollingInterval);
        }

        const LCUArguments = await getLCUArguments(lcu_name);
        const currentSummoner = await getCurrentSummoner(LCUArguments);
        const data = await checkForLobby(LCUArguments);

        console.log(currentSummoner);
        console.log(data);
      } else {
        console.log("LCU is not available. Waiting...");
        if (positionPollingStarted) {
          clearInterval(positionInterval);
          positionPollingStarted = false;
        }
      }
    } catch (err) {
      console.error(
        "Error checking LCU availability or fetching summoner:",
        err,
      );
      clearInterval(LCUPooling);
      if (positionPollingStarted) {
        clearInterval(positionInterval);
      }
    }
  }, pollingInterval);
});
