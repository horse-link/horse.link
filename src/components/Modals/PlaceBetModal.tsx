import { BigNumber, ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { useConfig } from "../../providers/Config";
import { Back, Runner } from "../../types";
import { getVaultNameFromMarket } from "../../utils/markets";
import { useSigner } from "wagmi";
import Loader from "../Loader/Loader_View";
import Modal from "../Modal";
import { ERC20__factory, Vault__factory } from "../../typechain";
import { Config, MarketInfo } from "../../types/config";
import { getMockBack } from "../../utils/mocks";
import { formatToFourDecimals, formatToTwoDecimals, shortenAddress } from "../../utils/formatting";
import useMarketContract from "../../hooks/market/useMarketContract";

type Props = {
  runner?: Runner;
  isModalOpen: boolean;
  setIsModalOpen: () => void;
};

type Balance = {
  value: BigNumber;
  decimals: number;
  formatted: string;
};

const PlaceBetModal: React.FC<Props> = ({
  runner,
  isModalOpen,
  setIsModalOpen
}) => {
  const [selectedMarket, setSelectedMarket] = useState<MarketInfo>();
  const [wagerAmount, setWagerAmount] = useState<string>();
  const [balance, setBalance] = useState<Balance>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<string>();

  const { data: signer } = useSigner();

  const config = useConfig();
  const { placeBet } = useMarketContract();

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
    if (!selectedMarket || !signer) return;

    const contract = Vault__factory.connect(
      selectedMarket.vaultAddress,
      signer
    );
    (async () => {
      const address = await signer.getAddress();
      const [asset, decimals] = await Promise.all([
        contract.asset(),
        contract.decimals()
      ]);

      const erc20 = ERC20__factory.connect(asset, signer);
      const userBalance = await erc20.balanceOf(address);

      setBalance({
        value: userBalance,
        decimals,
        formatted: formatToFourDecimals(
          ethers.utils.formatUnits(userBalance, decimals)
        )
      });
    })();
  }, [selectedMarket, signer]);

  useEffect(() => {
    if (!isModalOpen) {
      setWagerAmount(undefined);
      setTxHash(undefined);
      setTxLoading(false);
      setError(undefined);
    }
  }, [isModalOpen]);

  const onSelectMarket = (
    event: React.ChangeEvent<HTMLSelectElement>,
    config: Config
  ) => {
    const market = config.markets.find(
      m => m.address.toLowerCase() === event.currentTarget.value.toLowerCase()
    );
    setBalance(undefined);
    setSelectedMarket(market);
  };

  const onClickPlaceBet = async () => {
    if (!selectedMarket || !wagerAmount || !balance || !signer) return;

    const wager = ethers.utils.parseUnits(wagerAmount, balance.decimals);
    try {
      setTxLoading(true);
      const tx = await placeBet(selectedMarket, back, wager, signer);
      setTxHash(tx);
    } catch (err: any) {
      setError(err);
    } finally {
      setTxLoading(false);
    }
  };

  const payout = (+(wagerAmount || "0") * back.odds).toString();

  const isWagerNegative = wagerAmount
    ? +wagerAmount < 0
    : false;
  const isWagerGreaterThanBalance = wagerAmount && balance
    ? ethers.utils.parseUnits(wagerAmount, balance.decimals).gt(balance.value)
    : false;

  return (
    <Modal isOpen={isModalOpen} onClose={setIsModalOpen}>
      {!config ? (
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
                  {getVaultNameFromMarket(config, market.address)}
                </option>
              ))}
            </select>
            <h3 className="font-semibold">Wager Amount</h3>
            <input
              type="number"
              placeholder={wagerAmount || "0"}
              onChange={e => setWagerAmount(e.currentTarget.value)}
              className="border-b-[0.12rem] border-black pl-1 pt-1 mb-6"
            />
            <span className="block font-semibold">
              Payout:{" "}
              <span className="font-normal">
                {formatToFourDecimals(payout)}
              </span>
            </span>
            <span className="block font-semibold mb-2">
              Available:{" "}
              <span className="font-normal">
                {balance?.formatted || <Loader size={14} />}
              </span>
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
            {txHash && (
              <div className="mt-6 px-2 py-4 bg-emerald-400 rounded-md flex flex-col items-center">
                <h4 className="font-semibold mb-1 text-lg">Success!</h4>
                <span className="block">Hash: <a className="italic" href={`${process.env.VITE_SCANNER_URL}/tx/${txHash}`} target="_blank" rel="noreferrer noopener">{shortenAddress(txHash)}</a></span>
              </div>
            )}
            {error && (
              <div className="mt-6 px-2 py-4 bg-red-600 rounded-md flex flex-col items-center">
                <h4 className="font-semibold mb-1 text-lg">Error:</h4>
                <span className="block overflow-ellipsis max-w-[40ch] overflow-hidden">{error}</span>
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </Modal>
  );
};

export default PlaceBetModal;
