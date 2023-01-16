import moment from "moment";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, PageLayout } from "../components";
import { BetTable } from "../components/Bets";
import { SettleBetModal, SettledMarketModal } from "../components/Modals";
import { ResultsTable } from "../components/Results";
import { useResultsData } from "../hooks/data";
import { BetHistory } from "../types/bets";
import { makeMarketId } from "../utils/markets";
import { formatBytes16String } from "../utils/formatting";
import { useConfig } from "../providers/Config";
import utils from "../utils";
import { useSubgraphBets } from "../hooks/subgraph";
import { BaseButton } from "../components/Buttons";
import { useAccount, useSigner } from "wagmi";
import { useMarketContract } from "../hooks/contracts";
import { MarketInfo } from "../types/config";

export const Results: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settleHashes, setSettleHashes] = useState<string[]>();
  const [isSettledMarketModalOpen, setIsSettledMarketModal] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();

  const config = useConfig();
  const params = useParams();
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const { settleBet, setResult } = useMarketContract();

  const propositionId = params.propositionId || "";
  const details = utils.markets.getDetailsFromPropositionId(propositionId);
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

  const settleRace = async () => {
    if (
      !betHistory ||
      !betHistory.length ||
      !config ||
      !isConnected ||
      loading ||
      !signer ||
      !config
    )
      return;

    setIsSettledMarketModal(false);
    setSettleHashes(undefined);
    setLoading(true);
    try {
      // try to set results for both markets
      await Promise.all(
        config.markets.map(market =>
          setResult(
            market,
            signer,
            betHistory.find(
              bet =>
                bet.marketAddress.toLowerCase() === market.address.toLowerCase()
            )!,
            config
          )
        )
      );
      // settle all bets and collect hashes
      const hashes = await Promise.all(
        betHistory.map(async bet =>
          settleBet(
            {
              address: bet.marketAddress
            } as MarketInfo,
            bet,
            signer,
            config
          )
        )
      );
      // set hashes and show success modal
      setSettleHashes(hashes);
      setIsSettledMarketModal(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeSettledMarketModal = () => setIsSettledMarketModal(false);

  return (
    <PageLayout>
      <div className="rounded-lg gap-6">
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
        <BaseButton
          className="!w-auto !px-6 !py-3 !text-md"
          loading={!config || !betHistory || loading}
          loaderSize={20}
          onClick={settleRace}
          disabled={!isConnected || !signer || !betHistory?.length}
        >
          Settle Race
        </BaseButton>
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
