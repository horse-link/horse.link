import classNames from "classnames";
import React from "react";

type Props = {
  text: string;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  active?: boolean;
  big?: boolean;
  dropdown?: boolean;
  dropdownOpen?: boolean;
  white?: boolean;
};

export const NewButton: React.FC<Props> = ({
  text,
  onClick,
  disabled,
  active = true,
  big = false,
  dropdown = false,
  dropdownOpen = false,
  white = false
}) => (
  <button
    className={classNames({
      "bg-hl-secondary text-hl-background": active && !white,
      "bg-hl-primary text-hl-background": active && white,
      "border border-hl-tertiary text-hl-tertiary": !active,
      "px-8 text-xs xl:text-sm": !big,
      "w-full py-2 text-sm xl:text-base": big
    })}
    onClick={onClick}
    disabled={disabled}
  >
    {dropdown ? (
      <div className="flex w-full justify-between">
        <div className="w-full" />
        <span className="block w-full text-center">{text.toUpperCase()}</span>
        <div className="flex w-full justify-end">
          <span
            className={classNames("relative -left-4 block", {
              "rotate-180": dropdownOpen
            })}
          >
            V
          </span>
        </div>
      </div>
    ) : (
      text.toUpperCase()
    )}
  </button>
);
