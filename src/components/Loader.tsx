import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  className?: string;
  size?: number;
};

export const Loader: React.FC<Props> = ({ className, size = 30 }) => (
  <ClipLoader aria-label="Loading Spinner" className={className} size={size} />
);
