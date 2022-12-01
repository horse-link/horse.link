import React, { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { VaultInfo } from "../../types/config";
import Modal from "../Modal";
import Loader from "../Loader";
import { ethers } from "ethers";
import { Web3ErrorHandler, Web3SuccessHandler } from "../Web3Handlers";
import { useVaultContract } from "../../hooks/contracts";
import { Vault__factory } from "../../typechain";
import useRefetch from "../../hooks/useRefetch";
import { UserBalance } from "../../types/users";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
  vault: VaultInfo;
};

export const WithdrawVaultModal: React.FC<Props> = ({
  isModalOpen,
  closeModal,
  vault
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>();
  const [userAssets, setUserAssets] = useState<UserBalance>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<ethers.errors>();

  const { address } = useAccount();
  const { data: signer } = useSigner();

  const { withdraw } = useVaultContract();
  const { shouldRefetch, refetch: refetchUserShares } = useRefetch();

  useEffect(() => {
    if (!signer || !address) return;

    setUserAssets(undefined);
    const vaultContract = Vault__factory.connect(vault.address, signer);
    (async () => {
      const [shares, decimals] = await Promise.all([
        vaultContract.balanceOf(address),
        vaultContract.decimals()
      ]);
      const assets = await vaultContract.convertToAssets(shares);
      setUserAssets({
        value: assets,
        decimals,
        formatted: ethers.utils.formatUnits(assets, decimals)
      });
    })();
  }, [signer, address, shouldRefetch]);

  useEffect(() => {
    if (isModalOpen) return refetchUserShares();

    setTimeout(() => {
      setWithdrawAmount(undefined);
      setTxHash(undefined);
      setTxLoading(false);
      setError(undefined);
    }, 300);
  }, [isModalOpen]);

  useEffect(() => {
    if (!txHash) return;

    refetchUserShares();
  }, [txHash]);

  const changeWithdrawAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userAssets) return;

    event.preventDefault();
    const value = event.currentTarget.value;

    if (value.includes(".")) {
      const decimals = value.split(".")[1];
      if (decimals.length > userAssets.decimals) {
        event.currentTarget.value = withdrawAmount || "";
        return;
      }
    }

    setWithdrawAmount(value);
  };

  const onClickWithdraw = async () => {
    if (!withdrawAmount || !userAssets || !signer) return;

    const amount = ethers.utils.parseUnits(withdrawAmount, userAssets.decimals);
    setTxHash(undefined);
    setError(undefined);

    try {
      setTxLoading(true);
      const tx = await withdraw(vault, amount, signer);
      setTxHash(tx);
    } catch (err: any) {
      setError(err);
    } finally {
      setTxLoading(false);
    }
  };

  const isWithdrawNegative = withdrawAmount ? +withdrawAmount < 0 : false;
  const isWithdrawGreaterThanAssets =
    withdrawAmount && userAssets
      ? +withdrawAmount > +userAssets.formatted
      : false;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <h2 className="font-bold text-2xl mr-[8vw] mb-6">Withdraw</h2>
      <div className="flex flex-col">
        <h3 className="font-semibold mb-2">
          Name: <span className="font-normal">{vault.name}</span>
        </h3>
        <h3 className="font-semibold mb-2">
          Available:{" "}
          <span className="font-normal">
            {userAssets?.formatted || <Loader size={14} />}
          </span>
        </h3>
        <h3 className="font-semibold">Withdraw Amount</h3>
        <input
          type="number"
          placeholder="0"
          onChange={changeWithdrawAmount}
          className="border-b-[0.12rem] border-black pl-1 pt-1 mb-6 disabled:text-black/50 disabled:bg-white transition-colors duration-100"
          disabled={txLoading || !userAssets}
        />
        <button
          className="w-full font-bold border-black border-2 py-2 rounded-md relative top-6 hover:text-white hover:bg-black transition-colors duration-100 disabled:text-black/50 disabled:border-black/50 disabled:bg-white"
          onClick={onClickWithdraw}
          disabled={
            !withdrawAmount ||
            !signer ||
            !userAssets ||
            +userAssets.formatted === 0 ||
            txLoading ||
            isWithdrawNegative ||
            isWithdrawGreaterThanAssets
          }
        >
          {txLoading ? <Loader /> : `WITHDRAW ${vault.asset.symbol}`}
        </button>
        <br />
        {txHash && <Web3SuccessHandler hash={txHash} />}
        {error && <Web3ErrorHandler error={error} />}
      </div>
    </Modal>
  );
};
