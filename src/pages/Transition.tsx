import React from "react";
import { PageLayout } from "../components";
import ClipLoader from "react-spinners/ClipLoader";

const Transition: React.FC = () => (
  <PageLayout>
    <div className="flex h-full w-full flex-col items-center justify-center">
      <ClipLoader color="white" size={40} />
    </div>
  </PageLayout>
);

export default Transition;
