import { PageLayout } from "../../components";
import tokenomics from "../../images/tokenomics.png";

export const HlTokenPage = () => {
  return (
    <PageLayout requiresAuth={false}>
      <div className="flex justify-center flex-col items-center">
        <h1 className="text-5xl pb-10">Acquiring HL Token</h1>
        <div className="w-25 bg-gray-100 rounded-md p-5">
          <br></br>
          <p className="text-center">
            We are currently raising funds in our Seed round for Horse Link.
            <br></br>
            <br></br>
            If you would like to participate, please send USDT on the ETH
            network to the below address. You will be sent back the equivalent $
            value in Horse Link tokens.
            <br></br>
            <br></br>
            Address: 0xAA99c40A936A2cF11Eb1D5387897ce9A626E53c7
          </p>
        </div>
        <div className="p-10 w-90 mx-auto PT">
          <img src={tokenomics} alt="Tokenomics" className="rounded-md" />
        </div>
      </div>
    </PageLayout>
  );
};
