import AutoLaunch from "auto-launch";
import { app } from "electron";

export const electronAppLauncher = new AutoLaunch({
  name: "OverLeague",
  path: app.getPath("exe"),
});

export const enableAutoLaunch = async () => {
  await electronAppLauncher.enable();
};

export const disableAutoLaunch = async () => {
  await electronAppLauncher.disable();
};

export const isAutoLaunchEnabled = async () => {
  return await electronAppLauncher.isEnabled();
};
