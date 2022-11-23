import Modal from "../../components/Modal";
import { shortenHash } from "../../utils/formatting";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string | undefined;
};

export const FaucetModal = ({ isOpen, onClose, txHash }: Props) => {
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
          Tx ID: {shortenHash(txHash || "")}
          <a
            href={`${process.env.REACT_APP_SCANNER_URL}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        </div>
      </div>
    </Modal>
  );
};
