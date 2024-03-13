import "./styles/fonts.css";
import "./styles/tailwind.css";

import * as ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { WaitingForLobby } from "./routes/wating-for-lobby";
import { LobbyView } from "./routes/lobby-view";

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

ReactDOM.createRoot(container).render(<RouterProvider router={router} />);
