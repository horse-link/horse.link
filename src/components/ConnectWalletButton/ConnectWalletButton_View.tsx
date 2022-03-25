import React from "react";
import Button from "../Button/Button_View";
import { useAccount, useNetwork } from "wagmi";
import { shortenAddress } from "../../utils/shortenAddress";
import { Loader } from "../";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
};

const WalletConnectButton: React.FC<Props> = (props: Props) => {
  const [{ data }] = useNetwork();
  const [{ data: accountData, loading }, disconnect] = useAccount({
    fetchEns: true
  });

  return (
    <>
      <Loader className={loading ? "hidden" : ""} />
      <div className={loading ? "hidden" : "inline-flex items-center px-1 pt-1 text-sm font-medium justify-self-end"}>
          {accountData?.address ? (
            <div className="flex mx-2">
              <div className="text-xs p-2 px-4 bg-green-200 font-semibold rounded-xl text-green-600 dark:text-green-400 px-2 m-2 hidden lg:block">
                Connected: {shortenAddress(accountData?.address)}
              </div>
              {data.chain?.name !== "Mainnet" && (
                <div className="text-xs p-2 px-4 bg-red-200 font-semibold rounded-xl text-red-600 dark:text-red-400 px-2 m-2 hidden lg:block">
                  Connected Chain: {data.chain?.name}
                </div>
              )}
              <div>
                <div className="m-2 flex justify-between">
                  <div className="h-6">
                    <Button
                      className="cursor-pointer hover:bg-gray-200 hover:text-white mb-4 sm:w-auto sm:mb-0"
                      onClick={disconnect}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-4">
              <Button
                onClick={() => props.setIsWalletModalOpen(true)}
              >
                Connect
              </Button>
            </div>
          )}
        </div>
    </>
  );
};

export default WalletConnectButton;
