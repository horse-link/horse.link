import React from "react";
import { Loader } from ".";

type Props = {
  title: string;
  data?: React.ReactNode;
};

export const Card: React.FC<Props> = ({ title, data }) => (
  <div className="w-full shrink rounded-b-lg border border-hl-border text-white">
    <dt className="w-full border-b border-hl-border bg-hl-background-secondary px-4 py-2">
      {title}
    </dt>
    <dd className="w-full p-4 font-basement text-4xl font-black">
      {data || <Loader color="white" />}
    </dd>
  </div>
);
