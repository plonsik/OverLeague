/// <reference types="vite/client" />

export type ElectronAPI = {
  receive: (
    channel: string,
    callback: (
      event: Electron.IpcRendererEvent,
      extractedStats: any,
      participantData: Participant,
    ) => void,
  ) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}