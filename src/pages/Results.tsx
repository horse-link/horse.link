import moment from "moment";
import React from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "../components";
import { useResultsData } from "../hooks/data";
import utils from "../utils";

export const Results: React.FC = () => {
  const params = useParams();
  const propositionId = params.propositionId || "";
  const details = utils.markets.getDetailsFromPropositionId(propositionId);

  const results = useResultsData(propositionId);

  return (
    <PageLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="font-semibold text-3xl mb-14">
          {details.track} {details.race} Results
        </h1>
        <div className="grid grid-cols-4 grid-rows-2">
          <h2 className="text-center text-black/60 font-semibold">Results</h2>
          <h2 className="text-center text-black/60 font-semibold">Runner</h2>
          <h2 className="text-center text-black/60 font-semibold">
            Fixed Odds
          </h2>
          <h2 className="text-center text-black/60 font-semibold">Tote</h2>
        </div>
      </div>
    </PageLayout>
  );
};
