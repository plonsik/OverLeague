import "./index.css";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

const root = ReactDOM.createRoot(document.body);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
