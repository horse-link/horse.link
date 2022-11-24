import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  className?: string;
  size?: number;
};

const Loader: React.FC<Props> = ({ className, size = 30 }) => {
  return (
    <ClipLoader
      aria-label="Loading Spinner"
      className={className}
      size={size}
    />
  );
};

export default Loader;
