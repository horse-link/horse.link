import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  className?: string;
};

const Loader: React.FC<Props> = () => {
  return <ClipLoader aria-label="Loading Spinner" />;
};

export default Loader;
