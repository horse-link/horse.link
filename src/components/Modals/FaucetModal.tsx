import { BaseModal } from ".";
import { Web3SuccessHandler } from "../Web3Handlers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
};

export const FaucetModal: React.FC<Props> = ({ isOpen, onClose, txHash }) => (
  <BaseModal isOpen={isOpen} onClose={onClose}>
    <div className="max-w-[95vw] lg:min-w-[28rem]">
      <h2 className="font-bold text-2xl mr-[8vw] mb-2">Transaction result</h2>
      <br />
      <Web3SuccessHandler
        hash={txHash}
        message="Your tokens have been placed with"
      />
      <br />
      <h2>It may take a few minutes to show up in your wallet.</h2>
    </div>
  </BaseModal>
);
