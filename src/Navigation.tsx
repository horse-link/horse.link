import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { createBrowserHistory } from "history";
import Dashboard from "./pages/Dashboard/Dashboard_Logic";
import HorseRace from "./pages/HorseRace/HorseRace_Logic";
import Pools from "./pages/Pools/Pools_Logic";

export const history = createBrowserHistory();

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/horses/:name/:id" element={<HorseRace />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
