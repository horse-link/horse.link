import React, { useEffect, useRef, useState } from "react";
import { Loader } from "../";
import { BaseModal } from ".";
import { ethers } from "ethers";
import { useMarketContract } from "../../hooks/contracts";
import { Web3ErrorHandler, Web3SuccessHandler } from "../Web3Handlers";
import { useSigner } from "wagmi";
import utils from "../../utils";
import { BetHistory } from "../../types/bets";
import { Config } from "../../types/config";
import { useApi } from "../../providers/Api";
import { useScannerUrl } from "../../hooks/useScannerUrl";
import { NewButton } from "../Buttons";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

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
  const { settleBet, refundBet } = useMarketContract();

  const { current: now } = useRef(Math.floor(Date.now() / 1000));

  const api = useApi();
  const scanner = useScannerUrl();

  // get signed bet
  useEffect(() => {
    if (!selectedBet || !isModalOpen) return;

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
  }, [selectedBet, isModalOpen]);

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

  const isScratched = bet?.scratched !== undefined;

  const isPastPayoutDate = now > (bet?.payoutDate || 0);

  const isSettled = bet?.settled;

  const onClickSettleBet = async () => {
    if (!bet || !market || !signer || !config) return;
    setTxHash(undefined);
    setError(undefined);

    try {
      setTxLoading(true);
      let tx: string;
      if (isScratched) {
        tx = await refundBet(market, bet, signer);
      } else {
        tx = await settleBet(market, bet, signer, config);
      }
      setTxHash(tx);
    } catch (err: any) {
      setError(err);
    } finally {
      setTxLoading(false);
      refetch();
    }
  };

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      isLarge={!!txHash}
    >
      {!bet || !config || !market || !token ? (
        <div className="p-10">
          <Loader />
        </div>
      ) : isSettled ? (
        <div className="p-6">
          <h2 className="font-basement text-5xl tracking-wider">
            {utils.formatting.formatFirstLetterCapitalised(bet.status)} Bet #
            {bet.index}
          </h2>

          <p className="mt-2 font-semibold">
            Tx Hash:{" "}
            <a
              href={`${scanner}/tx/${bet.settledAtTx}`}
              target="_blank"
              rel="noreferrer noopener"
              className="underline"
            >
              {utils.formatting.shortenHash(
                bet.settledAtTx || ethers.constants.HashZero
              )}
            </a>
          </p>
        </div>
      ) : txHash ? (
        <Web3SuccessHandler
          hash={txHash}
          message="Your settlement has been placed, click here to view the transaction"
        />
      ) : error ? (
        <Web3ErrorHandler error={error} />
      ) : (
        <div className="p-6">
          <h2 className="font-basement text-5xl tracking-wider">
            {utils.formatting.formatFirstLetterCapitalised(bet.status)} Bet #
            {bet.index}
          </h2>

          <div className="mt-8 flex w-full flex-col items-center">
            <div className="grid w-full grid-cols-2">
              <h3 className="text-left text-hl-secondary">Placed:</h3>
              <p className="text-left text-hl-tertiary">
                {dayjs.unix(bet.blockNumber).format("dddd Do MMMM")}
              </p>
              <h3 className="text-left text-hl-secondary">Market:</h3>
              <p className="text-left text-hl-tertiary">
                {utils.config.getVaultNameFromMarket(market.address, config)}
              </p>
              {isWinning === true ? (
                <React.Fragment>
                  <h3 className="text-left text-hl-secondary">Win:</h3>
                  <p className="text-left text-hl-tertiary">
                    {ethers.utils.formatEther(bet.payout)} {token?.symbol}
                  </p>
                </React.Fragment>
              ) : isWinning === false ? (
                <React.Fragment>
                  <h3 className="text-left text-hl-secondary">
                    {isScratched ? "Refund" : "Loss"}
                  </h3>
                  <p className="text-left text-hl-tertiary">
                    {ethers.utils.formatEther(bet.payout)} {token.symbol}
                  </p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h3 className="text-left text-hl-secondary">Bet:</h3>
                  <p className="text-left text-hl-tertiary">
                    {ethers.utils.formatEther(bet.amount)} {token.symbol}
                  </p>
                  <h3 className="text-left text-hl-secondary">
                    Potential Payout:
                  </h3>
                  <p className="text-left text-hl-tertiary">
                    {utils.formatting.formatToFourDecimals(
                      ethers.utils.formatEther(bet.payout)
                    )}
                  </p>
                </React.Fragment>
              )}
            </div>
          </div>
          <div className="mt-6">
            <NewButton
              text={txLoading ? "loading..." : "SETTLE BET"}
              onClick={onClickSettleBet}
              disabled={
                !signer ||
                bet.settled ||
                bet.status === "PENDING" ||
                !isPastPayoutDate ||
                txLoading ||
                !!txHash
              }
              big
            />
            {!bet.marketResultAdded && (
              <p className="my-2 text-xs">
                Note: will require two transactions to add market results first
              </p>
            )}
          </div>
        </div>
      )}
    </BaseModal>
  );
};
