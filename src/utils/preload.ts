import { contextBridge, ipcRenderer, shell } from 'electron'
import { CallbackFunction } from '../types'

contextBridge.exposeInMainWorld('electronAPI', {
    sendToMain: (channel: string, data: any): void => {
        ipcRenderer.send(channel, data)
    },
    receive: (channel: string, func: CallbackFunction): void => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    },
    openLink: (url: string) => ipcRenderer.invoke('openLink', url),
})
