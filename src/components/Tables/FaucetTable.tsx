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
import utils from "../../utils";
import { ethers } from "ethers";
import { FaucetBalance } from "../../types/faucet";

type Props = {
  balances?: Array<FaucetBalance>;
  setHash: (hash: string | undefined) => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const FaucetTable: React.FC<Props> = ({
  balances,
  setHash,
  setIsModalOpen
}) => {
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

  const getFaucetData = (
    token: TokenInfo,
    amounts: Array<FaucetBalance>
  ): TableData[] => {
    const tokenBalance = amounts.find(
      amount => amount.symbol.toLowerCase() === token.symbol.toLowerCase()
    );
    if (!tokenBalance)
      throw new Error("Could not find balance for given token");

    return [
      {
        title: token.name,
        classNames: "!pl-5 !pr-2 bg-gray-200"
      },
      {
        title: token.symbol
      },
      {
        title: `${utils.formatting.formatToFourDecimals(
          ethers.utils.formatUnits(tokenBalance.amount, tokenBalance.decimals)
        )} ${token.symbol}`
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
  };

  const HEADERS: TableHeader[] = [
    {
      title: "Name",
      classNames: "!pl-5 !pr-2 bg-gray-200 !w-[10rem]"
    },
    {
      title: "Symbol"
    },
    {
      title: "Amount"
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

  const ROWS: TableRow[] =
    config && balances
      ? config.tokens.map(token => ({
          data: getFaucetData(token, balances)
        }))
      : blankFaucetRows;

  return <BaseTable headers={HEADERS} rows={ROWS} />;
};
