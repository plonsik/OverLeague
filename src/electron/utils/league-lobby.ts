import type { LCUArguments } from "./lcu";
import axios from "axios";
import https from "https";

export type Participant = {
  activePlatform: string | null;
  cid: string;
  game_name: string;
  game_tag: string;
  muted: boolean;
  name: string;
  pid: string;
  puuid: string;
  region: string;
};

export interface Queue {
  queueId: number;
  description: string | null;
}

const LCU_BASE_URL = "https://127.0.0.1";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const queues: Queue[] = [
  { queueId: 0, description: "Custom game" },
  { queueId: 2, description: "5v5 Blind Pick" },
  { queueId: 4, description: "5v5 Ranked Solo" },
  { queueId: 6, description: "5v5 Ranked Premade" },
  { queueId: 7, description: "Co-op vs AI" },
  { queueId: 14, description: "5v5 Draft Pick" },
  { queueId: 16, description: "5v5 Dominion Blind Pick" },
  { queueId: 17, description: "5v5 Dominion Draft Pick" },
  { queueId: 25, description: "Dominion Co-op vs AI" },
  { queueId: 31, description: "Co-op vs AI Intro Bot" },
  { queueId: 32, description: "Co-op vs AI Beginner Bot" },
  { queueId: 33, description: "Co-op vs AI Intermediate Bot" },
  { queueId: 42, description: "5v5 Ranked Team games" },
  { queueId: 52, description: "Co-op vs AI" },
  { queueId: 61, description: "5v5 Team Builder" },
  { queueId: 65, description: "5v5 ARAM" },
  { queueId: 67, description: "ARAM Co-op vs AI" },
  { queueId: 70, description: "One for All" },
  { queueId: 72, description: "1v1 Snowdown Showdown" },
  { queueId: 73, description: "2v2 Snowdown Showdown" },
  { queueId: 75, description: "6v6 Hexakill" },
  { queueId: 76, description: "Ultra Rapid Fire" },
  { queueId: 78, description: "One For All: Mirror Mode" },
  { queueId: 83, description: "Co-op vs AI Ultra Rapid Fire" },
  { queueId: 91, description: "Doom Bots Rank 1" },
  { queueId: 92, description: "Doom Bots Rank 2" },
  { queueId: 93, description: "Doom Bots Rank 5" },
  { queueId: 96, description: "Ascension" },
  { queueId: 98, description: "6v6 Hexakill" },
  { queueId: 100, description: "5v5 ARAM" },
  { queueId: 300, description: "Legend of the Poro King" },
  { queueId: 310, description: "Nemesis" },
  { queueId: 313, description: "Black Market Brawlers" },
  { queueId: 315, description: "Nexus Siege" },
  { queueId: 317, description: "Definitely Not Dominion" },
  { queueId: 318, description: "ARURF" },
  { queueId: 325, description: "All Random" },
  { queueId: 400, description: "5v5 Draft Pick" },
  { queueId: 410, description: "5v5 Ranked Dynamic" },
  { queueId: 420, description: "5v5 Ranked Solo" },
  { queueId: 430, description: "5v5 Blind Pick" },
  { queueId: 440, description: "5v5 Ranked Flex" },
  { queueId: 450, description: "5v5 ARAM" },
  { queueId: 490, description: "Normal (Quickplay)" },
  { queueId: 600, description: "Blood Hunt Assassin" },
  { queueId: 610, description: "Dark Star: Singularity" },
  { queueId: 700, description: "Summoner's Rift Clash" },
  { queueId: 720, description: "ARAM Clash" },
  { queueId: 800, description: "Co-op vs. AI Intermediate Bot" },
  { queueId: 810, description: "Co-op vs. AI Intro Bot" },
  { queueId: 820, description: "Co-op vs. AI Beginner Bot" },
  { queueId: 830, description: "Co-op vs. AI Intro Bot" },
  { queueId: 840, description: "Co-op vs. AI Beginner Bot" },
  { queueId: 850, description: "Co-op vs. AI Intermediate Bot" },
  { queueId: 900, description: "ARURF" },
  { queueId: 910, description: "Ascension" },
  { queueId: 920, description: "Legend of the Poro King" },
  { queueId: 940, description: "Nexus Siege" },
  { queueId: 950, description: "Doom Bots Voting" },
  { queueId: 960, description: "Doom Bots Standard" },
  { queueId: 980, description: "Star Guardian Invasion: Normal" },
  { queueId: 990, description: "Star Guardian Invasion: Onslaught" },
  { queueId: 1000, description: "PROJECT: Hunters" },
  { queueId: 1010, description: "Snow ARURF" },
  { queueId: 1020, description: "One for All" },
  { queueId: 1030, description: "Odyssey Extraction: Intro" },
  { queueId: 1040, description: "Odyssey Extraction: Cadet" },
  { queueId: 1050, description: "Odyssey Extraction: Crewmember" },
  { queueId: 1060, description: "Odyssey Extraction: Captain" },
  { queueId: 1070, description: "Odyssey Extraction: Onslaught" },
  { queueId: 1090, description: "Teamfight Tactics" },
  { queueId: 1100, description: "Ranked Teamfight Tactics" },
  { queueId: 1110, description: "Teamfight Tactics Tutorial" },
  { queueId: 1111, description: "Teamfight Tactics" },
  { queueId: 1200, description: "Nexus Blitz games" },
  { queueId: 1300, description: "Nexus Blitz games" },
  { queueId: 1400, description: "Ultimate Spellbook" },
  { queueId: 1700, description: "Arena" },
  { queueId: 1900, description: "Pick URF" },
  { queueId: 2000, description: "Tutorial 1" },
  { queueId: 2010, description: "Tutorial 2" },
  { queueId: 2020, description: "Tutorial 3" },
];

export const checkChampionSelectionSession = async (
  LCUArguments: LCUArguments
) => {
  const response = await axios.get(
    `${LCU_BASE_URL}:${LCUArguments.app_port}/lol-champ-select/v1/session`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`riot:${LCUArguments.auth_token}`).toString("base64")}`,
      },
      httpsAgent,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    }
  );

  return !response.data.errorCode;
};

export const getQueueId = async (
  LCUArguments: LCUArguments
): Promise<number | undefined> => {
  const response = await axios.get(
    `${LCU_BASE_URL}:${LCUArguments.app_port}/lol-lobby/v1/parties/gamemode`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`riot:${LCUArguments.auth_token}`).toString("base64")}`,
      },
      httpsAgent,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    }
  );

  return response.data?.queueId;
};

export const getGameMode = async (
  LCUArguments: LCUArguments
): Promise<string | undefined> => {
  console.log("extrating gamemode");
  const queueId = await getQueueId(LCUArguments);

  const queue = queues.find((queue) => queue.queueId === queueId);

  return queue?.description;
};

export async function getLobbyParticipants(LCUArguments: LCUArguments) {
  const response = await axios.get(
    `${LCU_BASE_URL}:${LCUArguments.riotclient_app_port}/chat/v5/participants`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`riot:${LCUArguments.riotclient_auth_token}`).toString("base64")}`,
      },
      httpsAgent,
    }
  );

  return response.data.participants
    .filter((participant: Participant) =>
      participant.cid.includes("lol-champ-select")
    )
    .map((participant: Participant) => ({
      gameName: participant.game_name,
      gameTag: participant.game_tag,
    }));
}
