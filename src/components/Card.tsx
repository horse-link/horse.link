import React from "react";
import { Loader } from ".";
import classNames from "classnames";

type Props = {
  title: string;
  data?: React.ReactNode;
  breakAll?: true;
};

export const Card: React.FC<Props> = ({ title, data, breakAll }) => (
  <div className="w-full shrink rounded-b-lg border border-hl-border text-white">
    <dt className="w-full border-b border-hl-border bg-hl-background-secondary px-4 py-2">
      {title}
    </dt>
    <dd
      className={classNames("w-full p-4 font-basement text-4xl font-black", {
        "break-all": !!breakAll
      })}
    >
      {data || <Loader color="white" />}
    </dd>
  </div>
);
