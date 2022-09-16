import { Route, Routes, Navigate, HashRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import Back from "./pages/Back/Back_Logic";
import Dashboard from "./pages/Dashboard/Dashboard_Logic";
import HorseRace from "./pages/HorseRace/HorseRace_Logic";
// import Results from "./pages/Results/Results_Logic";
import Vaults from "./pages/Vaults/Vaults_Logic";

export const history = createBrowserHistory();

const Navigation = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/results" element={<Results />} /> */}
        <Route path="/vaults" element={<Vaults />} />
        <Route path="/horses/:track/:number" element={<HorseRace />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/back/:propositionId" element={<Back />} />
      </Routes>
    </HashRouter>
  );
};

export default Navigation;
