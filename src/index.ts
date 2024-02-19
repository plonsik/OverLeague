import { app } from 'electron'
import { createWindow } from './managers/window-manager'
import { setupTray } from './managers/tray-manager'
import { setupIpcHandlers } from './managers/ipc-handler-manager'

app.on('ready', () => {
    console.log('App is ready')
    setupIpcHandlers()
    setupTray()
    setInterval(createWindow, 2000)
})
