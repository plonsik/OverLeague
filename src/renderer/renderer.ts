interface Participant {
    game_name: string
    game_tag: string
    activePlatform: string | null
}

function updateLobby(lobbyData: { participants: Participant[] } | null): void {
    if (!lobbyData) return

    const activeParticipants = lobbyData.participants.filter(
        (participant) => participant.activePlatform !== null
    )

    for (let i = 1; i <= 5; i++) {
        const playerElement = document.getElementById(`player${i}`)
        const nicknameElement = playerElement?.querySelector('.nick')

        if (i <= activeParticipants.length) {
            const participant = activeParticipants[i - 1]
            const fullNickname = `${participant.game_name}#${participant.game_tag}`
            nicknameElement!.textContent = fullNickname
        } else {
            nicknameElement!.textContent = '---'
        }
    }
}

function createOPGGMultiSearchLink(names: string[]): string {
    return `https://www.op.gg/multisearch/eune?summoners=${names
        .map((name) => encodeURIComponent(name))
        .join(',')}`
}

function createUGGMultiSearchLink(names: string[]): string {
    return `https://u.gg/multisearch?summoners=${names
        .map((name) => encodeURIComponent(name))
        .join(',')}&region=eun1`
}

window.electronAPI.receive(
    'lobby-status',
    (lobbyData: { participants: Participant[] } | null) => {
        updateLobby(lobbyData)
    }
)

document
    .getElementById('generateOPGGLinksBtn')
    ?.addEventListener('click', () => {
        window.electronAPI.receive(
            'lobby-status',
            (lobbyData: { participants: Participant[] } | null) => {
                if (lobbyData) {
                    const summonerNames = lobbyData.participants.map(
                        (p) => `${p.game_name}#${p.game_tag}`
                    )
                    const opggMultiLink =
                        createOPGGMultiSearchLink(summonerNames)
                    window.electronAPI.openLink(opggMultiLink)
                }
            }
        )
    })

document
    .getElementById('generateUGGLinksBtn')
    ?.addEventListener('click', () => {
        window.electronAPI.receive(
            'lobby-status',
            (lobbyData: { participants: Participant[] } | null) => {
                if (lobbyData) {
                    const summonerNames = lobbyData.participants.map(
                        (p) => `${p.game_name}#${p.game_tag}`
                    )
                    const uggMultiLink = createUGGMultiSearchLink(summonerNames)
                    window.electronAPI.openLink(uggMultiLink)
                }
            }
        )
    })
