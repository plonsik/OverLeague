import { parentPort } from "worker_threads";
import { checkForLobby } from "../utils/requests";
import { LCUArguments } from "../types";

if (parentPort) {
  parentPort.on("message", async (LCUArguments: LCUArguments) => {
    try {
      const lobbyData = await checkForLobby(LCUArguments);
      parentPort!.postMessage({ success: true, lobbyData });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      parentPort!.postMessage({ success: false, error: message });
    }
  });
} else {
  console.error("Worker thread failed to initialize: parentPort is null.");
}
