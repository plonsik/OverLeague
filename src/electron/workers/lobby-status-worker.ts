import { parentPort } from "worker_threads";
import {
  getChampSelectSession,
  getGameMode,
  getLobbyParticipants,
  getRegion,
} from "../utils/requests";
import { LCUArguments, Participant } from "../../types";
import { getQueueDescription } from "../utils/queue-info";
import { startPlayerDataWorker } from "../managers/worker-manager";

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
      const region = await getRegion(LCUArguments);
      const participantsData = lobbyParticipants.map(
        (participant: Participant) => [
          participant.game_name,
          participant.game_tag,
          participant.region,
          participant.name,
        ],
      );

      const newParticipants = lobbyParticipants.filter(
        (participant: Participant) =>
          !processedParticipants.has(participant.cid),
      );

      if (newParticipants.length > 0) {
        newParticipants.forEach((participant: Participant) =>
          processedParticipants.add(participant.cid),
        );

        parentPort.postMessage({
          success: true,
          data: {
            queueDescription,
            participantsData,
          },
        });

        newParticipants.forEach((participant: Participant) => {
          startPlayerDataWorker(participant, region.region);
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
} else {
  console.error("Worker thread failed to initialize: parentPort is null.");
}
