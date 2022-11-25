import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard_Logic";
import Market from "./pages/Market/Market_Logic";
import VaultList from "./pages/VaultList/VaultList_Logic";
import Bets from "./pages/Bets";
import Race from "./pages/Race";
import { FaucetPage } from "./pages/Faucet";
import { HlTokenPage } from "./pages/HLToken/HLToken_View";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/results" omponent={<Results />} /> */}
        <Route path="/vaults" element={<VaultList />} />
        <Route path="/markets" element={<Market />} />
        <Route path="/tokens" element={<HlTokenPage />} />
        <Route path="/history" element={<Bets />} />
        <Route path="/horses/:track/:number" element={<Race />} />
        <Route path="/faucet" element={<FaucetPage />} />
        <Route path="/bets" element={<Bets />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
