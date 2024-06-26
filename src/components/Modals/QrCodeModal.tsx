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
      <h2 className="w-full text-center text-[32px] font-bold">Scan Address</h2>
      <div className="mt-6 mb-4 flex items-center justify-center">
        {address ? (
          <div className="rounded-lg bg-white p-3">
            <QRCode
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              size={280}
              value={address}
            />
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </BaseModal>
  );
};
