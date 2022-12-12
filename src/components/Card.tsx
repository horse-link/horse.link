import React from "react";
import { Loader } from ".";

type Props = {
  title: string;
  data?: string;
};

export const Card: React.FC<Props> = ({ title, data }) => (
  <div className="px-1 py-1 bg-white shadow rounded-lg overflow-hidden sm:p-6 w-full">
    <dt className="lg:text-sx font-medium text-gray-500 ">{title}</dt>
    <dd className="mt-1 lg:text-3xl font-semibold text-gray-900">
      {data || <Loader />}
    </dd>
  </div>
);
