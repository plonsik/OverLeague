import { Worker } from "worker_threads";
import { LCUArguments } from "../types";
import { BrowserWindow } from "electron";

export const startLobbyStatusChecks = (
  LCUArguments: LCUArguments,
  overlayWindow: BrowserWindow | null = null,
) => {
  const worker = new Worker("./src/workers/lobby-status-worker.ts");

  worker.on("message", (message: any) => {
    if (message.success && overlayWindow) {
      console.log(message.lobbyData);
      overlayWindow.webContents.send("lobby-status", message.lobbyData);

      if (message.lobbyData !== null && !overlayWindow.isVisible()) {
        overlayWindow.show();
      }
    }
  });

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
