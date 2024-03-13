import https from "https";
import { LCUArguments, Participant } from "../../types";

const CONTENT_TYPE_JSON = "application/json";
const LCU_BASE_URL = "https://127.0.0.1";

function getAuthorizationToken(authToken: string): string {
  return `Basic ${Buffer.from(`riot:${authToken}`).toString("base64")}`;
}

function createHeaders(authToken: string): Record<string, string> {
  return {
    "Content-Type": `${CONTENT_TYPE_JSON}; charset=utf-8`,
    Accept: CONTENT_TYPE_JSON,
    Authorization: getAuthorizationToken(authToken),
  };
}

function httpsRequest(
  url: string,
  method: "GET" | "POST",
  headers: Record<string, string>,
  body?: any,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      method,
      headers,
      rejectUnauthorized: false,
    };

    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });

    req.on("error", reject);

    if (method === "POST" && body) req.write(JSON.stringify(body));
    req.end();
  });
}

export async function getChampSelectSession(LCUArguments: LCUArguments) {
  const url = `${LCU_BASE_URL}:${LCUArguments.app_port}/lol-champ-select/v1/session`;
  const headers = createHeaders(LCUArguments.auth_token);

  try {
    const responseText = await httpsRequest(url, "GET", headers);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error getting champion select session:", error);
  }
}

export async function getGameMode(LCUArguments: LCUArguments): Promise<number> {
  const url = `${LCU_BASE_URL}:${LCUArguments.app_port}/lol-lobby/v1/parties/gamemode`;
  const headers = createHeaders(LCUArguments.auth_token);

  try {
    const responseText = await httpsRequest(url, "GET", headers);
    const gameMode = JSON.parse(responseText);
    if (gameMode && gameMode.queueId != null) {
      return gameMode.queueId;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting game mode:", error);
  }
}

export async function getRegion(
  LCUArguments: LCUArguments,
): Promise<{ region: string; webRegion: string }> {
  const url = `${LCU_BASE_URL}:${LCUArguments.app_port}/riotclient/region-locale`;
  const headers = createHeaders(LCUArguments.auth_token);

  try {
    const responseText = await httpsRequest(url, "GET", headers);
    const regionLocale = JSON.parse(responseText);
    if (regionLocale && regionLocale.region) {
      return {
        region: regionLocale.region,
        webRegion: regionLocale.webRegion,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting game mode:", error);
  }
}

export async function getLobbyParticipants(LCUArguments: LCUArguments) {
  const url = `${LCU_BASE_URL}:${LCUArguments.riotclient_app_port}/chat/v5/participants`;
  const headers = createHeaders(LCUArguments.riotclient_auth_token);

  try {
    const responseText = await httpsRequest(url, "GET", headers);
    const participantsData = JSON.parse(responseText);

    return participantsData.participants.filter((participant: Participant) =>
      participant.cid.includes("lol-champ-select"),
    );
  } catch (error) {
    console.error("Error getting lobby participants:", error);
  }
}

// export async function quitTeamBuilderDraft(LCUArguments: LCUArguments) {
//   const lcu_api = `https://127.0.0.1:${LCUArguments.app_port}`;
//   const lcu_session_token = Buffer.from(
//     `riot:${LCUArguments.auth_token}`,
//   ).toString("base64");
//
//   const lcu_headers = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     Authorization: `Basic ${lcu_session_token}`,
//   };
//
//   const url = `${lcu_api}/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=["","teambuilder-draft","quitV2",""]`;
//
//   try {
//     const response = await httpsRequest(url, "POST", lcu_headers, "");
//     console.log(response);
//     return JSON.parse(response);
//   } catch (error) {
//     console.error("Error quitting Team Builder Draft:", error);
//   }
// }
