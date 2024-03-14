import { BrowserWindow } from "electron";

export const sendToChannel = <T>(
  window: BrowserWindow,
  channel: Channel,
  payload: T
) => {
  window.webContents.send(channel, payload);
};
