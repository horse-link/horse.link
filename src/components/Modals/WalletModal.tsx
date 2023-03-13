import React, { useEffect } from "react";
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import { BaseModal } from ".";
import constants from "../../constants";
import utils from "../../utils";
import classNames from "classnames";

type Props = {
  isModalOpen: boolean;
  closeWalletModal: () => void;
};

export const WalletModal: React.FC<Props> = (props: Props) => {
  const { isModalOpen, closeWalletModal } = props;
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (!isConnected || !currentChain || !switchNetwork) return;

    if (
      currentChain.name.toLowerCase() !==
      constants.blockchain.GOERLI_NETWORK.name.toLowerCase()
    ) {
      switchNetwork(constants.blockchain.GOERLI_NETWORK.id);
    } else {
      closeWalletModal();
    }
  }, [isConnected, currentChain, switchNetwork]);

  const connectorsWithIcons = connectors.map(connector => ({
    connector,
    icon: utils.images.getConnectorIcon(connector.name)
  }));
  // TODO: make this have some cool handling
  if (!connectorsWithIcons.length) console.error("No connectors");

  return (
    <BaseModal isOpen={isModalOpen} onClose={closeWalletModal}>
      <div className="text-center">
        {currentChain?.name.toLowerCase() !==
          constants.blockchain.GOERLI_NETWORK.name.toLowerCase() &&
          isConnected && (
            <span className="mb-4 block font-semibold text-red-600">
              Please connect to Goerli to use Horse Link
            </span>
          )}

        {connectorsWithIcons.map(({ connector, icon }, index, array) => {
          // react components must be upper case :/
          const Icon = icon;
          if (!Icon)
            throw new Error(
              `Could not find icon for connector ${connector.name}`
            );

          const isLastElement = array.length - 1 === index;

          return (
            <React.Fragment>
              <div>
                <label
                  className="flex cursor-pointer justify-center"
                  onClick={e => {
                    e.preventDefault();
                    connect({ connector });
                  }}
                >
                  <Icon
                    title={`${connector.name}-icon`}
                    className="h-20 w-20 opacity-100 transition-opacity duration-500 ease-out hover:opacity-40"
                  />
                </label>
                <div className="font-bold">{connector.name.toUpperCase()}</div>
                <div>Connect using your browser.</div>
              </div>

              <div
                className={classNames(
                  "mb-3 border-0 border-b border-solid py-4",
                  {
                    hidden: isLastElement
                  }
                )}
              ></div>
            </React.Fragment>
          );
        })}
      </div>
    </BaseModal>
  );
};
