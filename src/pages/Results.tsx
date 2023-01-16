import moment from "moment";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, PageLayout } from "../components";
import { BetTable } from "../components/Bets";
import { SettleBetModal, SettledMarketModal } from "../components/Modals";
import { ResultsTable } from "../components/Results";
import { useMeetData, useResultsData } from "../hooks/data";
import { BetHistory } from "../types/bets";
import { makeMarketId } from "../utils/markets";
import { formatBytes16String } from "../utils/formatting";
import { useConfig } from "../providers/Config";
import utils from "../utils";
import { useSubgraphBets } from "../hooks/subgraph";
import { SettleRaceButton } from "../components/Buttons";
import { useAccount, useSigner } from "wagmi";
import { RacesButton } from "../components/Races";

export const Results: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settleHashes, setSettleHashes] = useState<string[]>();
  const [isSettledMarketModalOpen, setIsSettledMarketModalOpen] =
    useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();

  const config = useConfig();
  const params = useParams();
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  const propositionId = params.propositionId || "";

  const details = utils.markets.getDetailsFromPropositionId(propositionId);

  const meetRaces = useMeetData(details.track || "");
  const raceParams = {
    track: details.track,
    number: details.race
  };
  const marketId = makeMarketId(
    new Date(details.date),
    details.track,
    details.race
  );
  const b16MarketId = formatBytes16String(marketId);
  const { betHistory, refetch } = useSubgraphBets(
    false,
    "ALL_BETS",
    b16MarketId
  );

  const results = useResultsData(propositionId);

  const closeSettledMarketModal = useCallback(
    () => setIsSettledMarketModalOpen(false),
    [isSettledMarketModalOpen, setIsSettledMarketModalOpen]
  );

  return (
    <PageLayout>
      <div className="rounded-lg gap-6">
        <RacesButton params={raceParams} meetRaces={meetRaces} />
        <h1 className="font-semibold text-3xl mb-10 mt-2">
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
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold mt-4">History</h1>
        <BetTable
          myBetsEnabled={false}
          betHistory={betHistory}
          config={config}
          setSelectedBet={setSelectedBet}
          setIsModalOpen={setIsSettleModalOpen}
        />
      </div>
      <div className="mt-4 flex w-full justify-end">
        <SettleRaceButton
          betHistory={betHistory}
          loading={loading}
          isConnected={isConnected}
          config={config}
          signer={signer}
          setIsSettledMarketModalOpen={setIsSettledMarketModalOpen}
          setSettleHashes={setSettleHashes}
          setLoading={setLoading}
        />
      </div>
      <SettleBetModal
        isModalOpen={isSettleModalOpen}
        setIsModalOpen={setIsSettleModalOpen}
        selectedBet={selectedBet}
        refetch={refetch}
        config={config}
      />
      <SettledMarketModal
        isOpen={isSettledMarketModalOpen}
        onClose={closeSettledMarketModal}
        hashes={settleHashes}
      />
    </PageLayout>
  );
};
