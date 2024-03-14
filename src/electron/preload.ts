import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  addListener: (channel: string, cb: (...args: any) => void): void => {
    ipcRenderer.on(channel, (_, ...args) => cb(...args));
  },
  removeListener: (channel: string, cb: (...args: any) => void): void => {
    ipcRenderer.removeListener(channel, cb);
  },
});
