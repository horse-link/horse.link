type Props = {
  hash?: string;
  isSuccess: boolean;
  errorMsg?: string;
};
const ContractWriteResultCard = ({ hash, isSuccess, errorMsg }: Props) => {
  return (
    <>
      {isSuccess && (
        <div className="px-10 py-5 rounded-md shadow  bg-green-300 text-green-800  break-all">
          <p>Success</p> <br />
          Your bet has been confirmed. <br />
          Transaction Hash : {hash}
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
