import { useEffect, useState } from "react";

export const useChannelData = <T = any>(channel: string, defaultState: T | null = null) => {
  const [data, setData] = useState<T | null>(defaultState);

  useEffect(() => {
    const handler = (newData: T) => {
      if (newData !== null) {
        setData(newData);
      }
    };

    window.electronAPI.addListener(channel, handler);

    return () => {
      window.electronAPI.removeListener(channel, handler);
    };
  }, [channel]);

  return data;
};
