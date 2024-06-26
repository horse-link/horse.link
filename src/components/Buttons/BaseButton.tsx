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
    "w-full flex justify-center py-2 px-4 border-black border-2 rounded-md shadow-sm " +
    "bg-white hover:bg-black hover:text-white focus:outline-none hover:border-black";

  return (
    <button
      className={classnames("text-sm font-medium text-white", className, {
        "border-black/50 bg-white text-black/50 hover:border-black/50 hover:bg-white hover:text-black/50 ":
          disabled,
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
