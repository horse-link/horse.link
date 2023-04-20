import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, PageLayout, Toggle } from "../components";
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

const Results: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settleHashes, setSettleHashes] = useState<string[]>();
  const [isSettledMarketModalOpen, setIsSettledMarketModalOpen] =
    useState(false);
  const [thisRace, setThisRace] = useState<RaceInfo>();
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const [allBetsEnabled, setAllBetsEnabled] = useState(true);

  const onMyBetToggle = () => setAllBetsEnabled(prev => !prev);

  const config = useConfig();
  const params = useParams();
  const { isConnected, address } = useAccount();
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
    "ALL_BETS",
    b16MarketId,
    allBetsEnabled ? undefined : address
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
        <div className="flex-row gap-6 overflow-scroll rounded-lg border-b border-gray-200 bg-white p-2 text-center shadow lg:flex lg:justify-around">
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
          <span className="flex w-full items-center justify-center">
            <Loader />
          </span>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between">
          <h1 className="mt-4 text-2xl font-bold">History</h1>
          <div className="flex items-center gap-3">
            <Toggle enabled={allBetsEnabled} onChange={onMyBetToggle} />
            <div className="font-semibold">All Bets</div>
          </div>
        </div>
        <BetTable
          paramsAddressExists={true}
          allBetsEnabled={allBetsEnabled}
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
          refetch={refetch}
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

export default Results;
