import { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import PageLayoutView from "./PayLayout_View";

type Props = {
  requiresAuth: boolean;
  children: React.ReactNode;
};

const PageLayout: React.FC<Props> = props => {
  const { user, loading: loadingAuth } = useAuth();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (props.requiresAuth && !user && !loadingAuth) {
      history.push("/login");
    }
  }, [user, loadingAuth, props.requiresAuth]);

  return (
    <PageLayoutView loading={false} user={user} currentPath={location.pathname}>
      {props.children}
    </PageLayoutView>
  );
};

export default PageLayout;
