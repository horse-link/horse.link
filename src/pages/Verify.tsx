import { BaseButton } from "../components/Buttons";
import { useState } from "react";
import { RegisterLayoutPage } from "../components/RegisterLayoutPage";
import api from "../apis/Api";
import { useNavigate } from "react-router-dom";
const Verify = () => {
  const [verify, setVerify] = useState<string>();
  const navigate = useNavigate();
  const handleVerify = async () => {
    if (!verify) return;
    await api.verifyUser(verify);
    navigate("/dashboard", {
      replace: true
    });
  };
  return (
    <RegisterLayoutPage>
      <div className="flex flex-col items-center">
        <img
          loading="lazy"
          alt="Horse"
          src="/images/horse.png"
          className="mb-10 h-[5rem] w-[7rem] justify-center"
        />
        <h1 className="text-md mb-5 break-all text-center font-bold lg:w-[40rem] lg:text-3xl">
          Enter code recieved via SMS
        </h1>
        <div className="flex w-[20rem] flex-col lg:w-[30rem]">
          <h1 className="my-4 font-bold">Earn $100 USDT (Goerli)</h1>
          <form
            onSubmit={e => {
              handleVerify();
              e.preventDefault();
            }}
          >
            <input
              type="text"
              placeholder="SMS Verification Code"
              value={verify}
              onChange={e => setVerify(e.target.value)}
              className="mb-6 w-[20rem] rounded-md border-b-[0.12rem] border-black pl-1 pt-1 transition-colors duration-100 disabled:bg-white disabled:text-black/50 lg:w-[30rem]"
            />
            <BaseButton type="submit" className="w-[20rem] lg:w-[30rem]">
              Verify
            </BaseButton>
          </form>
          <h1 className="my-5">
            Invite friends, claim more HL tokens, and win big with 0.2 BTC up
            for grabs for the top players.
          </h1>
        </div>
      </div>
    </RegisterLayoutPage>
  );
};
export default Verify;
