import { AiOutlineCopy } from "react-icons/ai";
import { TokenomicsChart } from "../icons";
import QRCode from "react-qr-code";
import { PageLayout } from "../components";

const ADDRESS = "0xAA99c40A936A2cF11Eb1D5387897ce9A626E53c7";

const Tokens: React.FC = () => (
  <PageLayout>
    <div className="flex flex-col items-center justify-center">
      <h1 className="pb-4 text-center text-3xl font-bold">
        HL Token Private sale
      </h1>
      <div className="rounded-md bg-white py-5">
        <p className="px-4 pb-4 text-center text-sm lg:px-32 lg:py-4 lg:text-sm">
          We are currently raising funds in our Private round for Horse Link. If
          you would like to participate, please send USDT/USDC/DAI on the ETH
          network to the below address. Once HL Token is live your tokens will
          be sent back to the wallet you sent funds from, please make sure you
          are sending from a metamask wallet or equivalent.{" "}
          <span className="font-bold">DO NOT USE EXCHANGE WALLETS</span> ie
          Binance as they do not list our token currently.
        </p>
        <div className="mb-2 justify-center bg-gray-100 p-5 text-center text-sm lg:mb-0 lg:text-sm">
          Address: {ADDRESS}
          <button
            className="hover:bg-emerald-400 lg:ml-2"
            onClick={() => navigator.clipboard.writeText(ADDRESS)}
          >
            <AiOutlineCopy />
          </button>
        </div>
        <div className="flex w-full flex-col items-center justify-evenly lg:flex-row">
          <div>
            <h3 className="mb-2 mt-2 text-center text-sm lg:mt-0">
              Scan for ERC20 deposit address
            </h3>
            <QRCode level="H" value={ADDRESS} />
          </div>
          <img src={TokenomicsChart} alt="Tokenomics" className="mt-4" />
        </div>
        <h3 className="pb-2 text-center text-xl font-bold">Rounds</h3>
        <div className="mb-3 flex flex-col gap-y-2 px-4 text-center text-sm">
          <p className="text-center line-through">
            Seed - 10,000,000 tokens at 11.76 for $1 (0.085) / $850,000 USD
            (SOLD)
          </p>
          <p className="text-center">
            Private - 20,000,000 tokens at 6.66 for $1 (0.15) / $3,000,000 USD
            (CURRENT)
          </p>
          <p className="text-center">
            Public 1 - 20,000,000 tokens at 3.33 for $1 (0.30) / $6,000,000 USD
          </p>
          <p className="text-center">
            Public 2 - 20,000,000 tokens at 1.66 for $1 (0.60) / $12,000,000 USD
          </p>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default Tokens;
