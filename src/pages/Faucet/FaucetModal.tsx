import Modal from "../../components/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
};

export const FaucetModal = ({ isOpen, onClose, txHash }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>{txHash}</div>
    </Modal>
  );
};
