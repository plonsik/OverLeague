import {
  getLCUArguments,
  getLCUName,
  getLCUWindowPositionAndSize,
  isLCUAvailable,
} from "../utils/LCU";
import { BrowserWindow } from "electron";
import path from "path";
import { startLobbyStatusChecks } from "./worker-manager";
import { IRect, LCUArguments } from "../types";

let overlayWindow: BrowserWindow | null = null;
let LCUArguments: LCUArguments | null = null;

const loadReactApp = (browserWindow: BrowserWindow) => {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    browserWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    browserWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

export const createWindow = async () => {
  const lcu_name = getLCUName();
  const isAvailable = await isLCUAvailable(lcu_name);

  if (isAvailable && !overlayWindow) {
    LCUArguments = await getLCUArguments(lcu_name);
    overlayWindow = new BrowserWindow({
      width: 230,
      height: 720,
      frame: false,
      show: true,
      skipTaskbar: true,
      webPreferences: {
        preload: path.join(__dirname, "../utils/preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    loadReactApp(overlayWindow);
    overlayWindow.on("closed", (): void => (overlayWindow = null));
    overlayWindow.on("close", (event) => {
      event.preventDefault();
      overlayWindow!.hide();
    });
    overlayWindow.webContents.toggleDevTools();
    startUpdatingWindowPosition();

    startLobbyStatusChecks(LCUArguments, overlayWindow);
  }
};
//TODO: Throttle this shit a bit or make performance mode
const startUpdatingWindowPosition = () => {
  const updatePosition = async () => {
    if (!overlayWindow) {
      return;
    }

    try {
      const positionAndSize: IRect & { isForeground: boolean } =
        await getLCUWindowPositionAndSize();
      overlayWindow.setBounds({
        x: positionAndSize.left - 730,
        y: positionAndSize.top,
        width: 730,
        height: positionAndSize.bottom - positionAndSize.top,
      });
      if (positionAndSize.isForeground) {
        overlayWindow.setAlwaysOnTop(true, "screen-saver");
      } else {
        overlayWindow.setAlwaysOnTop(false);
      }
    } catch (error) {
      console.error(
        "Error fetching LCU position and size:",
        error instanceof Error ? error.message : String(error),
      );
      overlayWindow.destroy();
      overlayWindow = null;
    }

    setImmediate(updatePosition);
  };
  setImmediate(updatePosition);
};

export const getWindow = () => {
  return overlayWindow;
};
export const showWindow = () => {
  if (overlayWindow) {
    overlayWindow.show();
  }
};

export const hideWindow = () => {
  if (overlayWindow) {
    overlayWindow.hide();
  }
};

export const retrieveLCUArguments = () => {
  return LCUArguments;
};
