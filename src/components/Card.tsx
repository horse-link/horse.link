import React from "react";
import { Loader } from ".";

type Props = {
  title: string;
  data?: string;
};

export const Card: React.FC<Props> = ({ title, data }) => (
  <div className="px-2 py-1 bg-white shadow rounded-lg overflow-hidden w-full sm:p-6">
    <dt className="font-medium text-gray-500 ">{title}</dt>
    <dd className="mt-1 font-semibold text-gray-900 lg:text-3xl">
      {data || <Loader />}
    </dd>
  </div>
);
