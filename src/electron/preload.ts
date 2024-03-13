import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  receive: (channel: string, cb: (...args: any) => any): void => {
    ipcRenderer.on(channel, (_, ...args) => cb(...args));
  },
});
