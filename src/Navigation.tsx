import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import useAuth from "./hooks/useAuth";
import Loader from "./components/Loader/Loader_View";
import NotFound from "./pages/NotFound/NotFound_View";
import Dashboard from "./pages/Dashboard/Dashboard_Logic";

export const history = createBrowserHistory();

const CatchAllRoute = ({ component, ...props }: any) => {
  const { user, loading } = useAuth();
  const Component = component;
  return (
    <Route
      {...props}
      render={() => {
        if (loading) return <Loader />;
        return user ? <Component /> : <Redirect to="/dashboard" />;
      }}
    />
  );
};

const Navigation = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/dashboard" component={Dashboard} exact />
        <CatchAllRoute path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default Navigation;
