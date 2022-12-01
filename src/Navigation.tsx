import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard_Logic";
import { FaucetPage } from "./pages/Faucet";
import { HlTokenPage } from "./pages/HLToken/HLToken_View";
import Bets from "./pages/Bets";
import Race from "./pages/Race";
import Vaults from "./pages/Vaults";
import Markets from "./pages/Markets";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/results" omponent={<Results />} /> */}
        <Route path="/vaults" element={<Vaults />} />
        <Route path="/markets" element={<Markets />} />
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
