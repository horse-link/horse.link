import { ethers, providers } from "ethers";
import {
  AddChainError,
  Chain,
  ChainNotConfiguredError,
  Connector,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  chain
} from "wagmi";

// documentation:
// https://wagmi.sh/examples/custom-connector
// https://github.com/wagmi-dev/references/blob/9cb0535077504c27626b2e4bc32dc983d63a56ba/packages/connectors/src/coinbaseWallet.ts
// https://github.com/wagmi-dev/references/blob/9cb0535077504c27626b2e4bc32dc983d63a56ba/packages/connectors/src/walletConnect.ts

// node_modules/@ethersproject/networks/src.ts/types.ts/Networkish
type EthersNetwork = {
  name: string;
  chainId: number;
  ensAddress?: string;
  _defaultProvider?: (providers: any, options?: any) => any;
};

// node_modules/@ethersproject/providers/src.ts/url-json-rpc-provider.ts:53
type Options = {
  network?: EthersNetwork | string | number;
  apiKey?: any;
};

export class HorseLinkWalletConnector extends Connector<
  providers.AlchemyProvider,
  Options,
  ethers.Signer
> {
  readonly id = "hlWallet";
  readonly name = "HL Wallet";
  readonly ready = true;

  // fallbacks, assigned in constructor
  private fallbackChainId: number = 0;
  readonly fallbackChain = {
    id: this.fallbackChainId,
    get name() {
      return `Chain ${this.id}`;
    },
    get network() {
      return this.id.toString();
    },
    nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
    rpcUrls: { default: "", public: "" }
  };

  // user wallet
  #wallet?: ethers.Wallet;

  constructor({
    chains,
    options
  }: {
    chains?: Array<Chain>;
    options: Options;
  }) {
    if (!chains?.length) throw new Error("Cannot initialise without chains");

    super({
      chains,
      options
    });

    this.fallbackChainId = chains[0].id;

    const { network, apiKey } = options;
    const provider = new providers.AlchemyProvider(network, apiKey);

    const wallet = ethers.Wallet.createRandom();
    const providedWallet = new ethers.Wallet(wallet.privateKey, provider);

    // assign wallet
    this.#wallet = providedWallet;
  }

  // core
  async connect(
    { chainId }: { chainId?: number } = { chainId: this.fallbackChain.id }
  ) {
    try {
      const provider = await this.getProvider();

      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);

      let id = await this.getChainId();
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
      }

      const account = await this.getAccount();

      return {
        account,
        chain: { id, unsupported: this.isChainUnsupported(id) },
        provider
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async disconnect() {
    if (!this.#wallet) return;

    const provider = await this.getProvider();
    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);

    this.#wallet = undefined;
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    const id = ethers.utils.hexValue(chainId);

    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: id }]);
      return (
        this.chains.find(chain => chain.id === chainId) || this.fallbackChain
      );
    } catch (e) {
      const chain = this.chains.find(chain => chain.id === chainId);
      if (!chain)
        throw new ChainNotConfiguredError({ chainId, connectorId: this.id });

      // indicates chain is not added to provider
      if ((e as ProviderRpcError).code === 4902) {
        try {
          const newChainToAdd = {
            chainId: id,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: [chain.rpcUrls.public || ""],
            blockExplorerUrls: this.getBlockExplorerUrls(chain)
          };
          await provider.send("wallet_addEthereumChain", [newChainToAdd]);

          return chain;
        } catch (addError) {
          if (this.isUserRejectedRequestError(addError))
            throw new UserRejectedRequestError(addError);
          throw new AddChainError();
        }
      }

      if (this.isUserRejectedRequestError(e))
        throw new UserRejectedRequestError(e);
      throw new SwitchChainError(e);
    }
  }

  // event listeners
  protected onAccountsChanged(accounts: `0x${string}`[]): void {
    if (!accounts.length) {
      this.emit("disconnect");
      return;
    }

    this.emit("change", { account: accounts[0] });
    return;
  }

  protected onChainChanged(chain: string | number): void {
    const unsupported = this.isChainUnsupported(+chain);
    this.emit("change", {
      chain: {
        id: +chain,
        unsupported
      }
    });
    return;
  }

  protected onDisconnect(): void {
    this.emit("disconnect");
    return;
  }

  // getters
  async getAccount() {
    const wallet = await this.getWallet();
    return ethers.utils.getAddress(wallet.address);
  }

  async getChainId(): Promise<number> {
    const provider = await this.getProvider();
    return provider.network.chainId;
  }

  getWallet() {
    if (!this.#wallet)
      throw new Error("The user wallet has not been generated yet");

    return this.#wallet;
  }

  async getProvider() {
    const wallet = this.getWallet();
    return wallet.provider as providers.AlchemyProvider;
  }

  // required by class extension
  async getSigner() {
    return this.getWallet();
  }

  // utils
  isChainUnsupported(chainId: number): boolean {
    const supportedNetworks = [chain.arbitrum.id, chain.goerli.id];
    return !supportedNetworks.includes(chainId);
  }

  isUserRejectedRequestError(e: unknown) {
    return /(user rejected)/i.test((e as Error).message);
  }

  async isAuthorized(): Promise<boolean> {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }
}
