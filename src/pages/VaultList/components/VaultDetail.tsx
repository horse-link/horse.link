import Skeleton from "react-loading-skeleton";
export type VaultDetailProps = {
  userAddress: string;
  tokenSymbol: string;
  vaultAddress: string;
  vaultBalance: string;
  userBalance: string;
  performance: string;
  asset: string;
};

export const VaultDetail = ({
  userAddress,
  tokenSymbol,
  vaultAddress,
  vaultBalance,
  userBalance,
  performance,
  asset
}: VaultDetailProps) => {
  return (
    <div className="p-5">
      <h1 className="text-3xl mb-2">
        {tokenSymbol ?? <Skeleton width="1em" />} Vault
      </h1>
      <div>
        Share:
        {(userAddress && userBalance) ?? <Skeleton width="1em" />}
        {!userAddress && "connect wallet to see your balance"}
      </div>
      <div>Vault Address: {vaultAddress ?? <Skeleton width="10em" />}</div>
      <div>Underlying: {asset ?? <Skeleton width="10em" />}</div>
      <div>TLV: {vaultBalance ?? <Skeleton width="2em" />}</div>

      <div>
        APY: {performance ? `${performance}%` : <Skeleton width="3em" />}
      </div>
    </div>
  );
};
