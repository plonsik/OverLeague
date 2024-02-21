import { app, BrowserWindow } from 'electron'
import path from 'path'

if (require('electron-squirrel-startup')) {
    app.quit()
}

const loadReactApp = (browserWindow: BrowserWindow) => {
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        browserWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    } else {
        browserWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
            )
        )
    }
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    loadReactApp(mainWindow)

    // mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
