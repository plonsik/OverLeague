/// <reference types="vite/client" />
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
