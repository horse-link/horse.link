import Skeleton from "react-loading-skeleton";
import { Loader } from "../../../../components";
import ContractWriteResultCard from "../../../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import RequireWalletButton from "../../../../components/RequireWalletButton/RequireWalletButton_View";
import { VaultDetail, VaultDetailProps } from "../VaultDetail";

type Props = {
  vaultDetailData: VaultDetailProps;
  userBalance: number;
  depositAmount: number;
  updateDepositAmount: (amount: number) => void;
  shouldDepositButtonDisabled: boolean;
  shouldWithdrawButtonDisabled: boolean;
  contract: {
    depositContractWrite: () => void | undefined;
    approveContractWrite: () => void | undefined;
    withdrawContractWrite: () => void | undefined;
    errorMsg: string | undefined;
  };
  txStatus: {
    isLoading: boolean;
    isSuccess: boolean;
    hash?: string;
  };
  isEnoughAllowance: boolean;
};
const VaultView = ({
  vaultDetailData,
  userBalance,
  depositAmount,
  updateDepositAmount,
  shouldDepositButtonDisabled,
  shouldWithdrawButtonDisabled,
  contract,
  txStatus,
  isEnoughAllowance
}: Props) => {
  return (
    <div className="w-96 md:w-152 break-all md:break-normal">
      <div className="flex flex-col justify-between bg-white border-gray-200">
        <div>
          <VaultDetail {...vaultDetailData} />
        </div>
        <div>
          <div className="mx-auto p-4 rounded-md border border-white">
            <h1 className="text-3xl mb-2">Deposit / Withdraw</h1>
            <span className="mb-3">Shares : {userBalance ?? <Skeleton />}</span>
            <form>
              <label className="my-5">
                <span className="mt-6 flex-row">Amount</span>
                <input
                  type="number"
                  onChange={e => {
                    updateDepositAmount(e.target.valueAsNumber || 0);
                  }}
                  value={depositAmount || ""}
                  placeholder="0.0"
                  className=" flex-row mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <div className="mt-5">
                <RequireWalletButton
                  actionButton={
                    isEnoughAllowance ? (
                      <div className="flex flex-col">
                        <button
                          className={
                            "px-5 py-3 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md" +
                            (shouldDepositButtonDisabled
                              ? " opacity-50 cursor-not-allowed"
                              : "")
                          }
                          onClick={contract.depositContractWrite}
                          disabled={shouldDepositButtonDisabled}
                        >
                          {txStatus.isLoading ? <Loader /> : "Deposit"}
                        </button>
                        <button
                          className={
                            "px-5 py-3 mt-2 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md" +
                            (shouldWithdrawButtonDisabled
                              ? " opacity-50 cursor-not-allowed"
                              : "")
                          }
                          onClick={contract.withdrawContractWrite}
                          disabled={shouldWithdrawButtonDisabled}
                        >
                          {txStatus.isLoading ? <Loader /> : "Withdraw"}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full px-5 py-3 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md "
                        onClick={contract.approveContractWrite}
                      >
                        {txStatus.isLoading ? <Loader /> : "Approve"}
                      </button>
                    )
                  }
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <ContractWriteResultCard
          hash={txStatus.hash}
          isSuccess={txStatus.isSuccess}
          errorMsg={contract.errorMsg}
        />
      </div>
    </div>
  );
};

export default VaultView;
