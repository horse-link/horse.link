import { SpinnerCircular } from 'spinners-react';

type Props = {
  className?: string;
};

const Loader: React.FC<Props> = props => {
  return (
    <SpinnerCircular />
  );
};

export default Loader;
