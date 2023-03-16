import { ethers, providers } from "ethers";
import { Chain, Connector, chain } from "wagmi";

// documentation:
// https://wagmi.sh/examples/custom-connector
// https://github.com/wagmi-dev/references/blob/9cb0535077504c27626b2e4bc32dc983d63a56ba/packages/connectors/src/coinbaseWallet.ts
// https://github.com/wagmi-dev/references/blob/9cb0535077504c27626b2e4bc32dc983d63a56ba/packages/connectors/src/walletConnect.ts

type Options = {
  wallet: ethers.Wallet;
  switchNetwork: (id: number) => Chain;
};

export class HorseLinkWalletConnector extends Connector<
  providers.AlchemyProvider,
  Options,
  ethers.Signer
> {
  readonly id = "horselinkwallet";
  readonly name = "HorseLink Wallet";
  readonly ready = true;

  // user wallet and network setter
  private _wallet: ethers.Wallet;
  private _switchNetwork: (id: number) => Chain;

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

    this._wallet = options.wallet;
    this._switchNetwork = options.switchNetwork;
  }

  // core
  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();

      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);

      const id = chainId || (await this.getChainId());

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
    if (!this._wallet) return;

    const provider = await this.getProvider();
    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);
  }

  async switchChain(chainId: number): Promise<Chain> {
    if (this.isChainUnsupported(chainId))
      throw new Error(`Chain ${chainId} is unsupported`);

    const newChain = this._switchNetwork(chainId);

    const provider = await this.getProvider();
    provider.emit("chainChanged", [newChain.id]);

    return newChain;
  }

  // event listeners
  protected onAccountsChanged(accounts: `0x${string}`[]): void {
    if (!accounts.length) {
      this.emit("disconnect");
      return;
    }

    this.emit("change", { account: accounts[0] });
  }

  protected onChainChanged(chain: string | number): void {
    this.emit("change", {
      chain: {
        id: +chain,
        unsupported: false
      }
    });
  }

  protected onDisconnect(): void {
    this.emit("disconnect");
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
    if (!this._wallet)
      throw new Error("The user wallet has not been generated yet");

    return this._wallet;
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
