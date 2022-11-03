import { PageLayout } from "../../components";
import { AiOutlineCopy } from "react-icons/ai";
import { TokenomicsChart } from "../../images";
import QRCode from "react-qr-code";

const ADDRESS = "0xAA99c40A936A2cF11Eb1D5387897ce9A626E53c7".toLowerCase();

export const HlTokenPage = () => {
  return (
    <PageLayout requiresAuth={false}>
      <div className="flex justify-center flex-col items-center">
        <h1 className="text-3xl pb-4 font-bold text-center">
          HL TOKEN PRIVATE SALE
        </h1>
        <div className="bg-white rounded-md py-5">
          <p className="text-center text-sm px-4 pb-4 lg:text-sm lg:px-32 lg:py-4">
            We are currently raising funds in our Private round for Horse Link.
            If you would like to participate, please send USDT/USDC/DAI on the
            ETH network to the below address. Once HL Token is live your tokens
            will be sent back to the wallet you sent funds from, please make
            sure you are sending from a metamask wallet or equivalent.{" "}
            <span className="font-bold">DO NOT USE EXCHANGE WALLETS</span> ie
            Binance as they do not list our token currently.
          </p>
          <div className="bg-gray-100 p-5 mb-2 lg:mb-0 text-center justify-center text-sm lg:text-sm">
            Address: {ADDRESS}
            <button
              className="lg:ml-2 hover:bg-green-400"
              onClick={() => navigator.clipboard.writeText(ADDRESS)}
            >
              <AiOutlineCopy />
            </button>
          </div>
          <div className="w-full flex flex-col lg:flex-row justify-evenly items-center">
            <div>
              <h3 className="text-center mb-2 mt-2 lg:mt-0 text-sm">
                Scan for address:
              </h3>
              <QRCode level="H" value={ADDRESS} />
            </div>
            <img src={TokenomicsChart} alt="Tokenomics" className="mt-4" />
          </div>
          <h3 className="text-xl pb-2 font-bold text-center">ROUNDS</h3>
          <div className="px-4 text-sm flex flex-col gap-y-2 mb-3 text-center">
            <p className="text-center line-through">
              Seed - 10,000,000 tokens at 16.66 for $1 (0.06) / $600,000 (SOLD)
            </p>
            <p className="text-center">
              Private - 20,000,000 tokens at 10 for $1 (0.10) / $2,000,000
              (CURRENT)
            </p>
            <p className="text-center">
              Public 1 - 20,000,000 tokens at 5 for $1 (0.20) / $4,000,000
            </p>
            <p className="text-center">
              Public 2 - 20,000,000 tokens at 2.5 for $1 (0.40) / $8,000,000
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
