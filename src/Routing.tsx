import { lazy } from "react";
import Dashboard from "./pages/Dashboard";
import { AppRoutes, NavbarRoutes } from "./types/app";

// lazy load pages
const Bets = lazy(() => import("./pages/Bets"));
const Markets = lazy(() => import("./pages/Markets"));
const Races = lazy(() => import("./pages/Races"));
const Tokens = lazy(() => import("./pages/Tokens"));
const Vaults = lazy(() => import("./pages/Vaults"));
const Faucet = lazy(() => import("./pages/Faucet"));
const Results = lazy(() => import("./pages/Results"));
const Verify = lazy(() => import("./pages/Verify"));
const Register = lazy(() => import("./pages/Register"));

// app routing
const Routing: AppRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/verify",
    element: <Verify />
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
    path: "/bets",
    element: <Bets />
  },
  {
    path: "/bets/:owner",
    element: <Bets />
  }
];

// custom navbar routing
export const NavbarRouting: NavbarRoutes = [
  {
    name: "Dashboard",
    path: "/dashboard"
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
    name: "Bets",
    path: "/bets"
  },
  {
    name: "Faucet",
    path: "/faucet"
  }
];

export default Routing;
