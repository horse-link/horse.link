import Modal from "../../components/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
};

export const FaucetModal = ({ isOpen, onClose, txHash }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-152">
        <h2>
          Tokens have been transferred.
          <br />
          It may take a few minutes to show up in your wallet.
        </h2>
        <br />
        <p>Tx ID: {txHash}</p>
      </div>
    </Modal>
  );
};
