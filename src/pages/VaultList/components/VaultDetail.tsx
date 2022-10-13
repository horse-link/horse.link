export type VaultDetailProps = {
  tokenSymbol: string;
  vaultAddress: string;
  vaultBalance: string;
  userBalance: string;
  performance: string;
  asset: string;
};

export const VaultDetail = ({
  tokenSymbol,
  vaultAddress,
  vaultBalance,
  userBalance,
  performance,
  asset
}: VaultDetailProps) => {
  return (
    <div className="p-5">
      <h1 className="text-3xl mb-2">{tokenSymbol} Vault</h1>
      <div>Share: {userBalance ?? "connect wallet to see your balance"}</div>
      <div>
        Vault Address:
        {vaultAddress}
      </div>
      <div>
        Underlying:
        {asset}
      </div>
      <div>TLV: {vaultBalance}</div>

      <div>APY: {performance}%</div>
    </div>
  );
};
