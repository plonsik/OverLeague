import {
    getLCUArguments,
    getLCUName,
    getLCUWindowPositionAndSize,
    isLCUAvailable,
} from '../utils/LCU'
import { BrowserWindow } from 'electron'
import path from 'path'
import { startLobbyStatusChecks } from './worker-manager'
import { LCUArguments } from '../types'

let overlayWindow: BrowserWindow | null = null
let LCUArguments: LCUArguments | null = null

export const createWindow = async () => {
    const lcu_name = getLCUName()
    const isAvailable = await isLCUAvailable(lcu_name)

    if (isAvailable && !overlayWindow) {
        LCUArguments = await getLCUArguments(lcu_name)
        overlayWindow = new BrowserWindow({
            width: 230,
            height: 720,
            frame: false,
            skipTaskbar: true,
            webPreferences: {
                preload: path.join(__dirname, '../utils/preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
            },
        })

        await overlayWindow.loadFile('renderer/overlay.html')
        overlayWindow.once('ready-to-show', () => overlayWindow?.show())
        // @ts-ignore
        overlayWindow.on('closed', () => (overlayWindow = null))
        overlayWindow.on('close', (event) => {
            event.preventDefault()
            overlayWindow!.hide()
        })
        overlayWindow.webContents.toggleDevTools()
        startUpdatingWindowPosition()

        startLobbyStatusChecks(LCUArguments, overlayWindow)
    }
}
//TODO: Throttle this shit a bit or make performance mode
const startUpdatingWindowPosition = () => {
    const updatePosition = async () => {
        if (!overlayWindow) {
            return
        }

        try {
            const positionAndSize = await getLCUWindowPositionAndSize()
            overlayWindow.setBounds({
                x: positionAndSize.x - 730,
                y: positionAndSize.y,
                width: 730,
                height: positionAndSize.height,
            })
            if (positionAndSize.isForeground) {
                overlayWindow.setAlwaysOnTop(true, 'screen-saver')
            } else {
                overlayWindow.setAlwaysOnTop(false)
            }
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

export const getWindow = () => {
    return overlayWindow
}
export const showWindow = () => {
    if (overlayWindow) {
        overlayWindow.show()
    }
}

export const hideWindow = () => {
    if (overlayWindow) {
        overlayWindow.hide()
    }
}

export const retrieveLCUArguments = () => {
    return LCUArguments
}
