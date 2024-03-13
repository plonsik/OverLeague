import { Tray, nativeImage } from "electron";
import trayIcon from "../../assets/images/logo.png";

export const setupWindowTray = () => {
  const overlayTray = new Tray(nativeImage.createFromDataURL(trayIcon));

  overlayTray.setContextMenu(null);
};
