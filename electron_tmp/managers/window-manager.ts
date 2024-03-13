import { getLCUWindowPositionAndSize } from "../utils/LCU";
import { BrowserWindow } from "electron";
import path from "path";
import { IRect } from "../../types";

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

export const createOverlayWindow = async () => {
  overlayWindow = new BrowserWindow({
    width: 230,
    height: 720,
    frame: false,
    show: false,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  loadReactApp(overlayWindow);
  overlayWindow.on("closed", (): void => (overlayWindow = null));
  overlayWindow.webContents.toggleDevTools();
};

export const startUpdatingWindowPosition = () => {
  let intervalId: NodeJS.Timeout | null = null;

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

export const getOverlayWindow = () => {
  if (overlayWindow) {
    return overlayWindow;
  }
};
