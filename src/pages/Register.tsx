import { BaseButton } from "../components/Buttons";
import { RegisterLayoutPage } from "../components/RegisterLayoutPage";
const Register = () => {
  return (
    <RegisterLayoutPage>
      <div className="flex flex-col place-content-center items-center">
        <img
          loading="lazy"
          alt="Horse"
          src="/images/horse.png"
          className="mb-10 h-[5rem] w-[7rem] justify-center"
        />
        <h1 className="mb-5 text-2xl font-bold">
          Invite Friends, Claim More HL Token, and Win Big with 5k in Bitcoin up
          for Grabs for the Top Players
        </h1>
        <div>
          <h1 className="my-4 font-bold">Final Step</h1>
          <h1 className="my-2">Phone (Optional)</h1>
          <input
            type="number"
            placeholder="0"
            className="mb-6 w-[30rem] rounded-md border-b-[0.12rem] border-black pl-1 pt-1 transition-colors duration-100 disabled:bg-white disabled:text-black/50"
          />
          <h1 className="my-2">Referral Code (Optional)</h1>
          <input
            type="number"
            placeholder="0x0000...."
            className="mb-6 w-[30rem] rounded-md border-b-[0.12rem] border-black pl-1 pt-1 transition-colors duration-100 disabled:bg-white disabled:text-black/50"
          />
          <h1>Your Generated Ethereum Wallet</h1>
          <h1 className="my-4">WALLET HERE</h1>
          <h1 className="mt-10 font-bold">Use Your Own Wallet</h1>
          <h1 className="mb-5">
            If you are an advanced user you can use your MetaMask Wallet
            otherwise for first time users just use the generated wallet
            pre-populated above.{" "}
          </h1>
          <BaseButton className="w-[30rem]">Signup</BaseButton>
          <h1 className="my-5">
            Invite friends to join and claim more USDT for more chances to win
            big. The player with the most successful wagers will take home an
            extra 10K worth of Bitcoin.
          </h1>
        </div>
      </div>
    </RegisterLayoutPage>
  );
};
export default Register;
