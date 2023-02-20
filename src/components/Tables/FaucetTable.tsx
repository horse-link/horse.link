import React from "react";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { useConfig } from "../../providers/Config";
import Skeleton from "react-loading-skeleton";
import { TokenInfo } from "../../types/config";
import { AddressLink } from "../AddressLink";
import { ClaimTokensButton } from "../Buttons";
import { useAccount } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";
import api from "../../apis/Api";
import { BaseTable } from "./BaseTable";

type Props = {
  setHash: (hash: string | undefined) => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const FaucetTable: React.FC<Props> = ({ setHash, setIsModalOpen }) => {
  const config = useConfig();
  const { address } = useAccount();
  const { openWalletModal } = useWalletModal();

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

  const getFaucetData = (token: TokenInfo): TableData[] => [
    {
      title: token.name,
      classNames: "!pl-5 !pr-2 bg-gray-200"
    },
    {
      title: token.symbol
    },
    {
      title: <AddressLink address={token.address} />
    },
    {
      title: (
        <ClaimTokensButton
          tokenName={token.name}
          onClick={() => claim(token.address)}
        />
      )
    }
  ];

  const HEADERS: TableHeader[] = [
    {
      title: "Name",
      classNames: "!pl-5 !pr-2 bg-gray-200 !w-[10rem]"
    },
    {
      title: "Symbol"
    },
    {
      title: "Address"
    },
    {
      title: "Claim"
    }
  ];

  const blankFaucetRows: TableRow[] = Array.from({ length: 3 }, () => ({
    data: Array.from({ length: HEADERS.length }, () => ({
      title: <Skeleton />
    }))
  }));

  const ROWS: TableRow[] = config
    ? config.tokens.map(token => ({
        data: getFaucetData(token)
      }))
    : blankFaucetRows;

  return <BaseTable headers={HEADERS} rows={ROWS} />;
};
