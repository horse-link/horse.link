import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, PageLayout } from "../components";
import { NewBetTable, NewResultsTable } from "../components/Tables";
import { SettleBetModal, SettledMarketModal } from "../components/Modals";
import { useMeetData, useResultsData } from "../hooks/data";
import { BetHistory } from "../types/bets";
import { makeMarketId } from "../utils/markets";
import { formatBytes16String } from "../utils/formatting";
import { useConfig } from "../providers/Config";
import utils from "../utils";
import { useSubgraphBets } from "../hooks/subgraph";
import {
  // SettleRaceButton,
  RacesButton,
  NewButton
} from "../components/Buttons";
// import { useAccount, useSigner } from "wagmi";
import dayjs from "dayjs";
import { RaceInfo } from "../types/meets";

const Results: React.FC = () => {
  // const [loading, setLoading] = useState(false);
  const [settleHashes] = useState<string[]>(); // setSettleHashes
  const [isSettledMarketModalOpen, setIsSettledMarketModalOpen] =
    useState(false);
  const [thisRace, setThisRace] = useState<RaceInfo>();
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();

  const config = useConfig();
  const params = useParams();
  // const { isConnected } = useAccount();
  // const { data: signer } = useSigner();

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
    b16MarketId
  );

  const results = useResultsData(propositionId);

  const closeSettledMarketModal = () => setIsSettledMarketModalOpen(false);

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <RacesButton params={raceParams} meetRaces={meetRaces?.raceInfo} />
        </div>
        <div className="flex justify-between border border-hl-border bg-hl-background-secondary px-4 py-3 font-basement text-sm tracking-wider text-hl-primary">
          {!thisRace ? (
            <div className="flex w-full justify-center py-2">
              <Loader />
            </div>
          ) : (
            <React.Fragment>
              <h1>{thisRace.raceName}</h1>
              <h2>
                Track:{" "}
                {results
                  ? `${results.track.name} - (${results.track.code})`
                  : details.track}
              </h2>
              <h2>Race #: {thisRace.raceNumber}</h2>
              <h2>Date: {date}</h2>
              <h2>Distance: {thisRace.raceDistance}m</h2>
              <h2>Class: {thisRace.raceClassConditions}</h2>
            </React.Fragment>
          )}
        </div>
        <NewResultsTable results={results} />
      </div>
      <div className="mt-10">
        <NewButton text="history" onClick={() => {}} disabled active={false} />
      </div>
      <div className="mt-4">
        <NewBetTable
          paramsAddressExists={true}
          allBetsEnabled={true}
          betHistory={betHistory}
          config={config}
          setSelectedBet={setSelectedBet}
          setIsModalOpen={setIsSettleModalOpen}
        />
      </div>
      {/* <div className="mt-4 flex w-full justify-end">
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
      </div> */}
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
