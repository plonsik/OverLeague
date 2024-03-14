// /// <reference types="vite/client" />
// export interface LCUArguments {
//   auth_token?: string;
//   app_port?: string;
//   region?: string;
//   riotclient_auth_token?: string;
//   riotclient_app_port?: string;
// }

// export interface GameModeResponse {
//   queueId?: number;
// }

// export interface Participant {
//   activePlatform: string | null;
//   cid: string;
//   game_name: string;
//   game_tag: string;
//   muted: boolean;
//   name: string;
//   pid: string;
//   puuid: string;
//   region: string;
// }

// export interface IRect {
//   left: number;
//   top: number;
//   right: number;
//   bottom: number;
// }

// export interface Queue {
//   queueId: number;
//   description: string | null;
// }

// export interface LobbyStatusData {
//   queueDescription: string;
//   participantNames: string[];
// }

// export type ParticipantData = [
//   nickname: string,
//   region: string,
//   accountId: string,
//   summonerName: string,
// ];

// export type CallbackFunction = (...args: any[]) => void;

// export interface IElectronAPI {
//   loadPreferences: () => Promise<void>;

//   receive: (
//     channel: string,
//     callback: (
//       event: Electron.IpcRendererEvent,
//       extractedStats: any,
//       participantData: Participant,
//     ) => void,
//   ) => () => void;

//   removeListener: (channel: string, callback: () => void) => void;

//   openLink: (url: string) => void;

//   quitTeamBuilderDraft: () => Promise<any>;

//   scrapePlayersData: (uniqueKeys: string[]) => Promise<any>;
// }

// declare global {
//   interface Window {
//     electronAPI: IElectronAPI;
//   }
// }

// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }
