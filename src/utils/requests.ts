import https from "https";
import { LCUArguments } from "../types";

function httpsGet(
  url: string,
  headers: Record<string, string>,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      headers: headers,
      rejectUnauthorized: false,
    };

    https
      .get(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (e) => {
        reject(e);
      });
  });
}

export async function getCurrentSummoner(
  lcuArguments: LCUArguments,
): Promise<{ gameName: string; tagLine: string }> {
  const lcu_api = `https://127.0.0.1:${lcuArguments.app_port}`;
  const lcu_session_token = Buffer.from(
    `riot:${lcuArguments.auth_token}`,
  ).toString("base64");

  const lcu_headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Basic ${lcu_session_token}`,
  };

  const get_current_summoner = `${lcu_api}/lol-summoner/v1/current-summoner`;

  try {
    const response = await httpsGet(get_current_summoner, lcu_headers);
    const summonerInfo = JSON.parse(response);
    return {
      gameName: summonerInfo.gameName,
      tagLine: summonerInfo.tagLine,
    };
  } catch (error) {
    console.error("Error fetching current summoner:", error);
    throw error;
  }
}

export async function checkForLobby(lcuArguments: LCUArguments): Promise<void> {
  const lcu_api = `https://127.0.0.1:${lcuArguments.app_port}`;
  const riotclient_api = `https://127.0.0.1:${lcuArguments.riotclient_app_port}`;

  const lcu_session_token = Buffer.from(
    `riot:${lcuArguments.auth_token}`,
  ).toString("base64");
  const riotclient_session_token = Buffer.from(
    `riot:${lcuArguments.riotclient_auth_token}`,
  ).toString("base64");

  const lcu_headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Basic ${lcu_session_token}`,
  };

  const riotclient_headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "LeagueOfLegendsClient",
    Authorization: `Basic ${riotclient_session_token}`,
  };

  let checkForLobby = true;
  let showNotInChampSelect = true;

  while (true) {
    try {
      const getChampSelect = `${lcu_api}/lol-champ-select/v1/session`;
      const champSelectResponseText = await httpsGet(
        getChampSelect,
        lcu_headers,
      );
      const champSelectResponse = JSON.parse(champSelectResponseText);

      if ("errorCode" in champSelectResponse) {
        if (showNotInChampSelect) {
          console.log("Not in champ select. Waiting for game...");
          showNotInChampSelect = false;
        }
      } else {
        if (checkForLobby) {
          console.clear();
          console.log("\n* Found lobby. *\n");
          checkForLobby = false;
        }

        const getLobby = `${riotclient_api}/chat/v5/participants`;
        const lobbyResponse = await httpsGet(getLobby, riotclient_headers);

        console.log(lobbyResponse);
        return;
      }
    } catch (error) {
      console.error("Error checking lobby or getting lobby details:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
