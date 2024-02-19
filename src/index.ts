import { app, ipcMain, shell } from 'electron'
import { createWindow } from './managers/window-manager'
import { setupTray } from './managers/tray-manager'

ipcMain.handle('openLink', async (event, url) => {
    try {
        await shell.openExternal(url)
    } catch (err) {
        console.error('Failed to open external link:', err)
    }
})

app.on('ready', () => {
    console.log('App is ready')

    setInterval(createWindow, 2000)
    setupTray()
})
