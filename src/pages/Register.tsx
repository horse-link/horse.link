import { useState } from "react";
import { BaseButton } from "../components/Buttons";
import { RegisterLayoutPage } from "../components/RegisterLayoutPage";
import api from "../apis/Api";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components";
import { ethers } from "ethers";

const Register = () => {
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!number || !address) return;
    //regex phone validation below
    if (
      !RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).test(
        number
      )
    )
      return;
    if (!ethers.utils.isAddress(address)) return;

    setLoading(true);
    await api.registerUser(number, address);

    navigate("/verify", {
      replace: true
    });
    setLoading(false);
  };

  return (
    <RegisterLayoutPage>
      <div className="flex flex-col items-center">
        <span>
          {loading ? (
            <Loader size={14} />
          ) : (
            <img
              loading="lazy"
              alt="Horse"
              src="/images/horse.png"
              className="mb-10 h-[5rem] w-[7rem] justify-center"
            />
          )}
        </span>
        <h1 className="text-md mb-5 break-all text-center font-bold lg:w-[40rem] lg:text-3xl">
          Invite Friends, Claim More HL Token, and Win Big with 5k in Bitcoin up
          for Grabs for the Top Players
        </h1>
        <div className="flex w-[20rem] flex-col lg:w-[30rem]">
          <h1 className="my-4 font-bold">Final Step</h1>
          <h1 className="my-2">Phone</h1>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              type="number"
              placeholder="Mobile/ Cell"
              value={number}
              onChange={e => setNumber(e.target.value)}
              className="mb-6 w-[20rem] rounded-md border-b-[0.12rem] border-black pl-1 pt-1 transition-colors duration-100 disabled:bg-white disabled:text-black/50 lg:w-[30rem]"
            />
            <h1 className="my-2">Wallet Address</h1>
            <input
              type="text"
              placeholder="Your Wallet Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="mb-6 w-[20rem] rounded-md border-b-[0.12rem] border-black pl-1 pt-1 transition-colors duration-100 disabled:bg-white disabled:text-black/50 lg:w-[30rem]"
            />

            <BaseButton type="submit" className="w-[20rem] lg:w-[30rem]">
              Signup
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
export default Register;
