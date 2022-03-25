import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";

type Props = {
  className?: string;
};

const Loader: React.FC<Props> = props => {
  return (
    <FontAwesomeIcon
      className={classnames("animate-spin", props.className)}
      icon="spinner"
    />
  );
};

export default Loader;
