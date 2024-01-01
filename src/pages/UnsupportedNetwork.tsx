import React, { useEffect } from "react";
import { PageLayout } from "../components";
import { useNavigate } from "react-router";
import { useNetwork } from "wagmi";

const UnsupportedNetwork: React.FC = () => {
  const navigate = useNavigate();
  const { chain } = useNetwork();

  useEffect(() => {
    if (!chain) return;

    if (!chain.unsupported)
      navigate("/", {
        replace: true
      });
  }, [chain]);

  return (
    <PageLayout>
      <p className="w-full rounded-lg bg-indigo-600 p-6 text-center text-2xl font-bold text-white lg:p-4">
        Unsupported network selected.
        <br />
        We recommend that you switch to the Arbitrum network.
      </p>
    </PageLayout>
  );
};

export default UnsupportedNetwork;
