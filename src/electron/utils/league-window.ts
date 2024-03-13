import koffi from "koffi";
import { findWindowHWND, user32 } from "./koffi";

export type LeagueWindowHWND = number | null | undefined;

export type WindowDimensions = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export let leagueWindowDimensionsRect: WindowDimensions = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

export const leagueWindowDimensionsPointer = koffi.pointer(
  "DimensionsPointer",
  koffi.struct("Dimensions", {
    left: "long",
    top: "long",
    right: "long",
    bottom: "long",
  })
);

export const getLeagueWindowHWND = () => {
  return findWindowHWND(null, "League of Legends");
};

export const getLeagueWindowDimensions = user32.func("GetWindowRect", "bool", [
  "int",
  koffi.out(leagueWindowDimensionsPointer),
]);

