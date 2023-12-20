import { ethers } from "ethers";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useConfig } from "../../providers/Config";
import { useSigner } from "wagmi";
import { Loader } from "../";
import { BaseModal } from ".";
import { useMarketContract, useERC20Contract } from "../../hooks/contracts";
import useRefetch from "../../hooks/useRefetch";
import utils from "../../utils";
import { Back } from "../../types/meets";
import { UserBalance } from "../../types/users";
import { useBetSlipContext } from "../../providers/BetSlip";
import { useParams } from "react-router-dom";
import { useTokenContext } from "../../providers/Token";
import { BetEntry } from "../../types/context";
import { Button } from "../Buttons";
import classNames from "classnames";
import { Race, Runner, formatting } from "horselink-sdk";

type Props = {
  runner?: Runner;
  race?: Race;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

export const PlaceBetModal: React.FC<Props> = ({
  runner,
  race,
  isModalOpen,
  setIsModalOpen
}) => {
  const [userBalance, setUserBalance] = useState<UserBalance>();
  const [wagerAmount, setWagerAmount] = useState<string>();
  const [payout, setPayout] = useState<string>();

  const { data: signer } = useSigner();

  const config = useConfig();
  const { getPotentialPayout } = useMarketContract();
  const { getBalance, getDecimals } = useERC20Contract();
  const { shouldRefetch, refetch: refetchUserBalance } = useRefetch();
  const { bets, addBet, placeBetImmediately, forceNewSigner } =
    useBetSlipContext();
  const { number: raceNumber } = useParams();
  const { currentToken } = useTokenContext();

  useEffect(() => {
    if (!signer) return;

    forceNewSigner(signer);
  }, [signer]);

  const market = useMemo(() => {
    if (!config || !currentToken) return;

    return utils.config.getMarketFromToken(currentToken, config);
  }, [config, currentToken]);

  const back = useMemo<Back>(() => {
    if (!runner) return utils.mocks.getMockBack();

    return {
      nonce: runner.nonce,
      market_id: runner.market_id,
      close: runner.close,
      end: runner.end,
      odds: runner.win,
      proposition_id: runner.proposition_id,
      signature: runner.signature
    };
  }, [runner]);

  useEffect(() => {
    if (!market || !signer || !back || !wagerAmount || !userBalance)
      return setPayout("0");

    (async () => {
      setPayout(undefined);
      const payout = await getPotentialPayout(
        market,
        ethers.utils.parseUnits(wagerAmount, userBalance.decimals),
        back,
        signer
      );
      setPayout(ethers.utils.formatUnits(payout, userBalance.decimals));
    })();
  }, [market, signer, back, wagerAmount, userBalance, shouldRefetch]);

  useEffect(() => {
    if (!market || !signer || !config) return;

    (async () => {
      setUserBalance(undefined);
      const assetAddress = utils.config.getVaultFromMarket(market, config)!
        .asset.address;
      const [balance, decimals] = await Promise.all([
        getBalance(assetAddress, signer),
        getDecimals(assetAddress, signer)
      ]);

      setUserBalance({
        value: balance,
        decimals,
        formatted: formatting.formatToFourDecimals(
          ethers.utils.formatUnits(balance, decimals)
        )
      });
    })();
  }, [market, signer, config, shouldRefetch]);

  useEffect(() => {
    if (isModalOpen) return refetchUserBalance();

    setTimeout(() => {
      setWagerAmount(undefined);
    }, 300);
  }, [isModalOpen]);

  const changeWagerAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userBalance) return;

    event.preventDefault();
    const value = event.currentTarget.value;

    if (!RegExp(/^[(\d|.)]*$/).test(value)) return;

    if (value.includes(".")) {
      const decimals = value.split(".")[1];
      if (decimals.length > userBalance.decimals) {
        event.currentTarget.value = wagerAmount || "";
        return;
      }
    }

    setWagerAmount(value);
  };

  const onClickPlaceBet = useCallback(
    async (option?: { betNow: boolean }) => {
      if (!market || !wagerAmount || !runner || !config || !race || !raceNumber)
        return;

      const vault = utils.config.getVaultFromMarket(market, config);
      if (!vault)
        throw new Error(
          `Could not find vault associated with market ${market.address}`
        );

      const betSlip: BetEntry = {
        market,
        back,
        wager: ethers.utils
          .parseUnits(wagerAmount, vault.asset.decimals)
          .toString(),
        runner,
        name: race.name,
        number: race.number,
        timestamp: Math.floor(Date.now() / 1000)
      };

      setIsModalOpen(false);

      if (option?.betNow) {
        await placeBetImmediately(betSlip);
      } else {
        addBet(betSlip);
      }
    },
    [market, back, wagerAmount, race, raceNumber]
  );

  const isWagerNegative = wagerAmount ? +wagerAmount < 0 : false;
  const isWagerGreaterThanBalance =
    wagerAmount && userBalance ? +wagerAmount > +userBalance.formatted : false;

  const isWagerPlusBetsExceedingBalance = useMemo(() => {
    if (
      !bets ||
      !bets.length ||
      !market ||
      !wagerAmount ||
      !config ||
      !userBalance
    )
      return false;

    // find all bets for given market
    const betMarkets = bets.filter(
      bet => bet.market.address.toLowerCase() === market.address.toLowerCase()
    );
    // get sum of all wagers
    const marketSum = betMarkets.reduce((sum, cur) => {
      const betVault = utils.config.getVaultFromMarket(cur.market, config);
      if (!betVault)
        throw new Error(
          `Could not find vault associated with market ${cur.market.address}`
        );

      const formatted = ethers.utils.formatUnits(
        cur.wager,
        betVault.asset.decimals
      );
      const bn = ethers.utils.parseUnits(formatted, betVault.asset.decimals);

      return sum.add(bn);
    }, ethers.constants.Zero);

    const marketVault = utils.config.getVaultFromMarket(market, config);
    if (!marketVault)
      throw new Error(
        `Could not find vault associated with market ${market.address}`
      );

    const userWagerBn = ethers.utils.parseUnits(
      wagerAmount,
      marketVault.asset.decimals
    );

    return marketSum.add(userWagerBn).gt(userBalance.value);
  }, [bets, wagerAmount, market, config, userBalance]);

  const isScratched = runner
    ? utils.races.isScratchedRunner(runner)
    : undefined;

  const shouldDisablePlaceBet =
    !market ||
    !wagerAmount ||
    !signer ||
    !userBalance ||
    !+userBalance.formatted ||
    isWagerNegative ||
    isWagerGreaterThanBalance ||
    isWagerPlusBetsExceedingBalance;

  return (
    <BaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {!config || !runner ? (
        <div className="p-10">
          <Loader />
        </div>
      ) : (
        <div className="p-6">
          <h2
            className={classNames("font-basement text-[32px] tracking-wider", {
              "break-words": runner.name.length > 10
            })}
          >
            {runner.name} ({runner.number})
          </h2>

          <div className="mt-8 flex w-full flex-col items-center gap-y-4 divide-y divide-hl-border">
            <div className="grid w-full grid-cols-2 grid-rows-2 gap-x-2">
              <h3 className="text-left text-hl-secondary">Target odds:</h3>
              <p className="text-left text-hl-tertiary">
                {formatting.formatToTwoDecimals(back.odds.toString())}
              </p>
              <div className="flex items-center">
                <h3 className="text-left text-hl-secondary">Wager amount:</h3>
              </div>
              {/* desktop */}
              <input
                placeholder="0"
                value={wagerAmount}
                onChange={changeWagerAmount}
                className="hidden border border-hl-border bg-hl-background p-2 text-hl-primary !outline-none !ring-0 lg:block"
                disabled={isScratched === true}
              />

              {/* mobile */}
              <input
                placeholder="0"
                value={wagerAmount}
                type="number"
                onChange={changeWagerAmount}
                className="block border border-hl-border bg-hl-background p-2 text-hl-primary !outline-none !ring-0 lg:hidden"
                disabled={isScratched === true}
              />
            </div>
            <div className="grid w-full grid-cols-2 grid-rows-2 gap-2 pt-4">
              <h3 className="text-left text-hl-secondary">Payout:</h3>
              <p className="text-left text-hl-tertiary">
                {formatting.formatToFourDecimals(payout || "0")}
              </p>
              <div className="flex items-center">
                <h3 className="text-left text-hl-secondary">Available:</h3>
              </div>
              <p className="text-left text-hl-tertiary">
                {userBalance?.formatted || "0.0000"} {currentToken?.symbol}
              </p>
            </div>
          </div>

          <span className="block font-semibold text-red-500">
            {isWagerNegative ? (
              <span className="my-6 block">
                Wager amount cannot be negative.
              </span>
            ) : isWagerPlusBetsExceedingBalance ? (
              <span className="my-6 block">
                Current bets plus wager cannot exceed balance.
              </span>
            ) : (
              isWagerGreaterThanBalance && (
                <span className="my-6 block">
                  Wager amount cannot be greater than token balance.
                </span>
              )
            )}
          </span>

          <div className="mt-4 mb-2 flex flex-col gap-2">
            <Button
              big
              white
              rounded
              text="bet now"
              onClick={() => onClickPlaceBet({ betNow: true })}
              disabled={shouldDisablePlaceBet || isScratched === true}
              active={!shouldDisablePlaceBet && isScratched !== true}
            />
            <span className=" blockself-center font-semibold">or</span>
            <Button
              big
              rounded
              text="add to bet slip"
              onClick={() => onClickPlaceBet()}
              disabled={shouldDisablePlaceBet || isScratched === true}
              active={!shouldDisablePlaceBet && isScratched !== true}
            />
          </div>
        </div>
      )}
    </BaseModal>
  );
};
