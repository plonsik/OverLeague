import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  receive: (
    channel: string,
    func: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => {
    const handler = (event: IpcRendererEvent, ...args: any[]) =>
      func(event, ...args);

    ipcRenderer.on(channel, handler);

    return () => ipcRenderer.removeListener(channel, handler);
  },
  openLink: (url: string) => ipcRenderer.invoke("openLink", url),
  // quitTeamBuilderDraft: () => ipcRenderer.invoke('quitTeamBuilderDraft'),
});
