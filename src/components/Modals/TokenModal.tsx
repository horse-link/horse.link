import React from "react";
import { Token } from "../../types/tokens";
import { BaseModal } from "./BaseModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  availableTokens?: Array<Token>;
  tokensLoading: boolean;
};

export const TokenModal: React.FC<Props> = ({
  isOpen,
  onClose,
  availableTokens,
  tokensLoading
}) => (
  <BaseModal isOpen={isOpen} onClose={onClose}>
    <div>hello</div>
  </BaseModal>
);
