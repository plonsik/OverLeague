import { parentPort } from "worker_threads";
import {
  getChampSelectSession,
  getGameMode,
  getLobbyParticipants,
} from "../utils/requests";
import { LCUArguments } from "../types";

if (parentPort) {
  parentPort.on("message", async (LCUArguments: LCUArguments) => {
    try {
      const champSelectSession = await getChampSelectSession(LCUArguments);
      if (!champSelectSession || champSelectSession.errorCode) {
        parentPort.postMessage({ champSelectEnded: true });
        return;
      }

      const gameMode = await getGameMode(LCUArguments);
      const lobbyParticipants = await getLobbyParticipants(LCUArguments);

      parentPort.postMessage({
        success: true,
        data: {
          champSelectSession,
          gameMode,
          lobbyParticipants,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      parentPort.postMessage({ success: false, error: message });
    }
  });
} else {
  console.error("Worker thread failed to initialize: parentPort is null.");
}
