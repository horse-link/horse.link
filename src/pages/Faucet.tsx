import { ethers } from "ethers";
import { AddressLink, Card, PageLayout } from "../components";
import React, { useEffect, useState } from "react";
import { FaucetBalance } from "../types/faucet";
import { useConfig } from "../providers/Config";
import { ERC20__factory } from "../typechain";
import { useAccount, useBalance, useSigner } from "wagmi";
import utils from "../utils";
import ClipLoader from "react-spinners/ClipLoader";
import { ClaimTokensButton } from "../components/Buttons";
import api from "../apis/Api";
import { useWalletModal } from "../providers/WalletModal";
import { FaucetModal } from "../components/Modals";
import { AiOutlineCopy } from "react-icons/ai";

const FAUCET_ADDRESS = "0xf919eaf2e37aac718aa19668b9071ee42c02c081";

const Faucet: React.FC = () => {
  const config = useConfig();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({
    address: FAUCET_ADDRESS
  });
  const { openWalletModal } = useWalletModal();
  const [balances, setBalances] = useState<Array<FaucetBalance>>();
  const [hash, setHash] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // fetch balances
  useEffect(() => {
    if (!config || !signer || !ethBalance) return;

    Promise.all(
      config.tokens.map(async t => {
        const contract = ERC20__factory.connect(t.address, signer);
        const [balance, decimals, symbol] = await Promise.all([
          contract.balanceOf(FAUCET_ADDRESS),
          contract.decimals(),
          contract.symbol()
        ]);

        return {
          name: t.name,
          amount: balance,
          symbol,
          decimals
        };
      })
    )
      .then(b => {
        const newBalances = [
          {
            name: "ETH",
            symbol: "ETH",
            amount: ethBalance.value,
            decimals: ethBalance.decimals
          },
          ...b
        ];

        setBalances(newBalances);
      })
      .catch(console.error);
  }, [config, signer, ethBalance]);

  const claim = async (tokenAddress: string) => {
    if (!address) return openWalletModal();

    setHash(undefined);

    try {
      const res = await api.requestTokenFromFaucet(address, tokenAddress);
      setHash(res.tx);
      setIsModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <PageLayout>
      {balances ? (
        <div className="mb-4 w-full gap-x-1 gap-y-2 lg:gap-x-4 lg:gap-y-4 grid lg:grid-cols-4">
          {balances?.map(b => (
            <Card
              key={b.name}
              title={b.name}
              data={`${utils.formatting.formatToFourDecimals(
                ethers.utils.formatUnits(b.amount, b.decimals)
              )} ${b.symbol}`}
            />
          ))}
        </div>
      ) : (
        <div className="mb-4 w-full">
          <Card title="Loading faucet balances..." />
        </div>
      )}
      <h3 className="mb-3 text-lg font-medium text-gray-900">Faucet</h3>
      <div className="container-fluid overflow-hidden rounded-lg bg-emerald-700 px-4 py-5 shadow sm:p-6">
        <h2 className="mb-3 text-lg font-medium text-gray-900">
          Claim tokens on the Goerli Testnet and start punting!
        </h2>
        <p className="my-2 text-xs">
          You can find the faucet at{" "}
          {<AddressLink address={FAUCET_ADDRESS} className="underline" />}. This
          page is used for testing the beta functionality of the web app, and
          does not have any bearing on real world earnings, winnings, and/or
          losses; it is purely for testing.
        </p>
      </div>
      <div className="mt-4 w-1/2 gap-4 grid grid-cols-6">
        {config ? (
          config.tokens.map(t => (
            <React.Fragment>
              <div
                className="w-full flex items-center col-span-2"
                key={`button-${t.address}`}
              >
                <ClaimTokensButton
                  tokenName={t.name}
                  onClick={() => claim(t.address)}
                />
              </div>
              <div
                className="w-full col-span-4"
                key={`description-${t.address}`}
              >
                <div className="w-full h-full px-4 bg-white rounded-md flex items-center">
                  {t.name} address:
                  <AddressLink address={t.address} className="ml-2 underline" />
                  <button
                    className="ml-1 rounded-full p-1 hover:bg-emerald-400"
                    onClick={() => navigator.clipboard.writeText(t.address)}
                  >
                    <AiOutlineCopy />
                  </button>
                </div>
              </div>
            </React.Fragment>
          ))
        ) : (
          <ClipLoader />
        )}
      </div>
      <FaucetModal isOpen={isModalOpen} onClose={closeModal} txHash={hash} />
    </PageLayout>
  );
};

export default Faucet;
