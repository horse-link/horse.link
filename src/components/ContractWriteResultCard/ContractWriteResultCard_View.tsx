type Props = {
  hash?: string;
  isSuccess: boolean;
  isError: boolean;
  errorMsg?: string;
};
const ContractWriteResultCard = ({
  hash,
  isSuccess,
  isError,
  errorMsg
}: Props) => {
  return (
    <>
      {isSuccess && (
        <div className="mt-5 w-96 px-10 py-5 rounded-md shadow  bg-green-300 text-green-800  break-all">
          Success <br />
          Transaction Hash : {hash}
        </div>
      )}
      {isError && (
        <div className="mt-5 w-96 px-10 py-5 rounded-md shadow  bg-red-300  text-red-800 break-words">
          Error <br />
          {errorMsg}
        </div>
      )}
    </>
  );
};

export default ContractWriteResultCard;
