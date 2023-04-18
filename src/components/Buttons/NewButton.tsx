import classNames from "classnames";
import React from "react";

type Props = {
  text: string;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  active?: boolean;
};

export const NewButton: React.FC<Props> = ({
  text,
  onClick,
  disabled,
  active = true
}) => (
  <button
    className={classNames("px-8 text-sm", {
      "bg-hl-secondary text-hl-background": active,
      "border border-hl-tertiary text-hl-tertiary": !active
    })}
    onClick={onClick}
    disabled={disabled}
  >
    {text.toUpperCase()}
  </button>
);
