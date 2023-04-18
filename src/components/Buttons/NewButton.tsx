import classNames from "classnames";
import React from "react";

type Props = {
  text: string;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  active?: boolean;
  big?: boolean;
};

export const NewButton: React.FC<Props> = ({
  text,
  onClick,
  disabled,
  active = true,
  big = false
}) => (
  <button
    className={classNames({
      "bg-hl-secondary text-hl-background": active,
      "border border-hl-tertiary text-hl-tertiary": !active,
      "px-8 text-sm": !big,
      "w-full py-2 text-base": big
    })}
    onClick={onClick}
    disabled={disabled}
  >
    {text.toUpperCase()}
  </button>
);
