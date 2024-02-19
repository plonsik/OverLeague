import { app, Menu, Tray } from 'electron'
import path from 'path'
import { hideWindow, showWindow } from './window-manager'

let appTray: Tray | null = null
export const setupTray = () => {
    const iconPath = path.join(__dirname, '../assets/logo.png')
    if (!appTray) {
        appTray = new Tray(iconPath)
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show',
                click: () => {
                    showWindow()
                },
            },
            {
                label: 'Hide',
                click: () => {
                    hideWindow()
                },
            },
            {
                label: 'Exit',
                click: () => {
                    app.quit()
                },
            },
        ])

        appTray.setToolTip('OverLeague')
        appTray.setContextMenu(contextMenu)

        appTray.on('click', () => {
            console.log('Tray icon clicked')
            showWindow()
        })
    }
}
