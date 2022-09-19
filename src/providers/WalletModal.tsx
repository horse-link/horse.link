import { createContext, useState } from "react";

const defaultValue = {
  openWalletModal: () => {
    // do nothing.
  },
  closeWalletModal: () => {
    // do nothing.
  },
  isWalletModalOpen: false
};

export const WalletModalContext = createContext(defaultValue);

export const WalletModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <WalletModalContext.Provider
      value={{
        openWalletModal: () => setIsWalletModalOpen(true),
        closeWalletModal: () => setIsWalletModalOpen(false),
        isWalletModalOpen
      }}
    >
      {children}
    </WalletModalContext.Provider>
  );
};
