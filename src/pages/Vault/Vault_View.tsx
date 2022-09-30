import { PageLayout } from "../../components";

type Props = {
  tokenSymbol: string;
  vaultAddress: string;
  vaultBalance: string;
  userBalance: string;
  performance: string;
  onClickDeposit: () => void;
};

const VaultView = ({
  tokenSymbol,
  vaultAddress,
  vaultBalance,
  userBalance,
  performance,
  onClickDeposit
}: Props) => {
  return (
    <PageLayout requiresAuth={false}>
      <div className="grid place-content-center ">
        <div className="max-w-xl p-5 bg-white rounded-md">
          <h1 className="text-3xl">{tokenSymbol} Vault</h1>
          <div className="mt-2 break-all">Vault Address: {vaultAddress}</div>
          <div>Vault Balance: {vaultBalance}</div>
          <div>
            My Balance: {userBalance ?? "connect wallet to see your balance"}
          </div>
          <div>APY: {performance}%</div>
          <button
            className="mt-5 py-2 px-4 rounded font-bold bg-gray-500 hover:bg-gray-700 text-white"
            onClick={onClickDeposit}
          >
            Deposit
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default VaultView;
