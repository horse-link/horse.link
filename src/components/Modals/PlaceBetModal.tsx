import { ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { useConfig } from "../../providers/Config";
import { Back, Runner } from "../../types";
import { getVaultFromMarket, getVaultNameFromMarket } from "../../utils/config";
import { useAccount, useSigner } from "wagmi";
import Loader from "../Loader";
import Modal from "../Modal";
import { Config, MarketInfo } from "../../types/config";
import { getMockBack } from "../../utils/mocks";
import {
  formatToFourDecimals,
  formatToTwoDecimals
} from "../../utils/formatting";
import useMarketContract from "../../hooks/market/useMarketContract";
import { Web3ErrorHandler, Web3SuccessHandler } from "../Web3Handlers";
import useUserBalance from "../../hooks/token/useUserBalance";

type Props = {
  runner?: Runner;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

export const PlaceBetModal: React.FC<Props> = ({
  runner,
  isModalOpen,
  setIsModalOpen
}) => {
  const [selectedMarket, setSelectedMarket] = useState<MarketInfo>();
  const [wagerAmount, setWagerAmount] = useState<string>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<ethers.errors>();

  const { data: signer } = useSigner();
  const { address } = useAccount();

  const config = useConfig();
  const { placeBet } = useMarketContract();
  const { balance, refetch: refetchUserBalance } = useUserBalance(
    address,
    getVaultFromMarket(selectedMarket, config)?.asset.address,
    signer
  );

  const back = useMemo<Back>(() => {
    if (!runner) return getMockBack();

    return {
      nonce: runner.nonce,
      market_id: runner.market_id,
      close: runner.close,
      end: runner.end,
      odds: runner.odds,
      proposition_id: runner.proposition_id,
      signature: runner.signature
    };
  }, [runner]);

  useEffect(() => {
    if (!config) return;

    setSelectedMarket(config.markets[0]);
  }, [config]);

  useEffect(() => {
    if (!txLoading) return;

    setError(undefined);
    setTxHash(undefined);
  }, [txLoading]);

  useEffect(() => {
    if (isModalOpen) return refetchUserBalance();

    setTimeout(() => {
      setWagerAmount(undefined);
      setTxHash(undefined);
      setTxLoading(false);
      setError(undefined);
    }, 300);
  }, [isModalOpen]);

  useEffect(() => {
    if (!txHash) return;

    refetchUserBalance();
  }, [txHash]);

  const onSelectMarket = (
    event: React.ChangeEvent<HTMLSelectElement>,
    config: Config
  ) => {
    const market = config.markets.find(
      m => m.address.toLowerCase() === event.currentTarget.value.toLowerCase()
    );
    setSelectedMarket(market);
  };

  const changeWagerAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!balance) return;

    event.preventDefault();
    const value = event.currentTarget.value;

    if (value.includes(".")) {
      const decimals = value.split(".")[1];
      if (decimals.length > balance.decimals) {
        event.currentTarget.value = wagerAmount || "";
        return;
      }
    }

    setWagerAmount(value);
  };

  const onClickPlaceBet = async () => {
    if (!selectedMarket || !wagerAmount || !balance || !signer) return;

    const wager = ethers.utils.parseUnits(wagerAmount, balance.decimals);
    setTxHash(undefined);
    setError(undefined);

    try {
      setTxLoading(true);
      const tx = await placeBet(selectedMarket, back, wager, signer);
      setTxHash(tx);
    } catch (err: any) {
      setError(err.code as ethers.errors);
    } finally {
      setTxLoading(false);
    }
  };

  const payout = (+(wagerAmount || "0") * back.odds).toString();

  const isWagerNegative = wagerAmount ? +wagerAmount < 0 : false;
  const isWagerGreaterThanBalance =
    wagerAmount && balance ? +wagerAmount > +balance.formatted : false;

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {!config || !runner ? (
        <div className="p-10">
          <Loader />
        </div>
      ) : (
        <React.Fragment>
          <h2 className="font-bold text-2xl mr-[8vw] mb-6">
            Target Odds {formatToTwoDecimals(back.odds.toString())}
          </h2>
          <div className="flex flex-col">
            <h3 className="font-semibold">Markets</h3>
            <select
              onChange={e => onSelectMarket(e, config)}
              className="border-[0.12rem] border-black mt-1 mb-6"
            >
              {config.markets.map(market => (
                <option
                  key={market.address}
                  className="block"
                  value={market.address}
                >
                  {getVaultNameFromMarket(market.address, config)}
                </option>
              ))}
            </select>
            <h3 className="font-semibold">Wager Amount</h3>
            <input
              type="number"
              placeholder={wagerAmount || "0"}
              onChange={changeWagerAmount}
              className="border-b-[0.12rem] border-black pl-1 pt-1 mb-6 disabled:text-black/50 disabled:bg-white transition-colors duration-100"
              disabled={txLoading}
            />
            <span className="block font-semibold">
              Payout:{" "}
              <span className="font-normal">
                {formatToFourDecimals(payout)}
              </span>
            </span>
            <span className="block font-semibold">
              Available:{" "}
              <span className="font-normal">
                {balance?.formatted || <Loader size={14} />}
              </span>
            </span>
            <span className="text-red-500 block font-semibold">
              {isWagerNegative && "Wager amount cannot be negative"}
              {isWagerGreaterThanBalance && "Wager amount cannot be greater than token balance"}
            </span>
            <button
              className="w-full font-bold border-black border-2 py-2 rounded-md relative top-6 hover:text-white hover:bg-black transition-colors duration-100 disabled:text-black/50 disabled:border-black/50 disabled:bg-white"
              onClick={onClickPlaceBet}
              disabled={
                !selectedMarket ||
                !wagerAmount ||
                !signer ||
                !balance ||
                +balance.formatted === 0 ||
                txLoading ||
                isWagerNegative ||
                isWagerGreaterThanBalance
              }
            >
              {txLoading ? <Loader /> : "PLACE BET"}
            </button>
            <br />
            {txHash && <Web3SuccessHandler hash={txHash} />}
            {error && <Web3ErrorHandler error={error} />}
          </div>
        </React.Fragment>
      )}
    </Modal>
  );
};
