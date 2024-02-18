import { contextBridge, ipcRenderer } from 'electron'

type CallbackFunction = (...args: any[]) => void

contextBridge.exposeInMainWorld('electronAPI', {
    sendToMain: (channel: string, data: any): void => {
        ipcRenderer.send(channel, data)
    },
    receive: (channel: string, func: CallbackFunction): void => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    },
})
