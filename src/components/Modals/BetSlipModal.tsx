import React, { useEffect, useMemo, useState } from "react";
import { BaseModal } from "./BaseModal";
import { useBetSlipContext } from "../../context/BetSlipContext";
import utils from "../../utils";
import { useConfig } from "../../providers/Config";
import { BigNumber, ethers } from "ethers";
import { Loader } from "../Loader";
import { useMarketContract } from "../../hooks/contracts";
import { useSigner } from "wagmi";
import Skeleton from "react-loading-skeleton";
import constants from "../../constants";
import { SubmitBetsButton } from "../Buttons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const BetSlipModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const config = useConfig();
  const { bets, hashes, txLoading, error } = useBetSlipContext();
  const { data: signer } = useSigner();
  const { getPotentialPayout } = useMarketContract();

  const [payout, setPayout] = useState<
    Record<
      string,
      {
        symbol: string;
        bn: BigNumber;
      }
    >
  >();

  useEffect(() => {
    if (!bets || !bets.length || !config || !signer) return;

    (async () => {
      const payouts = await Promise.all(
        bets.map(async bet => {
          const result = await getPotentialPayout(
            bet.market,
            BigNumber.from(bet.wager),
            bet.back,
            signer
          );

          return {
            market: bet.market,
            payout: result
          };
        })
      );

      const payoutsPerAsset = payouts.reduce((prevObject, p) => {
        const vault = utils.config.getVaultFromMarket(p.market, config);
        if (!vault)
          throw new Error(
            `No Vault associated with market, ${p.market.address}`
          );

        const name = vault.asset.address;
        const units = ethers.utils.formatUnits(p.payout, vault.asset.decimals);
        const parsedUnits = ethers.utils.parseEther(units);

        return {
          ...prevObject,
          [name]: {
            bn: prevObject[name]
              ? prevObject[name].bn.add(parsedUnits)
              : parsedUnits,
            symbol: vault.asset.symbol
          }
        };
      }, {} as NonNullable<typeof payout>);

      setPayout(payoutsPerAsset);
    })();
  }, [bets, config, signer]);

  const stakePerToken = useMemo(() => {
    if (!bets || !bets.length || !config) return;

    return bets.reduce(
      (prevObject, bet) => {
        const vault = utils.config.getVaultFromMarket(bet.market, config);
        if (!vault)
          throw new Error(
            `No Vault associated with market, ${bet.market.address}`
          );

        const name = vault.name;
        const units = ethers.utils.formatUnits(bet.wager, vault.asset.decimals);
        const parsedUnits = ethers.utils.parseEther(units);

        return {
          ...prevObject,
          [name]: {
            bn: prevObject[name]
              ? prevObject[name].bn.add(parsedUnits)
              : parsedUnits,
            symbol: vault.asset.symbol
          }
        };
      },
      {} as Record<
        string,
        {
          bn: BigNumber;
          symbol: string;
        }
      >
    );
  }, [bets, config]);

  return (
    <BaseModal isOpen={isOpen} onClose={!txLoading ? onClose : () => {}}>
      {!config ? (
        <div className="m-10">
          <Loader />
        </div>
      ) : hashes && hashes.length ? (
        <div className="w-[75vw] lg:w-[28rem]">
          <h2 className="font-bold text-2xl">Bet Slip Transactions</h2>
          <ol className="ml-4 mt-6 list-decimal">
            {hashes.map(hash => (
              <li key={hash}>
                <a
                  href={`${constants.env.SCANNER_URL}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hyperlink"
                >
                  {utils.formatting.shortenHash(hash)}
                </a>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="w-[75vw] lg:w-[28rem]">
          <h2 className="font-bold text-2xl">Bet Slip</h2>
          <div className="mt-6 grid grid-cols-2 w-full">
            <h4 className="w-full py-1 font-semibold text-center bg-gray-200 rounded-tl-lg">
              Market
            </h4>
            <h4 className="w-full py-1 font-semibold text-center bg-gray-200 rounded-tr-lg">
              Stake
            </h4>
            {!stakePerToken ? (
              <React.Fragment>
                <Skeleton width="4rem" />
                <Skeleton width="4rem" />
              </React.Fragment>
            ) : (
              [...Object.entries(stakePerToken)].map(([name, stake]) => (
                <React.Fragment key={name}>
                  <div
                    className="p-2 border-gray-200 border-x border-b"
                    key={JSON.stringify(stake)}
                  >
                    {name}
                  </div>
                  <div className="p-2 border-gray-200 border-r border-b">
                    {ethers.utils.formatEther(stake.bn)} {stake.symbol}
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
          <div className="mt-6">
            <h4 className="font-semibold">Potential Payout:</h4>
            {payout ? (
              [...Object.entries(payout)].map(([name, p]) => (
                <span className="block" key={name}>
                  {utils.formatting.formatToFourDecimals(
                    ethers.utils.formatEther(p.bn)
                  )}{" "}
                  {p.symbol}
                </span>
              ))
            ) : (
              <Skeleton />
            )}
          </div>{" "}
          <div className="mt-6">
            <SubmitBetsButton />
          </div>
          {error && (
            <div className="mt-6 rounded-lg bg-red-600 text-white py-4 flex flex-col items-center text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
};
