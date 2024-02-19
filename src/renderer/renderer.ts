interface Participant {
    game_name: string
    game_tag: string
    activePlatform: string | null
}

let uniqueKeys: string[] = []

function updateLobby(lobbyData: { participants: Participant[] } | null): void {
    uniqueKeys = []
    if (!lobbyData) {
        for (let i = 1; i <= 5; i++) {
            const playerElement = document.getElementById(`player${i}`)
            const nicknameElement = playerElement?.querySelector('.nick')
            if (nicknameElement) {
                nicknameElement.textContent = ''
            }
        }
        return
    }

    for (const participant of lobbyData.participants) {
        const key = `${participant.game_name}#${participant.game_tag}`
        if (participant.activePlatform !== null && !uniqueKeys.includes(key)) {
            uniqueKeys.push(key)
        }
    }

    for (let i = 1; i <= 5; i++) {
        const playerElement = document.getElementById(`player${i}`)
        const nicknameElement = playerElement?.querySelector('.nick')

        if (i <= uniqueKeys.length) {
            nicknameElement!.textContent = uniqueKeys[i - 1]
        } else {
            nicknameElement!.textContent = ''
        }
    }
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
        const opggMultiLink = createOPGGMultiSearchLink(uniqueKeys)
        window.electronAPI.openLink(opggMultiLink)
    })

document.getElementById('dodgeQueueBtn')?.addEventListener('click', () => {
    console.log('click')
    window.electronAPI.quitTeamBuilderDraft
})
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
