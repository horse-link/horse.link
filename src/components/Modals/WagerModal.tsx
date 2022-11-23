import { BigNumber, ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { useConfig } from "../../providers/Config";
import { Back, Runner } from "../../types";
import { getVaultNameFromMarket } from "../../utils/markets";
import { useAccount, useProvider } from "wagmi";
import Loader from "../Loader/Loader_View";
import Modal from "../Modal";
import { ERC20__factory, Vault__factory } from "../../typechain";
import { MarketInfo } from "../../types/config";
import { getMockBack } from "../../utils/mocks";
import { formatToFourDecimals } from "../../utils/formatting";
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

const WagerModal: React.FC<Props> = ({
  runner,
  isModalOpen,
  setIsModalOpen
}) => {
  const [selectedMarket, setSelectedMarket] = useState<MarketInfo>();
  const [wagerAmount, setWagerAmount] = useState<string>();
  const [balance, setBalance] = useState<Balance>();
  
  const provider = useProvider();
  const { address } = useAccount();

  const config = useConfig();
  const { placeBet } = useMarketContract();

  const now = useMemo(() => Date.now().toString(), []);

  const back = useMemo<Back>(() => {
    if (!runner) return getMockBack();

    return {
      nonce: now,
      market_id: runner.market_id,
      close: runner.close,
      end: runner.end,
      odds: runner.odds / 1000,
      proposition_id: runner.proposition_id,
      signature: runner.signature
    };
  }, [runner, now]);

  useEffect(() => {
    if (!config) return;

    setSelectedMarket(config.markets[0]);
  }, [config]);

  useEffect(() => {
    if (!selectedMarket || !address) return;

    const contract = Vault__factory.connect(selectedMarket.vaultAddress, provider);
    (async () => {
      const [
        asset,
        decimals
      ] = await Promise.all([
        contract.asset(),
        contract.decimals()
      ]);

      const erc20 = ERC20__factory.connect(asset, provider);
      const userBalance = await erc20.balanceOf(address);

      return {
        value: userBalance,
        decimals,
        formatted: formatToFourDecimals(ethers.utils.formatUnits(userBalance, decimals))
      };
    })().then(setBalance);
  }, [selectedMarket, address]);

  const onClickMarket = (market: MarketInfo) => {
    setBalance(undefined);
    setSelectedMarket(market);
  };

  const payout = (+(wagerAmount || "0") * back.odds).toString();

  const onClickPlaceBet = () => {
    placeBet(selectedMarket?.address, back, wagerAmount);
  };

  return (
    <Modal isOpen={isModalOpen} onClose={setIsModalOpen}>
      {!config ? (
        <Loader />
      ) : (
        <div>
          <h2>Target Odds {back.odds}</h2>
          <div>
            <h3>Markets</h3>
            {config.markets.map(market => (
              <button
                key={market.address}
                className="block"
                style={{
                  color: market.address.toLowerCase() === selectedMarket?.address.toLowerCase() ? "green": "red"
                }}
                onClick={() => onClickMarket(market)}
              >
                {getVaultNameFromMarket(config, market.address)}
              </button>
            ))}
            <br />
            <h3>Wager Amount</h3>
            <input
              placeholder={wagerAmount || "0"}
              onChange={e => setWagerAmount(e.currentTarget.value)}
            />
            <br />
            <span className="block">Payout: {formatToFourDecimals(payout) || <Loader />}</span>
            <span className="block">Available: {balance?.formatted || <Loader />}</span>
            <br />
            <button onClick={onClickPlaceBet}>Place bet</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default WagerModal;
