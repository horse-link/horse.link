import { BaseModal } from ".";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
};

export const FaucetModal: React.FC<Props> = ({ isOpen, onClose, txHash }) => (
  <BaseModal isOpen={isOpen} onClose={onClose}>
    <div className="max-w-[95vw]">
      <h2>
        Tokens have been transferred.
        <br />
        It may take a few minutes to show up in your wallet.
      </h2>
      <br />
      <div className="flex whitespace-nowrap">
        Tx Hash: &nbsp;
        <a
          className="underline text-indigo-600 hover:text-purple-800 visited:text-purple-900 truncate"
          href={`${process.env.VITE_SCANNER_URL}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {txHash}
        </a>
      </div>
    </div>
  </BaseModal>
);
