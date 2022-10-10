import { useContext } from "react";
import { useAccount } from "wagmi";
import { WalletModalContext } from "../../providers/WalletModal";

type Props = {
  actionButton: React.ReactNode;
};
const RequireWalletButton = ({ actionButton }: Props) => {
  const { openWalletModal } = useContext(WalletModalContext);
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
        actionButton
      ) : (
        <button
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={openWalletModal}
        >
          Connect Wallet
        </button>
      )}
    </>
  );
};

export default RequireWalletButton;
