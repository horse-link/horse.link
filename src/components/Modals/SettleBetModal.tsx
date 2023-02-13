import React, { useEffect, useMemo, useState } from "react";
import { Loader } from "../";
import { BaseModal } from ".";
import { ethers } from "ethers";
import { useMarketContract } from "../../hooks/contracts";
import { Web3ErrorHandler, Web3SuccessHandler } from "../Web3Handlers";
import { useSigner } from "wagmi";
import utils from "../../utils";
import { BetHistory } from "../../types/bets";
import { Config } from "../../types/config";
import api from "../../apis/Api";
import dayjs from "dayjs";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedBet?: BetHistory;
  refetch: () => void;
  config?: Config;
};

export const SettleBetModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  selectedBet,
  refetch,
  config
}) => {
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<ethers.errors>();

  const [bet, setBet] = useState<BetHistory>();

  const { data: signer } = useSigner();
  const { settleBet } = useMarketContract();

  const now = useMemo(() => Math.floor(Date.now() / 1000), []);

  // get signed bet
  useEffect(() => {
    if (!selectedBet) return;

    api
      .getWinningResultSignature(
        utils.formatting.parseBytes16String(selectedBet.marketId),
        // we want to sign if the bet isnt already settled
        !selectedBet.settled
      )
      .then(signedData => {
        const formattedBet: BetHistory = {
          ...selectedBet,
          marketResultAdded: signedData.marketResultAdded,
          winningPropositionId: signedData.winningPropositionId,
          marketOracleResultSig: signedData.marketOracleResultSig,
          scratched: signedData.scratchedRunners?.find(
            s => s.b16propositionId === selectedBet.propositionId
          )
        };

        setBet(formattedBet);
      })
      .catch(console.error);
  }, [selectedBet]);

  // clean up
  useEffect(() => {
    if (isModalOpen) return;

    setTimeout(() => {
      setTxHash(undefined);
      setTxLoading(false);
      setError(undefined);
      setBet(undefined);
    }, 300);
  }, [isModalOpen]);

  const market = config?.markets.find(
    m => m.address.toLowerCase() === bet?.marketAddress.toLowerCase()
  );

  const token = config?.tokens.find(
    t => t.address.toLowerCase() === bet?.assetAddress.toLowerCase()
  );

  const isWinning =
    bet && bet.winningPropositionId
      ? bet.winningPropositionId.toLowerCase() ===
        bet.propositionId.toLowerCase()
      : undefined;

  const isPayable = bet ? now > bet.payoutDate : false;

  const onClickSettleBet = async () => {
    if (!bet || !market || !signer || !config) return;
    setTxHash(undefined);
    setError(undefined);

    try {
      setTxLoading(true);
      const tx = await settleBet(market, bet, signer, config);
      setTxHash(tx);
    } catch (err: any) {
      setError(err);
    } finally {
      setTxLoading(false);
      refetch();
    }
  };

  return (
    <BaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {!bet || !config ? (
        <div className="p-10">
          <Loader />
        </div>
      ) : (
        <React.Fragment>
          <h2 className="mr-[8vw] mb-6 text-2xl font-bold">
            {utils.formatting.formatFirstLetterCapitalised(bet.status)} Bet
          </h2>
          <div className="flex flex-col">
            <h3 className="mb-2 font-semibold">
              Placed:{" "}
              <span className="font-normal">
                {dayjs.unix(bet.blockNumber).format("dddd Do MMMM")}
              </span>
            </h3>
            <h3 className="mb-2 font-semibold">
              Market:{" "}
              <span className="font-normal">
                {market ? (
                  utils.config.getVaultNameFromMarket(market.address, config)
                ) : (
                  <Loader size={14} />
                )}
              </span>
            </h3>
            {isWinning === true ? (
              <h3 className="font-semibold">
                Win:{" "}
                <span className="font-normal">
                  {ethers.utils.formatEther(bet.payout)} {token?.symbol}
                </span>
              </h3>
            ) : isWinning === false ? (
              <h3 className="font-semibold">
                Loss:{" "}
                <span className="font-normal">
                  {ethers.utils.formatEther(bet.amount)} {token?.symbol}
                </span>
              </h3>
            ) : (
              <h3 className="font-semibold">
                Bet:{" "}
                <span className="font-normal">
                  {ethers.utils.formatEther(bet.amount)} {token?.symbol}
                </span>
                <h3 className="mt-2 font-semibold">
                  Potential Payout:{" "}
                  <span className="font-normal">
                    {bet.payout ? (
                      utils.formatting.formatToFourDecimals(
                        ethers.utils.formatEther(bet.payout)
                      )
                    ) : (
                      <Loader size={14} />
                    )}{" "}
                    {token?.symbol}
                  </span>
                </h3>
              </h3>
            )}
            {!txHash && !error && (
              <React.Fragment>
                <button
                  className="relative mt-6 w-full rounded-md border-2 border-black py-2 font-bold transition-colors duration-100 disabled:border-black/50 disabled:bg-white disabled:text-black/50 enabled:hover:bg-black enabled:hover:text-white"
                  onClick={onClickSettleBet}
                  disabled={
                    !signer ||
                    bet.settled ||
                    !isPayable ||
                    txLoading ||
                    !!txHash
                  }
                >
                  {txLoading ? <Loader /> : "SETTLE BET"}
                </button>
                {!bet.marketResultAdded && (
                  <span className="relative top-[0.5rem] bottom-[1rem] block text-xs text-black/80">
                    Note: will require two transactions to add market results
                    first
                  </span>
                )}
                <br />
              </React.Fragment>
            )}
            {txHash && (
              <Web3SuccessHandler
                hash={txHash}
                message="Your settlement has been placed, click here to view the transaction"
              />
            )}
            {error && <Web3ErrorHandler error={error} />}
          </div>
        </React.Fragment>
      )}
    </BaseModal>
  );
};
