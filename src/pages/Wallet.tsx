import { PageLayout } from "../components";
import { useLocalWallet } from "../hooks/useLocalWallet";

const WalletPage = () => {
  const { mnemonic, address } = useLocalWallet();
  return (
    <PageLayout>
      <div className="flex h-full flex-col justify-center">
        <h1 className="text-2xl font-bold">Wallet</h1>
        <div className="mt-2 flex justify-center rounded-lg bg-white px-4 py-5 shadow sm:p-6 lg:mb-10">
          <div className="w-4/5 max-w-2xl">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">Mnemonic :</h2>
              <h2>{mnemonic}</h2>
            </div>
            <div className="mt-3 flex flex-col">
              <h2 className="text-lg font-bold">Address :</h2>
              <h2 className="break-all">{address}</h2>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WalletPage;
