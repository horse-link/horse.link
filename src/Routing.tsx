import { lazy } from "react";
import Home from "./pages/Home";
import { AppRoutes, NavbarRoutes } from "./types/app";

// lazy load pages
const History = lazy(() => import("./pages/History"));
const Markets = lazy(() => import("./pages/Markets"));
const Races = lazy(() => import("./pages/Races"));
const Tokens = lazy(() => import("./pages/Tokens"));
const Vaults = lazy(() => import("./pages/Vaults"));
const Faucet = lazy(() => import("./pages/Faucet"));
const Results = lazy(() => import("./pages/Results"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const UnsupportedNetwork = lazy(() => import("./pages/UnsupportedNetwork"));

// app routing
const Routing: AppRoutes = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/vaults",
    element: <Vaults />
  },
  {
    path: "/markets",
    element: <Markets />
  },
  {
    path: "/tokens",
    element: <Tokens />
  },
  {
    path: "/races/:track/:number",
    element: <Races />
  },
  {
    path: "/results/:propositionId",
    element: <Results />
  },
  {
    path: "/faucet",
    element: <Faucet />
  },
  {
    path: "/history",
    element: <History />
  },
  {
    path: "/history/:owner",
    element: <History />
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />
  },
  {
    path: "/unsupported",
    element: <UnsupportedNetwork />
  }
];

export const NavbarRouting: NavbarRoutes = [
  {
    name: "Races",
    path: "/"
  },
  {
    name: "Vaults",
    path: "/vaults"
  },
  {
    name: "Markets",
    path: "/markets"
  },
  {
    name: "History",
    path: "/history"
  },
  {
    name: "Faucet",
    path: "/faucet"
  },
  {
    name: "Leaderboard",
    path: "/leaderboard"
  }
];

export default Routing;
