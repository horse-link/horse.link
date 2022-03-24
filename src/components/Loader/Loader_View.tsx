import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

type Props = {
  className?: string;
};

const Loader: React.FC<Props> = props => {
  return (
    <h1>Loading</h1>
    /*
    <FontAwesomeIcon
      className={classnames("animate-spin", props.className)}
      icon={faSpinner}
    />*/
  );
};

export default Loader;
