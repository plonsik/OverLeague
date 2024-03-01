import { Worker } from "worker_threads";
import { LCUArguments, LobbyStatusData } from "../../types";
import { BrowserWindow } from "electron";
import path from "path";

export const startLobbyStatusChecks = (
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

        // startPlayerDataWorker(LCUArguments, overlayWindow, message.data);
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

  setInterval(() => {
    worker.postMessage(LCUArguments);
  }, 1000);
};

const startPlayerDataWorker = (
  lcuArguments: LCUArguments,
  overlayWindow: BrowserWindow | null,
  data: LobbyStatusData,
) => {
  const worker = new Worker(path.join(__dirname, "./player-data-worker.js"));

  worker.on("message", (message: { data: LobbyStatusData }) => {
    if (overlayWindow) {
      overlayWindow.webContents.send("player-data", message.data);
    }
  });

  worker.on("error", (error: Error) => {
    console.error("Player Data Worker error:", error);
  });

  worker.on("exit", (code: number) => {
    if (code !== 0) {
      console.error(`Player Data Worker stopped with exit code ${code}`);
    }
  });

  worker.postMessage({ action: "processData", lcuArguments, data });
};
