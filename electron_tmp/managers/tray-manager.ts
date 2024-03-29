import { app, Menu, Tray, nativeImage } from "electron";
import trayIcon from "../../assets/images/logo.png";
import {
  disableAutoLaunch,
  enableAutoLaunch,
  isAutoLaunchEnabled,
} from "./auto-launch-manager";
import { hideWindow, showWindow } from "./window-manager";

let appTray: Tray | null = null;
export const setupTray = async () => {
  const iconPath = nativeImage.createFromDataURL(trayIcon);
  if (!appTray) {
    appTray = new Tray(iconPath);

    const toggleAutoLaunch = async () => {
      const isEnabled = await isAutoLaunchEnabled();
      if (isEnabled) {
        await disableAutoLaunch();
      } else {
        await enableAutoLaunch();
      }
      await buildContextMenu();
    };

    const buildContextMenu = async () => {
      const autoLaunchEnabled = await isAutoLaunchEnabled();
      const contextMenu = Menu.buildFromTemplate([
        { label: "Show", click: showWindow },
        { label: "Hide", click: hideWindow },
        { type: "separator" },
        {
          label: autoLaunchEnabled
            ? "Disable launch on startup"
            : "Enable launch on startup",
          click: toggleAutoLaunch,
        },
        { type: "separator" },
        { label: "Exit", click: () => app.quit() },
      ]);

      appTray.setContextMenu(contextMenu);
    };

    await buildContextMenu();

    appTray.setToolTip("OverLeague");
    appTray.on("click", showWindow);
  }
};
