import { parentPort } from "worker_threads";
import axios from "axios";

parentPort.on("message", async ({ participantData, region }) => {
  try {
    console.log(`Processing participant: ${participantData.game_name}`);
    const { game_name, game_tag } = participantData;

    const stats = await fetchUserStatistics(region, game_name, game_tag);

    const result = { ...participantData, processed: true };

    parentPort.postMessage({ success: true, data: result });
  } catch (error) {
    parentPort.postMessage({ success: false, data: participantData.cid });
  }
});

const fetchUserStatistics = async (
  region: string,
  gameName: string,
  gameTag: string,
) => {
  try {
    const url = `https://tracker.gg/lol/profile/riot/${region}/${encodeURIComponent(
      gameName,
    )}%23${encodeURIComponent(gameTag)}/overview?RANKED_SOLO_5x5`;

    const response = await axios.get(url, {
      params: {
        playlist: "",
      },
    });
    console.log("chuj");
    const finalUrl = response.request.res.responseUrl;
    const urlWithoutParams = finalUrl.split("?")[0];
    const urlSegments = urlWithoutParams.split("/");
    const correctedGameName = urlSegments[urlSegments.length - 2];
    const apiUrl = `https://api.tracker.gg/api/v2/lol/standard/profile/riot/${correctedGameName}?region=${region}&forceCollect=true`;
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    throw error;
  }
};
