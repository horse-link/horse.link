import Modal from "../../components/Modal";
import utils from "../../utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
};

export const FaucetModal: React.FC<Props> = ({ isOpen, onClose, txHash }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-200">
        <h2>
          Tokens have been transferred.
          <br />
          It may take a few minutes to show up in your wallet.
        </h2>
        <br />
        <div className="flex flex-row">
          Tx Hash: &nbsp;
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href={`${process.env.VITE_SCANNER_URL}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txHash ? utils.formatting.shortenAddress(txHash) : ""}
          </a>
        </div>
      </div>
    </Modal>
  );
};
