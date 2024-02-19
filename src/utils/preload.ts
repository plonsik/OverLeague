import { contextBridge, ipcRenderer } from 'electron'
import { CallbackFunction } from '../types'

contextBridge.exposeInMainWorld('electronAPI', {
    sendToMain: (channel: string, data: any): void => {
        ipcRenderer.send(channel, data)
    },
    receive: (channel: string, func: CallbackFunction): void => {
        ipcRenderer.on(channel, (_, ...args) => func(...args))
    },
    openLink: (url: string) => ipcRenderer.invoke('openLink', url),
    // quitTeamBuilderDraft: () => ipcRenderer.invoke('quitTeamBuilderDraft'),
    // scrapePlayersData: (uniquePlayers: string[]) =>
    //     ipcRenderer.invoke('scrapePlayersData', uniquePlayers),
})
