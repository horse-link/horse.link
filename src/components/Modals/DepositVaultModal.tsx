import React, { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import { VaultInfo } from "../../types/config";
import { BaseModal } from ".";
import { ethers } from "ethers";
import { Web3ErrorHandler, Web3SuccessHandler } from "../Web3Handlers";
import { useVaultContract, useERC20Contract } from "../../hooks/contracts";
import useRefetch from "../../hooks/useRefetch";
import utils from "../../utils";
import { UserBalance } from "../../types/users";
import { Loader } from "../";

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
  const [userBalance, setUserBalance] = useState<UserBalance>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<ethers.errors>();

  const { data: signer } = useSigner();

  const { deposit } = useVaultContract();
  const { getBalance, getDecimals } = useERC20Contract();
  const { shouldRefetch, refetch: refetchUserBalance } = useRefetch();

  useEffect(() => {
    if (!signer) return;

    (async () => {
      setUserBalance(undefined);
      const assetAddress = vault.asset.address;
      const [balance, decimals] = await Promise.all([
        getBalance(assetAddress, signer),
        getDecimals(assetAddress, signer)
      ]);

      setUserBalance({
        value: balance,
        decimals,
        formatted: utils.formatting.formatToFourDecimals(
          ethers.utils.formatUnits(balance, decimals)
        )
      });
    })();
  }, [signer, shouldRefetch]);

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
    if (!txLoading) return refetchUserBalance();

    setError(undefined);
    setTxHash(undefined);
  }, [txLoading]);

  const changeDepositAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userBalance) return;

    event.preventDefault();
    const value = event.currentTarget.value;

    if (value.includes(".")) {
      const decimals = value.split(".")[1];
      if (decimals.length > userBalance.decimals) {
        event.currentTarget.value = depositAmount || "";
        return;
      }
    }

    setDepositAmount(value);
  };

  const onClickDeposit = async () => {
    if (!depositAmount || !userBalance || !signer) return;

    const amount = ethers.utils.parseUnits(depositAmount, userBalance.decimals);
    setTxHash(undefined);
    setError(undefined);

    try {
      setTxLoading(true);
      const tx = await deposit(vault, amount, signer);
      setTxHash(tx);
    } catch (err: any) {
      setError(err);
    } finally {
      setTxLoading(false);
    }
  };

  const isDepositNegative = depositAmount ? +depositAmount < 0 : false;
  const isDepositGreaterThanBalance =
    depositAmount && userBalance
      ? +depositAmount > +userBalance.formatted
      : false;

  return (
    <BaseModal isOpen={isModalOpen} onClose={closeModal}>
      <h2 className="font-bold text-2xl mr-[8vw] mb-6">Deposit</h2>
      <div className="flex flex-col">
        <h3 className="font-semibold mb-2">
          Name: <span className="font-normal">{vault.name}</span>
        </h3>
        <h3 className="font-semibold mb-2">
          Available:{" "}
          <span className="font-normal">
            {userBalance?.formatted || <Loader size={14} />}
          </span>
        </h3>
        {!txHash && !error && (
          <React.Fragment>
            <h3 className="font-semibold">Deposit Amount</h3>
            <input
              type="number"
              placeholder="0"
              onChange={changeDepositAmount}
              className="border-b-[0.12rem] border-black pl-1 pt-1 mb-6 disabled:text-black/50 disabled:bg-white transition-colors duration-100"
              disabled={txLoading || !userBalance}
            />
            <button
              className="w-full font-bold border-black border-2 py-2 rounded-md relative top-6 hover:text-white hover:bg-black transition-colors duration-100 disabled:text-black/50 disabled:border-black/50 disabled:bg-white"
              onClick={onClickDeposit}
              disabled={
                !depositAmount ||
                !signer ||
                !userBalance ||
                +userBalance.formatted === 0 ||
                txLoading ||
                isDepositNegative ||
                isDepositGreaterThanBalance
              }
            >
              {txLoading ? <Loader /> : `DEPOSIT ${vault.asset.symbol}`}
            </button>
            <br />
          </React.Fragment>
        )}
        {txHash && (
          <Web3SuccessHandler
            hash={txHash}
            message="Your deposit has been placed with"
          />
        )}
        {error && <Web3ErrorHandler error={error} />}
      </div>
    </BaseModal>
  );
};
