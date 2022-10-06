type Props = {
  tokenSymbol: string;
  vaultAddress: string;
  vaultBalance: string;
  userBalance: string;
  performance: string;
  asset: string;
};

const VaultView = ({
  tokenSymbol,
  vaultAddress,
  vaultBalance,
  userBalance,
  performance,
  asset
}: Props) => {
  return (
    <div className="p-5 w-64">
      <h1 className="text-3xl">{tokenSymbol} Vault</h1>
      <div className="mt-2 break-all">
        Vault Address: <br />
        {vaultAddress}
      </div>
      <div className="break-all">
        Underlying <br />
        {asset}
      </div>
      <div>TLV: {vaultBalance}</div>
      <div>
        My Balance: <br />
        {userBalance ?? "connect wallet to see your balance"}
      </div>
      <div>APY: {performance}%</div>
    </div>
  );
};

export default VaultView;
