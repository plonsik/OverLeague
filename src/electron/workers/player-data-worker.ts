import { parentPort } from "worker_threads";
import axios from "axios";

async function fetchPlayerData(playersData: any) {
  return Promise.all(
    playersData.map(async ({ game_name, region }: any) => {
      const urlsToCapture = [
        `https://api.tracker.gg/api/v2/lol/standard/profile/riot/${game_name}/segments/role?region=${region}&playlist=RANKED_SOLO_5x5&season=2024-01-09T22%3A00%3A00%2B00%3A00`,
        `https://api.tracker.gg/api/v2/lol/standard/profile/riot/${game_name}/segments/champion?region=${region}&queueType=RANKED_SOLO_5x5&season=2024-01-09T22%3A00%3A00%2B00%3A00&role=ALL`,
        `https://api.tracker.gg/api/v2/lol/standard/profile/riot/${game_name}?region=${region}&forceCollect=true`,
        `https://api.tracker.gg/api/v2/lol/standard/matches/riot/${game_name}?region=${region}&forceCollect=true&type=&season=2024-01-09T22%3A00%3A00%2B00%3A00&playlist=RANKED_SOLO_5x5`,
      ];

      const responses = await Promise.all(
        urlsToCapture.map((url) =>
          axios.get(url).then((response) => response.data),
        ),
      );
      return { game_name, data: responses };
    }),
  );
}

parentPort.on("message", async (playersData) => {
  try {
    const playersInfo = await fetchPlayerData(playersData);

    parentPort.postMessage({ success: true, data: playersInfo });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
});
