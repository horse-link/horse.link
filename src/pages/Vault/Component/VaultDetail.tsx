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
    <div className="p-5 w-64">
      <h1 className="text-3xl mb-2">{tokenSymbol} Vault</h1>
      <div>Share: {userBalance ?? "connect wallet to see your balance"}</div>
      <div className="break-all">
        Vault Address: <br />
        {vaultAddress}
      </div>
      <div className="break-all">
        Underlying <br />
        {asset}
      </div>
      <div>TLV: {vaultBalance}</div>

      <div>APY: {performance}%</div>
    </div>
  );
};
