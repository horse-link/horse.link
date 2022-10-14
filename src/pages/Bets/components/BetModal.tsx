import Modal from "../../../components/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
const BetModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-152 flex flex-col">Bet Settle Modal</div>
    </Modal>
  );
};

export default BetModal;
