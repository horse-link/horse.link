import { lazy } from "react";
import constants from "./constants";
import Home from "./pages/Home";
import { AppRoutes, NavbarRoutes } from "./types/app";

// lazy load pages
const Bets = lazy(() => import("./pages/Bets"));
const Markets = lazy(() => import("./pages/Markets"));
const Races = lazy(() => import("./pages/Races"));
const Tokens = lazy(() => import("./pages/Tokens"));
const Vaults = lazy(() => import("./pages/Vaults"));
const Faucet = lazy(() => import("./pages/Faucet"));
const Results = lazy(() => import("./pages/Results"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));

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
    path: "/bets",
    element: <Bets />
  },
  {
    path: "/bets/:owner",
    element: <Bets />
  },
  {
    path: "/wallet",
    element: <Wallet />
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />
  }
];

// custom navbar routing
const _NavbarRouting: NavbarRoutes = [
  {
    name: "Home",
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
    name: "Bets",
    path: "/bets"
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

const injectOptionalNavbarRoute = (nbr: NavbarRoutes) => {
  if (constants.env.WALLET_NAV_ACTIVE === "true") {
    nbr.push({
      name: "Wallet",
      path: "/wallet"
    });
  }
  return nbr;
};

export const NavbarRouting = injectOptionalNavbarRoute(_NavbarRouting);

export default Routing;
