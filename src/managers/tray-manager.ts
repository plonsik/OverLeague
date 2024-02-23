import { app, Menu, Tray, nativeImage } from "electron";
import { hideWindow, showWindow } from "./window-manager";
import trayIcon from "../assets/logo.png";

let appTray: Tray | null = null;
export const setupTray = () => {
  const iconPath = nativeImage.createFromDataURL(trayIcon);
  if (!appTray) {
    appTray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => {
          showWindow();
        },
      },
      {
        label: "Hide",
        click: () => {
          hideWindow();
        },
      },
      {
        label: "Exit",
        click: () => {
          app.quit();
        },
      },
    ]);

    appTray.setToolTip("OverLeague");
    appTray.setContextMenu(contextMenu);

    appTray.on("click", () => {
      console.log("Tray icon clicked");
      showWindow();
    });
  }
};
