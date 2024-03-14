import { useEffect } from "react";

export const useChannel = <T = any>(channel: Channel, handler: (data: T) => void) => {
  useEffect(() => {
    window.electronAPI.addListener(channel, handler);

    return () => {
      window.electronAPI.removeListener(channel, handler);
    };
  }, [channel, handler]);
};

