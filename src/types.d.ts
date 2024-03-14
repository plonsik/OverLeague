/// <reference types="vite/client" />

export type ElectronAPI = {
  addListener: (channel: string, callback: (...args: any[]) => void) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
};

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }

  export interface Queue {
    queueId: number;
    description: string | null;
  }

  export type Channel = "lobby-status" | "gamemode" | "participants";

  export type LobbyStatusPayload = boolean;
  export type GameModePayload = string | undefined;
  export type Participant = {
    gameName: string;
    gameTag: string;
  };
  export type ParticipantsPayload = Participant[];
}
