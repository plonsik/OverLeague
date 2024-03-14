import "./styles/fonts.css";
import "./styles/tailwind.css";

import * as ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { WaitingForLobby } from "./routes/wating-for-lobby";
import { LobbyView } from "./routes/lobby-view";

export const pageVariants = {
  initial: {
    opacity: 0,
    transition: {duration:0.5}
  },
  in: {
    opacity: 1,
    transition: { duration: 2 } // Duration of 2 seconds
  },
  out: {
    opacity: 0,
    transition: { duration: 2 } // Duration of 2 seconds
  }
};

const container = document.getElementById("main");

const router = createBrowserRouter([
  {
    path: "/",
    element: <WaitingForLobby />,
  },
  {
    path: "/lobby-view",
    element: <LobbyView />,
  },
]);

ReactDOM.createRoot(container).render(
  <AnimatePresence>
    <RouterProvider router={router} />
  </AnimatePresence>
);
