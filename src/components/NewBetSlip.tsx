import React, { useState, useEffect } from "react";
import { useBetSlipContext } from "../providers/BetSlip";
import { BigNumber, ethers } from "ethers";
import utils from "../utils";
import { useConfig } from "../providers/Config";
import { useMarketContract } from "../hooks/contracts";
import { useNetwork, useSigner } from "wagmi";
import { BetTotals } from "../types/bets";
import { useApolloWithForce } from "../providers/Apollo";
import { useApiWithForce } from "../providers/Api";
import { Card } from "./Card";
import { VscTrash } from "react-icons/vsc";
import { NewButton } from "./Buttons";

export const NewBetSlip: React.FC = () => {
  const config = useConfig();
  const { data: signer } = useSigner();
  const { bets, removeBet, forceNewSigner, placeBetsInBetSlip } =
    useBetSlipContext();
  const { getPotentialPayout } = useMarketContract();
  const [slipTotals, setSlipTotals] = useState<BetTotals>();

  const { chain: currentChain } = useNetwork();
  const { chain: apolloChain, forceNewChain: forceApolloChain } =
    useApolloWithForce();
  const { chain: apiChain, forceNewChain: forceApiChain } = useApiWithForce();

  // chain check logic
  useEffect(() => {
    if (!currentChain || !apolloChain || !apiChain) return;

    if (currentChain.id !== apolloChain.id || currentChain.id !== apiChain.id) {
      forceApiChain(currentChain);
      forceApolloChain(currentChain);
    }
  }, [currentChain, apolloChain, apiChain]);

  useEffect(() => {
    if (!signer) return;

    forceNewSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!bets || !signer) return;

    (async () => {
      const betTotals = await Promise.all(
        bets.map(async bet => {
          const payout = await getPotentialPayout(
            bet.market,
            BigNumber.from(bet.wager),
            bet.back,
            signer
          );

          return {
            market: bet.market,
            payout,
            stake: BigNumber.from(bet.wager)
          };
        })
      );

      const totalsPerAsset = betTotals.reduce(
        (previousPayout, currentPayout) => {
          const vault = utils.config.getVaultFromMarket(
            currentPayout.market,
            config
          );
          if (!vault)
            throw new Error(
              `No vault associated with market, ${currentPayout.market.address}`
            );

          const name = vault.asset.address;
          const payoutUnits = ethers.utils.formatUnits(
            currentPayout.payout,
            vault.asset.decimals
          );
          const parsedPayoutUnits = ethers.utils.parseEther(payoutUnits);

          const stakeUnits = ethers.utils.formatUnits(
            currentPayout.stake,
            vault.asset.decimals
          );
          const parsedStakedUnits = ethers.utils.parseEther(stakeUnits);

          return {
            ...previousPayout,
            [name]: {
              payout: previousPayout[name]
                ? previousPayout[name].payout.add(parsedPayoutUnits)
                : parsedPayoutUnits,
              symbol: vault.asset.symbol,
              stake: previousPayout[name]
                ? previousPayout[name].stake.add(parsedStakedUnits)
                : parsedStakedUnits
            }
          };
        },
        {} as NonNullable<typeof slipTotals>
      );

      setSlipTotals(totalsPerAsset);
    })();
  }, [bets, config, signer]);

  return (
    <Card
      title="Bet Slip"
      data={
        <div className="w-full text-base font-normal">
          {!bets?.length || !config ? (
            <div className="w-full text-center">No bets!</div>
          ) : (
            bets.map((bet, i) => {
              const vault = utils.config.getVaultFromMarket(bet.market, config);

              return (
                <div
                  className="flex w-full items-center border-b border-hl-border px-3 py-2"
                  key={`bet-${bet.id}`}
                >
                  <div className="flex w-full items-center gap-x-6">
                    <div className="bg-hl-primary px-3 py-1 text-xl font-bold text-hl-secondary">
                      {i + 1}
                    </div>
                    <div className="w-full">
                      <p className="font-basement font-black">
                        {bet.runner.name}
                      </p>
                      <p className="text-hl-tertiary">
                        {utils.formatting.formatToFourDecimals(
                          ethers.utils.formatUnits(
                            bet.wager,
                            vault?.asset.decimals
                          )
                        )}{" "}
                        {vault?.asset.symbol || "Token"}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-end gap-x-4">
                    <div className="w-full text-right">
                      <p>
                        {bet.race.track.name} {bet.race.raceNumber}
                      </p>
                      <p className="text-hl-secondary">
                        {utils.formatting.formatToTwoDecimals(
                          bet.back.odds.toString()
                        )}{" "}
                        Win
                      </p>
                    </div>
                    <VscTrash
                      onClick={() => removeBet(bet.id)}
                      color="white"
                      className="cursor-pointer"
                      size={40}
                    />
                  </div>
                </div>
              );
            })
          )}
          <div className="mt-10">
            {bets && slipTotals && (
              <React.Fragment>
                <div className="flex items-start justify-between pb-4">
                  <span className="font-bold">Potential Payout: </span>
                  <div>
                    {Object.entries(slipTotals).map(([symbol, details]) => (
                      <span className="block text-right" key={symbol}>
                        {utils.formatting.formatToFourDecimals(
                          ethers.utils.formatEther(details.payout)
                        )}
                        {` ${details.symbol}`}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-bold">Total Stake: </span>
                  <div>
                    {Object.entries(slipTotals).map(([symbol, details]) => (
                      <span className="block text-right" key={symbol}>
                        {utils.formatting.formatToFourDecimals(
                          ethers.utils.formatEther(details.stake)
                        )}
                        {` ${details.symbol}`}
                      </span>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className="mt-6 font-bold">
            {bets?.length && (
              <NewButton big text="Bet Now" onClick={placeBetsInBetSlip} />
            )}
          </div>
        </div>
      }
    />
  );
};
