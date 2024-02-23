export interface LCUArguments {
  auth_token?: string;
  app_port?: string;
  region?: string;
  riotclient_auth_token?: string;
  riotclient_app_port?: string;
}

export interface IElectronAPI {
  loadPreferences: () => Promise<void>;

  receive(
    lobbyStatus: string,
    param2: (lobbyData: { participants: Participant[] } | null) => void,
  ): void;

  openLink(opggMultiLink: string): void;

  quitTeamBuilderDraft: () => Promise<any>;

  scrapePlayersData: (uniqueKeys: string[]) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
export interface Participant {
  game_name: string;
  game_tag: string;
  activePlatform: string | null;
}

export type CallbackFunction = (...args: any[]) => void;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

export interface IRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
