import { app, ipcMain, shell } from 'electron'
import { createWindow, retrieveLCUArguments } from './managers/window-manager'
import { setupTray } from './managers/tray-manager'
import { quitTeamBuilderDraft } from './utils/requests'

ipcMain.handle('openLink', async (_, url) => {
    try {
        await shell.openExternal(url)
    } catch (error) {
        console.error('Failed to open external link:', error)
    }
})

ipcMain.handle('quitTeamBuilderDraft', async (_) => {
    try {
        const LCUArguments = retrieveLCUArguments()
        console.log(LCUArguments)
        if (LCUArguments == null) {
            console.log('LCUArguments are null')
        } else {
            const lol = await quitTeamBuilderDraft(LCUArguments)
            console.log(lol)
        }
    } catch (error) {
        console.error('Error handling quit-team-builder-draft:', error)
    }
})

app.on('ready', () => {
    console.log('App is ready')

    setInterval(createWindow, 2000)
    setupTray()
})
