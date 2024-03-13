import koffi from "koffi";

export const user32 = koffi.load("user32.dll");

export const findWindowHWND = user32.func("FindWindowA", "int", ["str", "str"]);
export const getCurrentForegroundHWND = user32.func(
  "GetForegroundWindow",
  "int",
  []
);
