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

const loadReactApp = (browserWindow: BrowserWindow) => {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    browserWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    browserWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

export const checkAvailabilityAndCreateWindow = async () => {
  const lcu_name = getLCUName();
  const isAvailable = await isLCUAvailable(lcu_name);

  if (isAvailable && !overlayWindow) {
    const lcuArguments = await getLCUArguments(lcu_name);
    createOverlayWindow(lcuArguments);
  }
};

const createOverlayWindow = (lcuArguments: LCUArguments) => {
  overlayWindow = new BrowserWindow({
    width: 230,
    height: 720,
    frame: false,
    show: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  loadReactApp(overlayWindow);
  overlayWindow.on("closed", (): void => (overlayWindow = null));
  overlayWindow.webContents.toggleDevTools();
  startUpdatingWindowPosition();
  startLobbyStatusChecks(lcuArguments, overlayWindow);
};

const startUpdatingWindowPosition = () => {
  let intervalId: string | number | NodeJS.Timeout = null;

  const updatePosition = async () => {
    if (!overlayWindow) {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
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
      if (overlayWindow) {
        overlayWindow.destroy();
        overlayWindow = null;
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  };

  intervalId = setInterval(updatePosition, 1000 / 120);
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
