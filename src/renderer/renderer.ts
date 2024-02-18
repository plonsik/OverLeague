import ipcRenderer = Electron.ipcRenderer
import { Player, PlayerSubset } from '../types'

ipcRenderer.on('lobby-status', (event, lobbyData) => {
    console.log('Lobby Data Received:', lobbyData)
    const players = filterUniquePlayers(lobbyData)
    console.log('players: ', players)
    updateLobbyUI(lobbyData)
})

function updateLobbyUI(lobbyData: any) {}

function filterUniquePlayers(lobbyData: Player[]): PlayerSubset[] {
    const uniqueNames: { [name: string]: PlayerSubset } = {}

    lobbyData.forEach((player) => {
        const { name, game_tag, region } = player
        uniqueNames[name] = { name, game_tag, region }
    })

    return Object.values(uniqueNames)
}
