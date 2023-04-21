import React, { useEffect, useMemo, useState } from "react";
import { NewTable } from "./NewTable";
import { VaultModalState, VaultTransactionType } from "../../types/vaults";
import { useConfig } from "../../providers/Config";
import { useAccount, useSigner } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";
import { useApi } from "../../providers/Api";
import { useVaultContract } from "../../hooks/contracts";
import { useScannerUrl } from "../../hooks/useScannerUrl";
import { ethers } from "ethers";
import { VaultInfo } from "../../types/config";
import classNames from "classnames";
import utils from "../../utils";
import { NewButton } from "../Buttons";

type Props = {
  setIsModalOpen: (state: VaultModalState) => void;
};

export const NewVaultsTable: React.FC<Props> = ({ setIsModalOpen }) => {
  const config = useConfig();
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const api = useApi();
  const { getIndividualAssetTotal, getIndividualShareTotal } =
    useVaultContract();
  const { data: signer } = useSigner();
  const scanner = useScannerUrl();

  const vaultAddresses = useMemo(() => {
    if (!config) return;

    return config.vaults.map(v => v.address);
  }, [config]);

  const [vaultInfoList, setVaultInfoList] = useState<Array<VaultInfo>>();

  const openModal = ({
    type,
    vault
  }: {
    type: VaultTransactionType;
    vault: VaultInfo;
  }) => {
    if (isConnected)
      return setIsModalOpen({
        type,
        vault
      });

    return openWalletModal();
  };

  useEffect(() => {
    if (!isConnected || !config || !vaultAddresses) return;

    setVaultInfoList(undefined);
    Promise.all(vaultAddresses.map(api.getVaultDetail)).then(infoList => {
      const formatted = infoList.map(i => ({
        ...i,
        totalSupply: ethers.BigNumber.from(i.totalSupply),
        totalAssets: ethers.BigNumber.from(i.totalAssets),
        performance: ethers.BigNumber.from(i.performance)
      }));

      if (!signer) return setVaultInfoList(formatted);

      // add user data
      Promise.all(
        formatted.map(async info => {
          const [userAssetTotal, userShareTotal] = await Promise.all([
            getIndividualAssetTotal(info, signer),
            getIndividualShareTotal(info, signer)
          ]);

          const percentageTotal = ethers.utils.formatUnits(
            userShareTotal.mul("100").div(info.totalSupply.add("1")),
            2
          );

          const userSharePercentage =
            +percentageTotal > 0 && +percentageTotal < 1
              ? `<1`
              : percentageTotal;

          return {
            ...info,
            userAssetTotal,
            userShareTotal,
            userSharePercentage
          };
        })
      ).then(setVaultInfoList);
    });
  }, [config, isConnected, signer, vaultAddresses]);

  const headers = [
    "Name",
    "Token",
    "TVL",
    "My Shares",
    "My Value",
    "My Percentage",
    "Vault Address",
    "Deposit",
    "Withdraw"
  ].map((text, i) => (
    <div
      key={`vaultstable-${text}-${i}`}
      className={classNames(
        "w-full py-4 text-left font-semibold text-hl-primary",
        {
          "!text-hl-secondary": [1, 5].includes(i)
        }
      )}
    >
      {text}
    </div>
  ));

  const rows = vaultInfoList?.length
    ? vaultInfoList.map((vault, i) => {
        const style = "w-full text-left py-4";

        const tvl = `${utils.formatting.formatToFourDecimals(
          ethers.utils.formatUnits(
            vault.totalAssets.add(vault.totalAssetsLocked),
            vault.asset.decimals
          )
        )} ${vault.asset.symbol}`;

        const myShares = utils.formatting.formatToFourDecimals(
          vault.userShareTotal
            ? ethers.utils.formatUnits(
                vault.userShareTotal,
                vault.asset.decimals
              )
            : "0"
        );

        const myValue = utils.formatting.formatToFourDecimals(
          vault.userAssetTotal
            ? ethers.utils.formatUnits(
                vault.userAssetTotal,
                vault.asset.decimals
              )
            : "0"
        );

        const myPercentage = vault.userSharePercentage
          ? `${vault.userSharePercentage}%`
          : "0%";

        const data = [
          vault.name,
          vault.asset.symbol,
          tvl,
          myShares,
          myValue,
          myPercentage
        ];

        return [
          ...data.map((text, i) => (
            <div
              key={`vaultstable-rows-${text}-${i}`}
              className={classNames(style, {
                "!text-hl-secondary": [1, 5].includes(i)
              })}
            >
              {text}
            </div>
          )),
          <div
            className="flex h-full w-full items-center truncate"
            key={`vaultstable-${vault.address}-${i}`}
          >
            <a
              href={`${scanner}/address/${vault.address}`}
              target="_blank"
              rel="noreferrer noopener"
              className={classNames(style, "max-w-[20ch] truncate")}
            >
              {vault.address}
            </a>
          </div>,
          <div
            key={`vaultstable-${VaultTransactionType.DEPOSIT}-${i}`}
            className="relative right-2 flex h-full w-full items-center px-2"
          >
            <NewButton
              text="deposit"
              onClick={() =>
                openModal({
                  type: VaultTransactionType.DEPOSIT,
                  vault
                })
              }
              active
              big
            />
          </div>,
          <div
            key={`vaultstable-${VaultTransactionType.WITHDRAW}-${i}`}
            className="relative right-2 flex h-full w-full items-center px-2"
          >
            <NewButton
              text="withdraw"
              onClick={() =>
                openModal({
                  type: VaultTransactionType.WITHDRAW,
                  vault
                })
              }
              active={false}
              big
            />
          </div>
        ];
      })
    : [];

  return (
    <NewTable
      headers={headers}
      headerStyles="font-basement tracking-wider"
      rows={rows}
    />
  );
};
