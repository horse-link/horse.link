import { AiOutlineCopy } from "react-icons/ai";
import { TokenomicsChart } from "../../images";
import QRCode from "react-qr-code";
import PageLayout from "../../components/PageLayout/PageLayout_Logic";

const ADDRESS = "0xAA99c40A936A2cF11Eb1D5387897ce9A626E53c7";

export const HlTokenPage = () => {
  return (
    <PageLayout>
      <div className="flex justify-center flex-col items-center">
        <h1 className="text-3xl pb-4 font-bold text-center">
          HL Token Private sale
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
              className="lg:ml-2 hover:bg-emerald-400"
              onClick={() => navigator.clipboard.writeText(ADDRESS)}
            >
              <AiOutlineCopy />
            </button>
          </div>
          <div className="w-full flex flex-col lg:flex-row justify-evenly items-center">
            <div>
              <h3 className="text-center mb-2 mt-2 lg:mt-0 text-sm">
                Scan for ERC20 deposit address
              </h3>
              <QRCode level="H" value={ADDRESS} />
            </div>
            <img src={TokenomicsChart} alt="Tokenomics" className="mt-4" />
          </div>
          <h3 className="text-xl pb-2 font-bold text-center">Rounds</h3>
          <div className="px-4 text-sm flex flex-col gap-y-2 mb-3 text-center">
            <p className="text-center line-through">
              Seed - 10,000,000 tokens at 11.76 for $1 (0.085) / $850,000 USD
              (SOLD)
            </p>
            <p className="text-center">
              Private - 20,000,000 tokens at 6.66 for $1 (0.15) / $3,000,000 USD
              (CURRENT)
            </p>
            <p className="text-center">
              Public 1 - 20,000,000 tokens at 3.33 for $1 (0.30) / $6,000,000
              USD
            </p>
            <p className="text-center">
              Public 2 - 20,000,000 tokens at 1.66 for $1 (0.60) / $12,000,000
              USD
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
