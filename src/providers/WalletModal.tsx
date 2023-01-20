import { createContext, useContext, useState } from "react";

const defaultValue = {
  openWalletModal: () => {},
  closeWalletModal: () => {},
  isWalletModalOpen: false
};

export const WalletModalContext = createContext(defaultValue);

export const useWalletModal = () => useContext(WalletModalContext);

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
