import os from "os";

export const getLCUName = () => {
  const platform = os.platform();

  if (platform !== "win32" && platform !== "darwin" && platform !== "linux") {
    throw new Error("Unsupported platform");
  }

  return platform === "win32" ? "LeagueClientUx.exe" : "LeagueClientUx";
};
