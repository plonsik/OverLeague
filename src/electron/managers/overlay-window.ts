import { BrowserWindow } from "electron";
import * as path from "node:path";

export const setupOverlayWindow = () => {
  const overlayWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
    resizable: false,
    skipTaskbar: true,
    frame: false,
    show: false,
  });
  overlayWindow.webContents.openDevTools()
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    overlayWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    overlayWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  return overlayWindow;
};
