import { BigNumber, ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { useConfig } from "../../providers/Config";
import { Back, Runner } from "../../types";
import { getVaultNameFromMarket } from "../../utils/markets";
import { useAccount, useSigner } from "wagmi";
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

const PlaceBetModal: React.FC<Props> = ({
  runner,
  isModalOpen,
  setIsModalOpen
}) => {
  const [selectedMarket, setSelectedMarket] = useState<MarketInfo>();
  const [wagerAmount, setWagerAmount] = useState<string>();
  const [balance, setBalance] = useState<Balance>();
  const [txHash, setTxHash] = useState<string>();
  
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const config = useConfig();
  const { placeBet } = useMarketContract();

  const back = useMemo<Back>(() => {
    if (!runner) return getMockBack();

    return {
      nonce: runner.nonce,
      market_id: runner.market_id,
      close: runner.close,
      end: runner.end,
      odds: runner.odds / 1000,
      proposition_id: runner.proposition_id,
      signature: runner.signature
    };
  }, [runner]);

  useEffect(() => {
    if (!config) return;

    setSelectedMarket(config.markets[0]);
  }, [config]);

  useEffect(() => {
    if (!selectedMarket || !address || !signer) return;

    const contract = Vault__factory.connect(selectedMarket.vaultAddress, signer);
    (async () => {
      const [
        asset,
        decimals
      ] = await Promise.all([
        contract.asset(),
        contract.decimals()
      ]);

      const erc20 = ERC20__factory.connect(asset, signer);
      const userBalance = await erc20.balanceOf(address);

      setBalance({
        value: userBalance,
        decimals,
        formatted: formatToFourDecimals(ethers.utils.formatUnits(userBalance, decimals))
      });
    })();
  }, [selectedMarket, address, signer]);

  useEffect(() => {
    if (!isModalOpen) setWagerAmount(undefined);
  }, [isModalOpen]);

  const onClickMarket = (market: MarketInfo) => {
    if (selectedMarket?.address.toLowerCase() === market.address.toLowerCase()) return;
    setBalance(undefined);
    setSelectedMarket(market);
  };

  const onClickPlaceBet = async () => {
    if (!selectedMarket || !wagerAmount || !balance || !signer) return;
    const wager = ethers.utils.parseUnits(wagerAmount, balance.decimals);
    const tx = await placeBet(selectedMarket.address, back, wager, signer);
    setTxHash(tx);
  };

  const payout = (+(wagerAmount || "0") * back.odds).toString();

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
            <button onClick={onClickPlaceBet} disabled={!selectedMarket || !wagerAmount || !signer || !balance || +balance.formatted == 0}>Place bet</button>
            <br />
            {txHash && (
              <div>
                <p>Success! tx: {txHash}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PlaceBetModal;
