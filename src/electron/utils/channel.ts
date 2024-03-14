import { BrowserWindow } from "electron";

export const sendToChannel = <T>(
  window: BrowserWindow,
  channel: string,
  payload: T
) => {
  window.webContents.send(channel, payload);
};
