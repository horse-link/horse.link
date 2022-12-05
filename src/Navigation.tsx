import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import {
  Bets,
  Markets,
  Races,
  Tokens,
  Vaults,
  Faucet,
  Dashboard,
  Results
} from "./pages";

const Navigation: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/vaults" element={<Vaults />} />
      <Route path="/markets" element={<Markets />} />
      <Route path="/tokens" element={<Tokens />} />
      <Route path="/horses/:track/:number" element={<Races />} />
      <Route path="/results/:state/:propositionId" element={<Results />} />
      <Route path="/faucet" element={<Faucet />} />
      <Route path="/bets" element={<Bets />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);

export default Navigation;
