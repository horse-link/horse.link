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
import { Loader } from "../Loader";

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
        "w-full break-words py-4 text-left text-xs font-semibold text-hl-primary xl:text-base",
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

        const style = `text-left py-4 text-xs xl:text-base w-full`;

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
            className="flex h-full w-full items-center"
            key={`vaultstable-${vault.address}-${i}`}
          >
            <a
              href={`${scanner}/address/${vault.address}`}
              target="_blank"
              rel="noreferrer noopener"
              className={classNames(
                style,
                "max-w-[10ch] truncate 3xl:max-w-[20ch]"
              )}
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

  const loading = [
    [
      <div key="vaultstable-loading-blank" />,
      <div className="py-4" key="vaultstable-loading-message">
        Loading...
      </div>
    ]
  ];

  return (
    <React.Fragment>
      {/* non-mobile */}
      <div className="hidden lg:block">
        <NewTable
          headers={headers}
          headerStyles="font-basement tracking-wider"
          rows={!vaultInfoList?.length ? loading : rows}
        />
      </div>

      {/* mobile */}
      <div className="block lg:hidden">
        {!vaultInfoList?.length ? (
          <div className="flex w-full justify-center py-10">
            <Loader />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            {vaultInfoList.map(vault => {
              const tvl = `${utils.formatting.formatToFourDecimals(
                ethers.utils.formatUnits(
                  vault.totalAssets.add(vault.totalAssetsLocked),
                  vault.asset.decimals
                )
              )} ${vault.asset.symbol}`;

              return (
                <div
                  key={vault.address}
                  className="flex w-full flex-col items-center gap-y-2 border-t border-hl-border py-2 text-center"
                >
                  <h2 className="font-basement tracking-wider text-hl-secondary">
                    {vault.name}
                  </h2>
                  <p>{tvl}</p>
                  <a
                    href={`${scanner}/address/${vault.address}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full max-w-full truncate"
                  >
                    {vault.address}
                  </a>
                  <div className="flex w-full items-center gap-x-2">
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
