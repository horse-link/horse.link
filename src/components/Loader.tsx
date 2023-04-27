import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  className?: string;
  size?: number;
  color?: string;
};

export const Loader: React.FC<Props> = ({
  className,
  size = 30,
  color = "white"
}) => (
  <ClipLoader
    aria-label="Loading Spinner"
    className={className}
    size={size}
    color={color}
  />
);
