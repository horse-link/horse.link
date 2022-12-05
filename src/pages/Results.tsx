import moment from "moment";
import React from "react";
import { useParams } from "react-router-dom";
import { Loader, PageLayout } from "../components";
import { ResultsTable } from "../components/Results";
import { useResultsData } from "../hooks/data";
import utils from "../utils";

export const Results: React.FC = () => {
  const params = useParams();
  const propositionId = params.propositionId || "";
  const state = params.state || "";
  const details = utils.markets.getDetailsFromPropositionId(propositionId);

  const results = useResultsData(propositionId, state);

  return (
    <PageLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="font-semibold text-3xl mb-10">
          {details.track} {details.race} Results{" "}
          <span className="block text-lg text-black/50">
            {moment(Date.now()).format("dddd Do MMMM")}
          </span>
        </h1>
        {results ? (
          <ResultsTable results={results} />
        ) : (
          <span className="flex w-full justify-center items-center">
            <Loader />
          </span>
        )}
      </div>
    </PageLayout>
  );
};
