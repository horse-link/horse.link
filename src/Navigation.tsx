import { Router, Route, Switch, Redirect } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard_Logic";
import HorseRace from "./pages/HorseRace/HorseRace_Logic";
import Market from "./pages/Market/Market_Logic";
import VaultList from "./pages/VaultList/VaultList_Logic";
import Bets from "./pages/Bets/Bets_Logic";
import { FaucetPage } from "./pages/Faucet";
import { HlTokenPage } from "./pages/HLToken/HLToken_View";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const Navigation = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/dashboard" component={Dashboard} exact />
        {/* <Route path="/results" omponent={<Results />} /> */}
        <Route path="/vaults" component={VaultList} exact />
        <Route path="/markets" component={Market} exact />
        <Route path="/tokens" component={HlTokenPage} exact />
        <Route path="/history" component={Bets} exact />
        <Route path="/horses/:track/:number" component={HorseRace} exact />
        <Route path="/faucet" component={FaucetPage} exact />
        <Route path="*" component={() => <Redirect to="/Dashboard" />} exact />
      </Switch>
    </Router>
  );
};

export default Navigation;
