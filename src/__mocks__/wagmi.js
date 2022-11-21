const wagmi = jest.fn();

const mockUseAccount = () => {
  return {
    address: undefined,
    isConnected: false,
    isConnecting: false
  };
};

const mockUseDisconnect = () => {
  return {
    disconnect: jest.fn()
  };
};

const mockUseConnect = () => {
  return {
    connect: jest.fn(),
    connectors: jest.fn()
  };
};

wagmi.useAccount = mockUseAccount;
wagmi.useDisconnect = mockUseDisconnect;
wagmi.useConnect = mockUseConnect;

module.exports = wagmi;
