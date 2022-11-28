import React, { useEffect, useState } from "react";
import useUserBalance from "../../hooks/token/useUserBalance";
import { useSigner } from "wagmi";
import { VaultInfo } from "../../types/config";
import Modal from "../Modal";
import Loader from "../Loader";
import { ethers } from "ethers";
import { Web3ErrorHandler, Web3SuccessHandler } from "../Web3Handlers";
import useVaultContract from "src/hooks/vault/useVaultContract";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
  vault: VaultInfo;
};

export const DepositVaultModal: React.FC<Props> = ({
  isModalOpen,
  closeModal,
  vault
}) => {
  const [depositAmount, setDepositAmount] = useState<string>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<ethers.errors>();

  const { data: signer } = useSigner();

  const { balance, refetch: refetchUserBalance } = useUserBalance(
    vault.asset.address,
    signer
  );
  const { deposit } = useVaultContract();

  useEffect(() => {
    if (isModalOpen) return refetchUserBalance();

    setTimeout(() => {
      setDepositAmount(undefined);
      setTxHash(undefined);
      setTxLoading(false);
      setError(undefined);
    }, 300);
  }, [isModalOpen]);

  useEffect(() => {
    if (!txHash) return;

    refetchUserBalance();
  }, [txHash]);

  const changeDepositAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!balance) return;

    event.preventDefault();
    const value = event.currentTarget.value;

    if (value.includes(".")) {
      const decimals = value.split(".")[1];
      if (decimals.length > balance.decimals) {
        event.currentTarget.value = depositAmount || "";
        return;
      }
    }

    setDepositAmount(value);
  };

  const onClickDeposit = async () => {
    if (!depositAmount || !balance || !signer) return;

    const amount = ethers.utils.parseUnits(depositAmount, balance.decimals);
    setTxHash(undefined);
    setError(undefined);

    try {
      setTxLoading(true);
      const tx = await deposit(vault, amount, signer);
      setTxHash(tx);
    } catch (err: any) {
      setError(err.code as ethers.errors);
    } finally {
      setTxLoading(false);
    }
  };

  const isDepositNegative = depositAmount ? +depositAmount < 0 : false;
  const isDepositGreaterThanBalance =
    depositAmount && balance ? +depositAmount > +balance.formatted : false;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <h2 className="font-bold text-2xl mr-[8vw] mb-6">Deposit</h2>
      <div className="flex flex-col">
        <h3 className="font-semibold mb-2">
          Name: <span className="font-normal">{vault.name}</span>
        </h3>
        <h3 className="font-semibold mb-2">
          Available:{" "}
          <span className="font-normal">
            {balance?.formatted || <Loader size={14} />}
          </span>
        </h3>
        <h3 className="font-semibold">Deposit Amount</h3>
        <input
          type="number"
          placeholder={"0"}
          onChange={changeDepositAmount}
          className="border-b-[0.12rem] border-black pl-1 pt-1 mb-6 disabled:text-black/50 disabled:bg-white transition-colors duration-100"
          disabled={txLoading || !balance}
        />
        <button
          className="w-full font-bold border-black border-2 py-2 rounded-md relative top-6 hover:text-white hover:bg-black transition-colors duration-100 disabled:text-black/50 disabled:border-black/50 disabled:bg-white"
          onClick={onClickDeposit}
          disabled={
            !depositAmount ||
            !signer ||
            !balance ||
            +balance.formatted === 0 ||
            txLoading ||
            isDepositNegative ||
            isDepositGreaterThanBalance
          }
        >
          {txLoading ? <Loader /> : `DEPOSIT ${vault.asset.symbol}`}
        </button>
        <br />
        {txHash && <Web3SuccessHandler hash={txHash} />}
        {error && <Web3ErrorHandler error={error} />}
      </div>
    </Modal>
  );
};
