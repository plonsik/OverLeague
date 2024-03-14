/// <reference types="vite/client" />

export type ElectronAPI = {
  addListener: (channel: string, callback: (...args: any[]) => void) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
};

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }

  export type LobbyStatusPayload = boolean
}
