export interface LCUArguments {
    auth_token?: string
    app_port?: string
    region?: string
    riotclient_auth_token?: string
    riotclient_app_port?: string
}

export interface IElectronAPI {
    loadPreferences: () => Promise<void>

    receive(
        lobbyStatus: string,
        param2: (lobbyData: { participants: Participant[] } | null) => void
    ): void

    openLink(opggMultiLink: string): void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
export interface Participant {
    game_name: string
    game_tag: string
    activePlatform: string | null
}

export type CallbackFunction = (...args: any[]) => void
