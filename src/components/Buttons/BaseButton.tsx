import * as React from "react";
import classnames from "classnames";
import { Loader } from "../";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loaderSize?: number;
  baseStyleOverride?: boolean;
};

export const BaseButton: React.FC<Props> = props => {
  const {
    className,
    title,
    loading,
    disabled,
    onClick,
    loaderSize,
    baseStyleOverride,
    ...restOfProps
  } = props;

  const baseButtonStyles =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm " +
    "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    "focus:ring-indigo-500";

  return (
    <button
      className={classnames("text-sm font-medium text-white", className, {
        "opacity-50": disabled,
        [baseButtonStyles]: !baseStyleOverride
      })}
      disabled={loading || disabled}
      {...restOfProps}
      onClick={onClick}
    >
      {loading ? (
        <Loader className="text-lg" size={loaderSize} />
      ) : (
        title || props.children
      )}
    </button>
  );
};
