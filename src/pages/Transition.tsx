import React from "react";
import { Loader, PageLayout } from "../components";

const Transition: React.FC = () => (
  <PageLayout>
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loader size={40} />
    </div>
  </PageLayout>
);

export default Transition;
