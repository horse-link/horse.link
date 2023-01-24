import React, { useEffect, useMemo, useState } from "react";
import { BaseModal } from "./BaseModal";
import { useBetSlipContext } from "../../context/BetSlipContext";
import utils from "../../utils";
import { useConfig } from "../../providers/Config";
import { BigNumber, ethers } from "ethers";
import { Loader } from "../Loader";
import dayjs from "dayjs";
import { useMarketContract } from "../../hooks/contracts";
import { useSigner } from "wagmi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const BetSlipModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const config = useConfig();
  const { bets } = useBetSlipContext();
  const { data: signer } = useSigner();
  const { getPotentialPayout } = useMarketContract();

  const [payout, setPayout] = useState<Record<string, BigNumber>>();

  useEffect(() => {
    if (!bets || !bets.length || !config || !signer) return;

    (async () => {
      // get array of market and payouts,
      // shape below:

      //  {
      //    market: MarketInfo;
      //    payout: BigNumber;
      //  }[];

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

      // take payouts and reduce to market -> total potential payout values, Record<string, BigNumber>
      const payoutsPerMarket = payouts.reduce((prevObject, p) => {
        const vault = utils.config.getVaultFromMarket(p.market, config);
        if (!vault)
          throw new Error(
            `No Vault associated with market, ${p.market.address}`
          );

        const name = vault.name;
        const units = ethers.utils.formatUnits(p.payout, vault.asset.decimals);
        const parsedUnits = ethers.utils.parseEther(units);

        return {
          ...prevObject,
          [name]: prevObject[name]
            ? prevObject[name].add(parsedUnits)
            : parsedUnits
        };
      }, {} as Record<string, BigNumber>);

      // set state
      setPayout(payoutsPerMarket);
    })();
  }, [bets, config, signer]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {!config ? (
        <div className="m-10">
          <Loader />
        </div>
      ) : (
        <div className="max-w-[95vw] lg:min-w-[28rem]">
          <div className="flex justify-between items-center pr-8">
            <h2 className="font-bold text-2xl">Bet Slip</h2>
            <h3 className="text-black/50 italic">
              {dayjs().format("MM-DD-YYYY")}
            </h3>
          </div>
          <div className="mt-6 grid grid-cols-2 w-full">
            <h4 className="w-full font-semibold text-center bg-gray-200 rounded-tl-xl">
              Market
            </h4>
            <h4 className="w-full font-semibold text-center bg-gray-200 rounded-tr-xl">
              Stake
            </h4>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold">Potential Payout:</h4>
          </div>
        </div>
      )}
    </BaseModal>
  );
};
