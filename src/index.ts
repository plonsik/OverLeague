import { app, BrowserWindow, ipcMain, shell, Tray, Menu } from 'electron'
import { Worker } from 'worker_threads'
import {
    isLCUAvailable,
    getLCUWindowPositionAndSize,
    getLCUName,
    getLCUArguments,
} from './utils/LCU'
import { LCUArguments } from './types'
import path from 'path'
import { quitTeamBuilderDraft } from './utils/requests'

let overlayWindow: BrowserWindow | null = null
let appTray: Tray | null = null

const createWindow = async () => {
    const lcu_name = getLCUName()
    const isAvailable = await isLCUAvailable(lcu_name)

    if (isAvailable && !overlayWindow) {
        const LCUArguments = await getLCUArguments(lcu_name)
        overlayWindow = new BrowserWindow({
            width: 230,
            height: 720,
            frame: false,
            skipTaskbar: true,
            webPreferences: {
                preload: path.join(__dirname, 'utils/preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
            },
        })

        await overlayWindow.loadFile('renderer/overlay.html')
        overlayWindow.once('ready-to-show', () => overlayWindow?.show())
        overlayWindow.on('closed', () => (overlayWindow = null))
        overlayWindow.on('close', (event) => {
            event.preventDefault()
            overlayWindow!.hide()
        })
        //overlayWindow.webContents.toggleDevTools()
        startUpdatingWindowPosition()

        startLobbyStatusChecks(LCUArguments)
    }
}

const startUpdatingWindowPosition = () => {
    const updatePosition = async () => {
        if (!overlayWindow) {
            return
        }

        try {
            const positionAndSize = await getLCUWindowPositionAndSize()
            overlayWindow.setBounds({
                x: positionAndSize.x - 230,
                y: positionAndSize.y,
                width: 230,
                height: positionAndSize.height,
            })
        } catch (error) {
            console.error(
                'Error fetching LCU position and size:',
                error instanceof Error ? error.message : String(error)
            )
            overlayWindow.destroy()
            overlayWindow = null
        }

        setImmediate(updatePosition)
    }
    setImmediate(updatePosition)
}

const startLobbyStatusChecks = (LCUArguments: LCUArguments) => {
    const worker = new Worker('./dist/workers/lobby-status-worker.js')

    worker.on('message', (message: any) => {
        if (message.success && overlayWindow) {
            console.log(message.lobbyData)
            overlayWindow.webContents.send('lobby-status', message.lobbyData)

            if (message.lobbyData !== null && !overlayWindow.isVisible()) {
                overlayWindow.show()
            }
        }
    })

    worker.on('error', (error: Error) => {
        console.error('Worker error:', error)
    })

    worker.on('exit', (code: number) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`)
        }
    })

    setInterval(() => {
        worker.postMessage(LCUArguments)
    }, 1000)
}
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

    const iconPath = path.join(__dirname, 'assets/logo.png')
    appTray = new Tray(iconPath)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            click: () => {
                if (!overlayWindow) {
                    createWindow()
                } else {
                    overlayWindow.show()
                }
            },
        },
        {
            label: 'Hide',
            click: () => {
                if (overlayWindow) {
                    overlayWindow.hide()
                }
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
})
