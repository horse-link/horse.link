import { shortenAddress } from "../../utils/formatting";

type Props = {
  hash?: string;
  isSuccess: boolean;
  errorMsg?: string;
};
const ContractWriteResultCard = ({ hash, isSuccess, errorMsg }: Props) => {
  return (
    <>
      {isSuccess && hash && (
        <div className="py-5 rounded-md shadow  bg-green-300 text-green-800 w-full text-center">
          <p className="p-1">Success! Your bet has been confirmed.</p>

          <a
            href={`${process.env.REACT_APP_SCANNER_URL}/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Transaction Hash: {shortenAddress(hash)}
          </a>
        </div>
      )}
      {errorMsg && (
        <div className="px-10 py-5 rounded-md shadow  bg-red-300  text-red-800 break-words">
          Error <br />
          {errorMsg}
        </div>
      )}
    </>
  );
};

export default ContractWriteResultCard;
