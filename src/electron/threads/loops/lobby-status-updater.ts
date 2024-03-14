import {
  checkChampionSelectionSession,
  getGameMode,
  getLobbyParticipants,
} from "../../utils/league-lobby";
import { UPDATE_LOBBY_STATUS_LOOP_INTERVAL } from "../../main";
import { LCUArguments } from "../../utils/lcu";
import { BrowserWindow } from "electron";
import { sendToChannel } from "../../utils/channel";

type LobbyStatusLoopParams = {
  LCUArguments: LCUArguments;
  overlayWindow: BrowserWindow;
};

type LobbyStatusLoop = NodeJS.Timeout | null;

export const startLobbyStatusUpdater = ({
  LCUArguments,
  overlayWindow,
}: LobbyStatusLoopParams) => {
  let wasInChampionSelection = false;

  const currentParticipants: Record<string, Participant> = {};

  let lobbyStatusIntervalId: LobbyStatusLoop = setInterval(async () => {
    const isInChampionSelection = await checkChampionSelectionSession(
      LCUArguments
    );

    if (!isInChampionSelection && !wasInChampionSelection) return;
    if (!isInChampionSelection && wasInChampionSelection) {
      console.log("Is not in champion selection");

      sendToChannel<LobbyStatusPayload>(overlayWindow, "lobby-status", false);

      Object.keys(currentParticipants).forEach(
        (key) => delete currentParticipants[key]
      );

      wasInChampionSelection = false;

      return;
    }

    if (isInChampionSelection && !wasInChampionSelection) {
      console.log("Is in champion selection");

      const gameMode: string | undefined = await getGameMode(LCUArguments);

      sendToChannel<LobbyStatusPayload>(overlayWindow, "lobby-status", true);
      sendToChannel<GameModePayload>(overlayWindow, "gamemode", gameMode);
    }

    const currentLobbyParticipants = await getLobbyParticipants(LCUArguments);

    currentLobbyParticipants.forEach(({ gameName, gameTag }) => {
      const key = `${gameName}#${gameTag}`;

      if (!currentParticipants[key]) {
        currentParticipants[key] = { gameName, gameTag };
        console.log("New participant", gameName, gameTag);
      }
    });

    Object.values(currentParticipants).forEach(({ gameName, gameTag }) => {
      const isAlreadyInLobby = currentLobbyParticipants.find((participant) => {
        return (
          participant.gameName === gameName && participant.gameTag === gameTag
        );
      });

      if (!isAlreadyInLobby) {
        const key = `${gameName}#${gameTag}`;

        console.log("Participant left", gameName, gameTag);

        delete currentParticipants[key];
      }
    });

    sendToChannel<ParticipantsPayload>(
      overlayWindow,
      "participants",
      Object.values(currentParticipants)
    );

    wasInChampionSelection = true;
  }, UPDATE_LOBBY_STATUS_LOOP_INTERVAL);

  return lobbyStatusIntervalId;
};
