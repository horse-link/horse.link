import React from "react";
import { useAccount } from "wagmi";
import { BaseModal } from "./BaseModal";
import QRCode from "react-qr-code";
import { Loader } from "../Loader";

type Props = {
  showModal: boolean;
  onClose: () => void;
};

export const QrCodeModal: React.FC<Props> = ({ showModal, onClose }) => {
  const { address } = useAccount();

  return (
    <BaseModal isOpen={showModal} onClose={onClose}>
      <h2 className="w-full text-center text-xl font-bold">Scan Address</h2>
      <div className="mt-6 mb-4 flex items-center justify-center">
        {address ? (
          <QRCode
            bgColor="#fffaf6"
            fgColor="#0e0e0e"
            level="H"
            size={280}
            value={address}
          />
        ) : (
          <Loader />
        )}
      </div>
    </BaseModal>
  );
};
