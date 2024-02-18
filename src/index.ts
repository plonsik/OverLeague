import { app, BrowserWindow } from 'electron'
import { Worker } from 'worker_threads'
import {
    LCUAvailable,
    getLCUWindowPositionAndSize,
    getLCUName,
    getLCUArguments,
} from './utils/LCU'
import { LCUArguments } from './types'

let dynamicWindow: BrowserWindow | null = null

const createWindow = async () => {
    const lcu_name = getLCUName()
    const isAvailable = await LCUAvailable(lcu_name)

    if (isAvailable && !dynamicWindow) {
        dynamicWindow = new BrowserWindow({
            width: 200,
            height: 720,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        })

        await dynamicWindow.loadFile('renderer/overlay.html')
        dynamicWindow.once('ready-to-show', () => dynamicWindow?.show())
        dynamicWindow.on('closed', () => (dynamicWindow = null))
        const LCUArguments = await getLCUArguments(lcu_name)

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
                x: positionAndSize.x - 200,
                y: positionAndSize.y,
                width: 200,
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
    }, 2000)
}

app.on('ready', () => {
    console.log('App is ready')
    setInterval(createWindow, 2000)
})
