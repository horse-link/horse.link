import * as React from "react";
import classnames from "classnames";
import Loader from "../Loader";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<Props> = props => {
  const { className, title, loading, disabled, ...restOfProps } = props;
  return (
    <button
      className={classnames(
        className,
        "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        { "opacity-50": disabled }
      )}
      disabled={loading || disabled}
      {...restOfProps}
    >
      {loading ? <Loader className="text-lg" /> : title || props.children}
    </button>
  );
};

export default Button;
