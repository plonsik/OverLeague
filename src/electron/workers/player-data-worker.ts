import { parentPort } from "worker_threads";
import axios from "axios";

parentPort.on("message", async ({ participantData, region }) => {
  try {
    const { game_name, game_tag } = participantData;
    const apiUrl = await getUserApiUrl(region, game_name, game_tag);

    parentPort.postMessage({ success: true, data: apiUrl });
  } catch (error) {
    parentPort.postMessage({ success: false, data: participantData.cid });
  }
});

const getUserApiUrl = async (
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
    const finalUrl = response.request.res.responseUrl;
    const urlWithoutParams = finalUrl.split("?")[0];
    const urlSegments = urlWithoutParams.split("/");
    const correctedGameName = urlSegments[urlSegments.length - 2];
    return `https://api.tracker.gg/api/v2/lol/standard/profile/riot/${correctedGameName}?region=${region}&forceCollect=true`;
  } catch (error) {
    console.error("Error creating user api url:", error);
  }
};
