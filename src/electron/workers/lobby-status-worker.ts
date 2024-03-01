import { parentPort } from "worker_threads";
import {
  getChampSelectSession,
  getGameMode,
  getLobbyParticipants,
} from "../utils/requests";
import { LCUArguments, Participant } from "../../types";
import { getQueueDescription } from "../utils/queue-info";

if (parentPort) {
  let processedParticipants = new Set();

  parentPort.on("message", async (LCUArguments: LCUArguments) => {
    try {
      const champSelectSession = await getChampSelectSession(LCUArguments);
      if (!champSelectSession || champSelectSession.errorCode) {
        parentPort.postMessage({ champSelectEnded: true });
        return;
      }

      const gameMode = await getGameMode(LCUArguments);
      const queueDescription = await getQueueDescription(gameMode);
      const lobbyParticipants = await getLobbyParticipants(LCUArguments);

      const newParticipants = lobbyParticipants.filter(
        (participant: Participant) =>
          !processedParticipants.has(participant.cid),
      );

      if (newParticipants.length > 0) {
        newParticipants.forEach((participant: Participant) =>
          processedParticipants.add(participant.cid),
        );

        const participantsData = lobbyParticipants.map(
          (participant: Participant) => {
            return [
              participant.game_name,
              participant.game_tag,
              participant.region,
              participant.name,
            ];
          },
        );

        parentPort.postMessage({
          success: true,
          data: {
            queueDescription,
            participantsData,
          },
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      parentPort.postMessage({ success: false, error: message });
    }
  });
} else {
  console.error("Worker thread failed to initialize: parentPort is null.");
}
