import { useState } from "react";
import { PageLayout } from "../../components";
import ContractWriteResultCard from "../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import RequireWalletButton from "../../components/RequireWalletButton/RequireWalletButton_View";

export const Faucet = () => {
  const [address, setAddress] = useState("");
  const onAddressChanged = (newValue: string) => {
    setAddress(newValue);
  };
  const onSubmit = () => {
    alert("Not implemented yet");
  };
  return (
    <PageLayout requiresAuth={false}>
      <div className="grid place-items-center">
        <div className="w-96 md:w-152">
          <div className="px-10 pt-5 pb-5 rounded-md bg-white border-gray-200 sm:rounded-lg">
            <div className="text-3xl">Faucet</div>
            <form
              className="mt-3 grid gap-5"
              onSubmit={e => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <div className="flex flex-col">
                <label>
                  <span>Address</span>
                  <input
                    type="text"
                    value={address}
                    onChange={e => onAddressChanged(e.target.value)}
                    placeholder="Your ETH Address"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
              </div>
              <div className="flex flex-col">
                <RequireWalletButton
                  actionButton={
                    <button
                      className="px-5 py-1 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md "
                      type="submit"
                    >
                      Get Mock USDT
                    </button>
                  }
                />
              </div>
            </form>
          </div>
          <div className="mt-5">
            {/* <ContractWriteResultCard
            hash={txStatus.hash}
            isSuccess={txStatus.isSuccess}
            errorMsg={contract.errorMsg}
          /> */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
