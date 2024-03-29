import { ipcMain, shell } from "electron";

export function setupIpcHandlers() {
  ipcMain.handle("openLink", async (_, url) => {
    try {
      await shell.openExternal(url);
    } catch (error) {
      console.error("Failed to open external link:", error);
    }
  });

  // ipcMain.handle('quitTeamBuilderDraft', async (_) => {
  //     try {
  //         const LCUArguments = retrieveLCUArguments()
  //         if (LCUArguments == null) {
  //             console.log('LCUArguments are null')
  //         } else {
  //             const lol = await quitTeamBuilderDraft(LCUArguments)
  //             console.log(lol)
  //         }
  //     } catch (error) {
  //         console.error('Error handling quit-team-builder-draft:', error)
  //     }
  // })

  // ipcMain.handle('scrapePlayersData', async (_, uniquePlayers) => {
  //     console.log('Received nicks:', uniquePlayers)
  //     return await scrapePlayersData(uniquePlayers)
  // })
}
