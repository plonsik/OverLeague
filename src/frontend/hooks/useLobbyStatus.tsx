import { useEffect } from "react";
import { useNavigate, useMatches } from "react-router-dom";
import { useChannelData } from "./useChannelData";

export const useLobbyStatus = () => {
  const matches = useMatches();
  const isWaitingForLobby = matches[0].pathname === "/";

  const isInLobby = useChannelData<LobbyStatusPayload>(
    "lobby-status",
    !isWaitingForLobby
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isInLobby && isWaitingForLobby) {
      navigate("/lobby-view");
    }

    if (!isInLobby && !isWaitingForLobby) {
      navigate("/");
    }
  }, [isInLobby, isWaitingForLobby]);
};
