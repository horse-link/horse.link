import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, PageLayout } from "../components";
import { BetTable, ResultsTable } from "../components/Tables";
import { SettleBetModal, SettledMarketModal } from "../components/Modals";
import { useMeetData, useResultsData } from "../hooks/data";
import { BetHistory } from "../types/bets";
import { makeMarketId } from "../utils/markets";
import { formatBytes16String } from "../utils/formatting";
import { useConfig } from "../providers/Config";
import utils from "../utils";
import { useSubgraphBets } from "../hooks/subgraph";
import { SettleRaceButton, RacesButton } from "../components/Buttons";
import { useAccount, useSigner } from "wagmi";
import dayjs from "dayjs";
import { RaceInfo } from "../types/meets";

export const Results: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settleHashes, setSettleHashes] = useState<string[]>();
  const [isSettledMarketModalOpen, setIsSettledMarketModalOpen] =
    useState(false);
  const [thisRace, setThisRace] = useState<RaceInfo>();
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();

  const config = useConfig();
  const params = useParams();
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  const propositionId = params.propositionId || "";
  const details = utils.markets.getDetailsFromPropositionId(propositionId);

  const { date } = useMemo(() => {
    const date = dayjs().format("DD-MM-YY");
    return { config, date };
  }, []);

  const meetRaces = useMeetData(details.track || "");

  useEffect(() => {
    if (meetRaces) {
      const raceResultsData = meetRaces.find(
        meet => meet.raceNumber.toString() == details.race
      );
      setThisRace(raceResultsData);
    }
  }, [details]);

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
      <div className="rounded-lg flex flex-col gap-6">
        <RacesButton params={raceParams} meetRaces={meetRaces} />
        <div className="flex p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
          <h1>{thisRace?.raceName}</h1>
          <h1>Track: {details.track}</h1>
          <h1>Race #: {thisRace?.raceNumber}</h1>
          <h1>Date: {date}</h1>
          <h1>Distance: {`${thisRace?.raceDistance}m`}</h1>
          <h1>Class: {thisRace?.raceClassConditions}</h1>
        </div>
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
