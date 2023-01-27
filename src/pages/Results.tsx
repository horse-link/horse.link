import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Skeleton from "react-loading-skeleton";

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

  const { current: date } = useRef(dayjs().format("DD-MM-YY"));

  const meetRaces = useMeetData(details.track || "");

  useEffect(() => {
    if (!meetRaces) return;

    const raceResultsData = meetRaces.raceInfo.find(
      meetInfo => meetInfo.raceNumber.toString() === details.race
    );
    setThisRace(raceResultsData);
  }, [meetRaces, details]);

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
  const { betData: betHistory, refetch } = useSubgraphBets(
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
      <div className="flex flex-col gap-6">
        <RacesButton params={raceParams} meetRaces={meetRaces?.raceInfo} />
        <div className="lg:flex text-center flex-row p-2 gap-6 shadow border-b bg-white border-gray-200 rounded-lg lg:justify-around overflow-scroll">
          <h1>{thisRace ? thisRace.raceName : <Skeleton />}</h1>
          <h1>
            Track:{" "}
            {results
              ? `${results.track.name} - (${results.track.code})`
              : details.track}
          </h1>
          <h1>Race #: {thisRace ? thisRace.raceNumber : <Skeleton />}</h1>
          <h1>Date: {date}</h1>
          <h1>
            Distance: {thisRace ? `${thisRace.raceDistance}m` : <Skeleton />}
          </h1>
          <h1>
            Class: {thisRace ? thisRace.raceClassConditions : <Skeleton />}
          </h1>
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
