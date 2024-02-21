import './app'

interface Participant {
    game_name: string
    game_tag: string
    activePlatform: string | null
}

let uniquePlayers: string[] = []
let prevLobbyData: { participants: Participant[] } | null = null

function updateLobby(lobbyData: { participants: Participant[] } | null): void {
    const currentLobbyDataString = JSON.stringify(lobbyData)
    const prevLobbyDataString = JSON.stringify(prevLobbyData)

    if (currentLobbyDataString === prevLobbyDataString) {
        return
    }

    prevLobbyData = lobbyData

    uniquePlayers = []
    const waitingForLobby = document.getElementById('waitingForLobby')
    const lobbyView = document.getElementById('lobbyView')

    if (!lobbyData) {
        waitingForLobby!.style.display = 'flex'
        lobbyView!.style.display = 'none'

        for (let i = 1; i <= 5; i++) {
            const playerElement = document.getElementById(`player${i}`)
            const nicknameElement = playerElement?.querySelector('.nick')
            if (nicknameElement) {
                nicknameElement.textContent = ''
            }
        }
        return
    }

    waitingForLobby!.style.display = 'none'
    lobbyView!.style.display = 'flex'
    lobbyView!.style.flexDirection = 'column'
    lobbyView!.style.height = '90%'

    for (const participant of lobbyData.participants) {
        const key = `${participant.game_name}#${participant.game_tag}`
        if (
            participant.activePlatform !== null &&
            !uniquePlayers.includes(key)
        ) {
            uniquePlayers.push(key)
        }
    }

    for (let i = 1; i <= 5; i++) {
        const playerElement = document.getElementById(`player${i}`)
        const nicknameElement = playerElement?.querySelector('.nick')

        if (i <= uniquePlayers.length) {
            nicknameElement!.textContent = uniquePlayers[i - 1]
        } else {
            nicknameElement!.textContent = ''
        }
    }

    // if (uniqueKeys.length === 5) {
    //     window.electronAPI.scrapePlayersData(uniqueKeys).then((playersData) => {
    //         playersData.forEach((data, index) => {
    //             const playerElement = document.getElementById(
    //                 `player${index + 1}`
    //             )
    //             if (!playerElement) return
    //
    //             const wrElement = playerElement.querySelector('.wr')
    //             const kdaElement = playerElement.querySelector('.kda')
    //             const rankElement = playerElement.querySelector('.rank')
    //
    //             if (wrElement) wrElement.textContent = data.wr ?? 'N/A'
    //             if (kdaElement) kdaElement.textContent = data.kda ?? 'N/A'
    //             if (rankElement) rankElement.textContent = data.rank ?? 'N/A'
    //         })
    //     })
    // }
}

function createOPGGMultiSearchLink(names: string[]): string {
    return `https://www.op.gg/multisearch/eune?summoners=${names
        .map((name) => encodeURIComponent(name))
        .join(',')}`
}

// function createUGGMultiSearchLink(names: string[]): string {
//     return `https://u.gg/multisearch?summoners=${names
//         .map((name) => encodeURIComponent(name))
//         .join(',')}&region=eun1`
// }
document
    .getElementById('generateOPGGLinksBtn')
    ?.addEventListener('click', () => {
        const opggMultiLink = createOPGGMultiSearchLink(uniquePlayers)
        window.electronAPI.openLink(opggMultiLink)
    })

// document.getElementById('dodgeQueueBtn')?.addEventListener('click', () => {
//     console.log('click')
//     window.electronAPI.quitTeamBuilderDraft
// })
// document
//     .getElementById('generateUGGLinksBtn')
//     ?.addEventListener('click', () => {
//         const uggMultiLink = createUGGMultiSearchLink(uniqueKeys)
//         window.electronAPI.openLink(uggMultiLink)
//     })
window.electronAPI.receive(
    'lobby-status',
    (lobbyData: { participants: Participant[] } | null) => {
        updateLobby(lobbyData)
    }
)
