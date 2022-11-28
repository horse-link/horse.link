import { useLocation } from "react-router";
import PageLayoutView from "./PageLayout_View";

type Props = {
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
