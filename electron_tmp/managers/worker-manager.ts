import { Worker } from "worker_threads";
import { LCUArguments, LobbyStatusData, Participant } from "../../types";
import { BrowserWindow } from "electron";
import path from "path";
import { fetchPlayerOverallData } from "../utils/player-data-util";

export const startLobbyStatusWorker = (
  LCUArguments: LCUArguments,
  overlayWindow: BrowserWindow | null = null,
) => {
  const worker = new Worker(path.join(__dirname, "./lobby-status-worker.js"));
  let isInChampSelect = false;

  worker.on(
    "message",
    (message: {
      champSelectEnded?: boolean;
      success?: boolean;
      data?: LobbyStatusData;
      participant: Participant;
      region: any;
    }) => {
      if (message.champSelectEnded && isInChampSelect && overlayWindow) {
        console.log("null");
        overlayWindow.webContents.send("lobby-status", null);
        isInChampSelect = false;
      } else if (message.success && !isInChampSelect && overlayWindow) {
        console.log("champ select");
        overlayWindow.webContents.send("lobby-status", message.data);
        isInChampSelect = true;
        console.log(message.data);
      } else if (message.participant && message.region) {
        startPlayerDataWorker(
          message.participant,
          message.region.region,
          overlayWindow,
        );
      }
    },
  );

  worker.on("error", (error: Error) => {
    console.error("Worker error:", error);
  });

  worker.on("exit", (code: number) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });

  const intervalId = setInterval(() => {
    worker.postMessage(LCUArguments);
  }, 1000);

  return function stopLobbyStatusWorker() {
    clearInterval(intervalId);
    worker.terminate().then((_) => console.log("Lobby status worker stopped."));
  };
};

export const startPlayerDataWorker = (
  participantData: Participant,
  region: string,
  overlayWindow: Electron.CrossProcessExports.BrowserWindow | null = null,
) => {
  const worker = new Worker(path.join(__dirname, "./player-data-worker.js"));

  worker.on("message", (message) => {
    if (message.success && overlayWindow) {
      fetchPlayerOverallData(message.data).then((extractedStats) => {
        overlayWindow.webContents.send(
          "player-processed",
          extractedStats,
          participantData,
        );
      });
    } else if (!message.success) {
      console.error("Error processing player:", message.error);
    }
  });

  worker.on("error", (error) => {
    console.error("Player data worker error:", error);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      console.error(
        `Player data worker stopped unexpectedly with exit code ${code}`,
      );
    } else {
      console.log("Player data worker completed successfully and exited.");
    }
  });

  worker.postMessage({ participantData, region });
};
