import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { Worker } from 'worker_threads'
import {
    isLCUAvailable,
    getLCUWindowPositionAndSize,
    getLCUName,
    getLCUArguments,
} from './utils/LCU'
import { LCUArguments } from './types'
import path from 'path'

let dynamicWindow: BrowserWindow | null = null

const createWindow = async () => {
    const lcu_name = getLCUName()
    const isAvailable = await isLCUAvailable(lcu_name)

    if (isAvailable && !dynamicWindow) {
        const LCUArguments = await getLCUArguments(lcu_name)
        dynamicWindow = new BrowserWindow({
            width: 230,
            height: 720,
            frame: false,
            webPreferences: {
                preload: path.join(__dirname, 'utils/preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
            },
        })

        await dynamicWindow.loadFile('renderer/overlay.html')
        dynamicWindow.once('ready-to-show', () => dynamicWindow?.show())
        dynamicWindow.on('closed', () => (dynamicWindow = null))
        //dynamicWindow.webContents.toggleDevTools()
        startUpdatingWindowPosition()

        startLobbyStatusChecks(LCUArguments)
    }
}

const startUpdatingWindowPosition = () => {
    const updatePosition = async () => {
        if (!dynamicWindow) {
            return
        }

        try {
            const positionAndSize = await getLCUWindowPositionAndSize()
            dynamicWindow.setBounds({
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
            dynamicWindow.destroy()
            dynamicWindow = null
        }

        setImmediate(updatePosition)
    }
    setImmediate(updatePosition)
}

const startLobbyStatusChecks = (LCUArguments: LCUArguments) => {
    const worker = new Worker('./dist/workers/lobby-status-worker.js')

    worker.on('message', (message: any) => {
        if (message.success && dynamicWindow) {
            console.log(message.lobbyData)
            dynamicWindow.webContents.send('lobby-status', message.lobbyData)
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
})
