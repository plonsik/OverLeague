import { BrowserWindow } from "electron";

export const fetchPlayerOverallData = async (url: string) => {
  const hiddenWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  try {
    await hiddenWindow.loadURL(url);

    const selector = "pre";
    const pollForElement = async (
      selector: string,
      tries = 10,
      interval = 500,
    ) => {
      for (let i = 0; i < tries; i++) {
        const result = await hiddenWindow.webContents.executeJavaScript(
          `document.querySelector("${selector}") !== null`,
        );
        if (result) return;
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
      throw new Error(
        `Element '${selector}' not found within the specified time.`,
      );
    };

    await pollForElement(selector);
    const result = await hiddenWindow.webContents.executeJavaScript(
      'document.querySelector("pre").innerText',
    );
    const jsonData = JSON.parse(result);

    let extractedStats = {
      matchesPlayed: "N/A",
      wins: "N/A",
      losses: "N/A",
      kad: "N/A",
      kda: "N/A",
      tier: "N/A",
      leaguePoints: "N/A",
    };

    const segment = jsonData.data.segments.find((segment: { attributes: {}; }) => {
      const attributes = segment.attributes as { queueType?: string; season?: string } || {};
      return (
        attributes.queueType === "RANKED_SOLO_5x5" &&
        attributes.season === "2024-01-09T22:00:00+00:00"
      );
    });
    if (segment) {
      extractedStats.matchesPlayed =
        segment.stats.matchesPlayed?.value ?? "N/A";
      extractedStats.wins = segment.stats.wins.value ?? "N/A";
      extractedStats.losses = segment.stats.losses.value ?? "N/A";
      extractedStats.kad = segment.stats.kad.value ?? "N/A";
      extractedStats.kda = segment.stats.kda.value ?? "N/A";
      extractedStats.tier = segment.stats.tier.displayValue ?? "N/A";
      extractedStats.leaguePoints = segment.stats.leaguePoints.value ?? "N/A";
    }
    return extractedStats;
  } catch (error) {
    console.error("Error:", error.message);
    return {
      matchesPlayed: "N/A",
      wins: "N/A",
      losses: "N/A",
      kad: "N/A",
      kda: "N/A",
      tier: "N/A",
      leaguePoints: "N/A",
    };
  } finally {
    hiddenWindow.close();
  }
};
