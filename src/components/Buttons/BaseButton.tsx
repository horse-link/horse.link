import * as React from "react";
import classnames from "classnames";
import { Loader } from "../";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loaderSize?: number;
  loaderColor?: string;
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
    loaderColor,
    ...restOfProps
  } = props;

  const baseButtonStyles =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm " +
    "bg-white hover:bg-black hover:text-white focus:outline-none";

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
        <Loader className="text-lg" size={loaderSize} color={loaderColor} />
      ) : (
        title || props.children
      )}
    </button>
  );
};
