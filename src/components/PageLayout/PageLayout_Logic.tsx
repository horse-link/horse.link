import { useLocation } from "react-router";
import PageLayoutView from "./PayLayout_View";

type Props = {
  requiresAuth: boolean;
  children: React.ReactNode;
};

const PageLayout: React.FC<Props> = props => {
  const location = useLocation();


  return (
    <PageLayoutView loading={false} currentPath={location.pathname}>
      {props.children}
    </PageLayoutView>
  );
};

export default PageLayout;
