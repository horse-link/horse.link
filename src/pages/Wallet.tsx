import { PageLayout } from "../components";
import { useLocalWallet } from "../hooks/useLocalWallet";

const WalletPage = () => {
  const { mnemonic, address } = useLocalWallet();
  return (
    <PageLayout>
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col items-center rounded-lg bg-white px-6 py-6 text-lg lg:w-[50vw] lg:px-0">
          <h1 className="w-full text-center text-3xl font-bold">Wallet</h1>
          <br />
          <h2 className="mt-4 font-semibold">Mnemonic</h2>
          <p>{mnemonic}</p>
          <br />
          <h2 className="font-semibold">Address</h2>
          <p className="max-w-full truncate">{address}</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default WalletPage;
