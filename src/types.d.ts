export interface LCUArguments {
    auth_token?: string
    app_port?: string
    region?: string
    riotclient_auth_token?: string
    riotclient_app_port?: string
}

export interface Player {
    activePlatform: string | null
    cid: string
    game_name: string
    game_tag: string
    muted: boolean
    name: string
    pid: string
    puuid: string
    region: string
}

export interface PlayerSubset {
    name: string
    game_tag: string
    region: string
}
