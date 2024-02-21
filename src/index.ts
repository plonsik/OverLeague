import { app, BrowserWindow, session } from 'electron'
import { createWindow } from './managers/window-manager'
import { setupTray } from './managers/tray-manager'
import { setupIpcHandlers } from './managers/ipc-handler-manager'
import { scrapePlayersData } from './utils/scrape-players-data'

app.on('ready', () => {
    console.log('App is ready')
    scrapePlayersData('EUNE', 'Maruaj', 'RANKED_SOLO_5x5')
    // setupIpcHandlers()
    // setupTray()
    // setInterval(createWindow, 2000)
})
