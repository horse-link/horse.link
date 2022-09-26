import { PageLayout } from "../../components";
import ContractWriteResultCard from "../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import RequireWalletButton from "../../components/RequireWalletButton/RequireWalletButton_View";

type Props = {
  symbol: string;
  depositAmount: number;
  updateDepositAmount: (amount: number) => void;
  shouldButtonDisabled: boolean;
  contract: {
    write?: () => void;
    isError: boolean;
    errorMsg?: string;
  };
  txStatus: {
    isLoading: boolean;
    isSuccess: boolean;
    hash?: string;
  };
};
const DepositView = ({
  symbol,
  depositAmount,
  updateDepositAmount,
  shouldButtonDisabled,
  contract,
  txStatus
}: Props) => {
  return (
    <PageLayout requiresAuth={false}>
      <div className="grid place-content-center">
        <div className="w-96 px-10 pt-5 pb-3 rounded-md shadow border-b bg-white border-gray-200">
          <h1 className="text-3xl">Deposit {symbol}</h1>
          <form className="mt-5">
            <label>
              <span>Amount</span>
              <input
                type="number"
                onChange={e => {
                  updateDepositAmount(e.target.valueAsNumber);
                }}
                value={depositAmount || ""}
                placeholder="0.0"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
            <div className="flex justify-end mt-12">
              <RequireWalletButton
                actionButton={
                  <button
                    className="rounded-md border shadow-md border-gray-500 px-5 py-1"
                    onClick={contract.write}
                    disabled={shouldButtonDisabled}
                  >
                    {txStatus.isLoading ? "Backing..." : "Deposit"}
                  </button>
                }
              />
            </div>
          </form>
        </div>
        <ContractWriteResultCard
          hash={txStatus.hash}
          isSuccess={txStatus.isSuccess}
          isError={contract.isError}
          errorMsg={contract.errorMsg}
        />
      </div>
    </PageLayout>
  );
};

export default DepositView;
