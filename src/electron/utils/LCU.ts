import os from "os";
import findProcesses from "find-process";

export type LCUArguments = {
  auth_token: string;
  app_port: string;
  region: string;
  riotclient_auth_token: string;
  riotclient_app_port: string;
};

export const getLCUName = () => {
  const platform = os.platform();

  if (platform !== "win32" && platform !== "darwin" && platform !== "linux") {
    throw new Error("Unsupported platform");
  }

  return platform === "win32" ? "LeagueClientUx.exe" : "LeagueClientUx";
};

export const getLCUCmd = async (): Promise<string | undefined> => {
  const LCUName = getLCUName();

  const processes = await findProcesses("name", LCUName);

  return processes.find((process) => process.name === LCUName)?.cmd;
};

export const getLCUArguments = async (LCUCmd: string): Promise<LCUArguments> => {
  const argsRegex = /"[^"]+"|\S+/g;
  const LCUArguments = Object.fromEntries(
    LCUCmd.match(argsRegex)
      .map((argument) => argument.replace(/^"|"$/g, ""))
      .map((argument) => argument.split("="))
  );

  return {
    auth_token: LCUArguments["--remoting-auth-token"],
    app_port: LCUArguments["--app-port"],
    region: LCUArguments["--region"],
    riotclient_auth_token: LCUArguments["--riotclient-auth-token"],
    riotclient_app_port: LCUArguments["--riotclient-app-port"],
  };
};
