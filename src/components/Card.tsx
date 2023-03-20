import React from "react";
import { Loader } from ".";

type Props = {
  title: string;
  data?: string;
};

export const Card: React.FC<Props> = ({ title, data }) => (
  <div className="w-full overflow-hidden rounded-lg bg-white px-2 py-1 shadow sm:p-6">
    <dt className="font-medium text-gray-500 ">{title}</dt>
    <dd className="mt-1 font-semibold text-gray-900 lg:text-3xl">
      {data || <Loader />}
    </dd>
  </div>
);
