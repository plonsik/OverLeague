import os from 'os'
import find from 'find-process'
import ps from 'ps-node'
import { LCUArguments } from '../types'
import ffi from 'ffi-napi'
import Struct from 'ref-struct-napi'

const Rect = Struct({
    left: 'long',
    top: 'long',
    right: 'long',
    bottom: 'long',
})

const user32 = ffi.Library('user32', {
    FindWindowA: ['long', ['string', 'string']],
    GetWindowRect: ['bool', ['long', 'pointer']],
})

export async function getLCUWindowPositionAndSize(): Promise<{
    x: number
    y: number
    width: number
    height: number
}> {
    return new Promise((resolve, reject) => {
        const lcuWindowName = 'League of Legends'
        const hwnd = user32.FindWindowA(null, lcuWindowName)

        if (!hwnd) {
            reject(new Error('LCU window not found'))
            return
        }

        const rect = new Rect()
        const rectPtr = rect.ref()

        const success = user32.GetWindowRect(hwnd, rectPtr)
        if (!success) {
            reject(new Error('Failed to get window position and size'))
            return
        }

        const positionAndSize = {
            x: rect.left,
            y: rect.top,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top,
        }

        resolve(positionAndSize)
    })
}

export function getLCUName(): string {
    let lcu_name: string

    const platform = os.platform()

    if (platform === 'win32') {
        lcu_name = 'LeagueClientUx.exe'
    } else if (platform === 'darwin' || platform === 'linux') {
        lcu_name = 'LeagueClientUx'
    } else {
        throw new Error('Unsupported platform')
    }

    return lcu_name
}

export async function isLCUAvailable(lcu_name: string): Promise<boolean> {
    try {
        const list = await find('name', lcu_name)
        return list.length > 0
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function getLCUArguments(lcu_name: string): Promise<LCUArguments> {
    const processes = await find('name', lcu_name)

    if (processes.length === 0) {
        throw new Error(
            `No ${lcu_name} found. Login to an account and try again.`
        )
    }

    const pid = processes[0].pid

    return new Promise((resolve, reject) => {
        ps.lookup({ pid: pid }, (err, resultList) => {
            if (err) {
                reject(err)
                return
            }

            const process = resultList[0]
            if (process) {
                const args = process.arguments
                const lcuArguments: LCUArguments = {}

                args.forEach((arg) => {
                    if (arg.includes('--region=')) {
                        lcuArguments.region = arg
                            .split('--region=', 2)[1]
                            .toLowerCase()
                    } else if (arg.includes('--remoting-auth-token=')) {
                        lcuArguments.auth_token = arg.split(
                            '--remoting-auth-token=',
                            2
                        )[1]
                    } else if (arg.includes('--app-port=')) {
                        lcuArguments.app_port = arg.split('--app-port=', 2)[1]
                    } else if (arg.includes('--riotclient-auth-token=')) {
                        lcuArguments.riotclient_auth_token = arg.split(
                            '--riotclient-auth-token=',
                            2
                        )[1]
                    } else if (arg.includes('--riotclient-app-port=')) {
                        lcuArguments.riotclient_app_port = arg.split(
                            '--riotclient-app-port=',
                            2
                        )[1]
                    }
                })

                resolve(lcuArguments)
            } else {
                reject(new Error('LCU process not found'))
            }
        })
    })
}
