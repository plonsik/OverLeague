import { contextBridge, ipcRenderer } from "electron";
import { CallbackFunction } from "../types";

contextBridge.exposeInMainWorld("electronAPI", {
  receive: (channel: string, func: CallbackFunction): CallbackFunction => {
    const wrapper: CallbackFunction = (_, ...args) => func(...args);
    ipcRenderer.on(channel, wrapper);

    return wrapper;
  },
  removeListener: (channel: string, func: CallbackFunction): void => {
    ipcRenderer.removeListener(channel, func);
  },
  openLink: (url: string) => ipcRenderer.invoke("openLink", url),
  // quitTeamBuilderDraft: () => ipcRenderer.invoke('quitTeamBuilderDraft'),
});
