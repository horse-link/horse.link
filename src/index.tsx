import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-loading-skeleton/dist/skeleton.css";
import App from "./App";

const container = document.getElementById("root");

// eslint-disable-next-line
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
