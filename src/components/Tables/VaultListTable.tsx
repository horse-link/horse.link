import React from "react";
import { BaseTable } from ".";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { Config, VaultInfo } from "../../types/config";
import { VaultModalState, VaultTransactionType } from "../../types/vaults";
import { useAccount } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";
import utils from "../../utils";
import { ethers } from "ethers";
import { VaultActionButton } from "../Buttons";
import Skeleton from "react-loading-skeleton";

const SCANNER_URL = process.env.VITE_SCANNER_URL;
if (!SCANNER_URL) throw new Error("No VITE_SCANNER_URL env provided");

type Props = {
  config?: Config;
  setIsModalOpen: (state: VaultModalState) => void;
};

export const VaultListTable: React.FC<Props> = ({ config, setIsModalOpen }) => {
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const getVaultListData = (vault: VaultInfo): TableData[] => [
    {
      title: vault.name,
      classNames: "!pl-5 !pr-2"
    },
    {
      title: vault.asset.symbol
    },
    {
      title: `$${utils.formatting.formatToFourDecimals(
        ethers.utils.formatUnits(vault.totalAssets, vault.asset.decimals)
      )}`
    },
    {
      title: (
        <a
          href={`${SCANNER_URL}/address/${vault.address}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-blue-600"
        >
          {vault.address}
        </a>
      )
    },
    {
      title: (
        <React.Fragment>
          <VaultActionButton
            title="DEPOSIT"
            vault={vault}
            isConnected={isConnected}
            openWalletModal={openWalletModal}
            setIsModalOpen={setIsModalOpen}
            type={VaultTransactionType.DEPOSIT}
          />
          <VaultActionButton
            title="WITHDRAW"
            vault={vault}
            isConnected={isConnected}
            openWalletModal={openWalletModal}
            setIsModalOpen={setIsModalOpen}
            type={VaultTransactionType.WITHDRAW}
          />
        </React.Fragment>
      )
    }
  ];

  const HEADERS: TableHeader[] = [
    {
      title: "Name",
      classNames: "!pl-5 !pr-2"
    },
    {
      title: "Token"
    },
    {
      title: "TVL"
    },
    {
      title: "Vault Address"
    },
    {
      title: "Deposit / Withdraw"
    }
  ];

  const ROWS: TableRow[] = config
    ? config.vaults.map(vault => ({
        data: getVaultListData(vault)
      }))
    : utils.tables.getBlankRow(<Skeleton />, HEADERS.length, 0);

  return (
    <BaseTable title="Vaults / Liquidity Pools" headers={HEADERS} rows={ROWS} />
  );
};
