import "./styles/fonts.css";
import "./styles/tailwind.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./route-types.gen";

const router = createRouter({ routeTree });

const container = document.getElementById("main");

if (container !== null) {
  const root = ReactDOM.createRoot(container);
  root.render(<RouterProvider router={router} />);
} else {
  console.error("Failed to find the root container");
}
