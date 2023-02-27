import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { BetSlipContextType, BetSlipEntry, BetEntry } from "../types/context";
import { useMarketContract } from "../hooks/contracts";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
import utils from "../utils";
import { useConfig } from "./Config";
import dayjs from "dayjs";
import isYesterday from "dayjs/plugin/isYesterday";
import { BetSlipTxModal } from "../components/Modals";
import { Config } from "../types/config";
import { ERC20__factory, Market__factory, Vault__factory } from "../typechain";

dayjs.extend(isYesterday);

const LOCAL_STORAGE_KEY = "horse.link-bet-slip";

export const BetSlipContext = createContext<BetSlipContextType>({
  txLoading: false,
  addBet: () => {},
  removeBet: () => {},
  clearBets: () => {},
  placeBetsInBetSlip: () => {},
  placeBetImmediately: () => {}
});

export const useBetSlipContext = () => useContext(BetSlipContext);

export const BetSlipContextProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const { data: signer } = useSigner();
  const { placeBet } = useMarketContract();
  const config = useConfig();

  const [bets, setBets] = useState<BetSlipEntry[]>();
  const [txLoading, setTxLoading] = useState(false);
  const [hashes, setHashes] = useState<string[]>();
  const [errors, setErrors] = useState<string[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // write bet slip to local storage if bets exist
  useEffect(() => {
    if (bets && bets.length)
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          data: bets,
          createdAt: dayjs()
        })
      );
  }, [bets]);

  // load bets on page load
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw || raw === "undefined") return;

    const parsed = JSON.parse(raw);

    if (dayjs(parsed.createdAt).isYesterday()) {
      setBets(undefined);
      return localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    setBets(parsed.data);
  }, []);

  const addBet = useCallback(
    (bet: BetEntry) => {
      // if there are no bets, set the bets state to the new bet, id 0
      if (!bets?.length)
        return setBets([
          {
            ...bet,
            id: 0,
            timestamp: Math.floor(Date.now() / 1000)
          }
        ]);

      // create a new reference to bets and add timestamp
      const oldBets = [...bets];
      // and append the new bet, id is the index
      setBets(
        [...oldBets, bet].map((bet, i) => ({
          ...bet,
          id: i
        }))
      );
    },
    [bets]
  );

  const clearBets = useCallback(() => {
    setBets(undefined);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [bets]);

  const removeBet = useCallback(
    (id: number) => {
      // if there are no bets do nothing
      if (!bets?.length) return;

      // create a new reference to bets and filter it
      const newBets = [...bets].filter(bet => bet.id !== id);

      // if the new bets has no length, set undefined
      if (!newBets.length) return clearBets();

      // set the bets
      setBets(
        newBets.map((bet, i) => ({
          ...bet,
          id: i
        }))
      );
    },
    [bets]
  );

  const placeBets = async (
    bets: BetSlipEntry[] | BetEntry[],
    signer: ethers.Signer,
    config: Config,
    skipAllowanceCheck: boolean
  ) => {
    const raw = await Promise.allSettled(
      bets.map(bet => {
        const vault = utils.config.getVaultFromMarket(bet.market, config);
        if (!vault)
          throw new Error(
            `Could not find vault associated with market, ${bet.market.address}`
          );
        const formattedWager = ethers.utils.formatUnits(
          bet.wager,
          vault.asset.decimals
        );

        return placeBet(
          bet.market,
          bet.back,
          // parse wager into BigNumber
          ethers.utils.parseUnits(formattedWager, vault.asset.decimals),
          signer,
          skipAllowanceCheck
        );
      })
    );

    // extract hashes and errors
    const txs = raw.filter(utils.types.isFulfilled).map(r => r.value);
    const errors = raw
      .filter(utils.types.isRejected)
      .map(r => r.reason as string);

    return { txs, errors };
  };

  const placeBetsInBetSlip = useCallback(async () => {
    if (!bets?.length || !signer || !config) return;

    // reset state
    setTxLoading(true);
    setHashes(undefined);
    setErrors(undefined);

    // we want to skip the check in the placeBets function
    // so we do the allowance checks here first

    // first reduce the bets to the asset addresses
    const reducedAssets = bets.reduce((prevArray, bet) => {
      const vault = utils.config.getVaultFromMarket(bet.market, config);
      if (!vault)
        throw new Error(
          `Could not find vault for market ${bet.market.address}`
        );

      return [...prevArray, vault.asset.address.toLowerCase()];
    }, [] as Array<string>);

    // then we make a set to remove duplicates
    const assetAddresses = [...new Set(reducedAssets)];

    // we want to sum all the wagers per address, so that we can check the allowances against the sum
    const totalWagers = assetAddresses.map(address => {
      const betsForAddress = bets.filter(bet => {
        // we can guarantee this exists from before
        const vault = utils.config.getVaultFromMarket(bet.market, config)!;

        return vault.asset.address.toLowerCase() === address.toLowerCase();
      });

      return {
        address,
        total: betsForAddress.reduce(
          (sum, bet) => sum.add(bet.wager),
          ethers.constants.Zero
        )
      };
    });

    // before queuing up the transactions, we want to do the same thing as the assetAddresses
    // but with the market addresses so we can check the allowances
    const reducedMarkets = bets.map(bet => bet.market.address.toLowerCase());
    const marketAddresses = [...new Set(reducedMarkets)];

    // now we can check allowances and queue transactions
    await Promise.all(
      marketAddresses.map(async marketAddress => {
        // generate contracts
        const marketContract = Market__factory.connect(marketAddress, signer);
        const vaultAddress = await marketContract.getVaultAddress();
        const vaultContract = Vault__factory.connect(vaultAddress, signer);
        const assetAddress = await vaultContract.asset();
        const assetContract = ERC20__factory.connect(assetAddress, signer);

        // get user allowance
        const allowance = await assetContract.allowance(
          await signer.getAddress(),
          marketAddress
        );

        // get the total wager that matches the asset address, we can guarantee this exists from before
        const wager = totalWagers.find(
          wager => wager.address.toLowerCase() === assetAddress.toLowerCase()
        )!;

        // check and queue approvals
        if (allowance.lt(wager.total))
          await (
            await assetContract.approve(
              marketAddress,
              ethers.constants.MaxUint256
            )
          ).wait();
      })
    );

    // settle bets, skipping allowance check
    const { txs, errors } = await placeBets(bets, signer, config, true);

    // set errors
    setErrors(errors);

    // set hashes
    setHashes(txs);
    clearBets();

    // stop loading
    setTxLoading(false);

    // open modal
    setIsModalOpen(true);
  }, [config, bets, signer, placeBet]);

  const placeBetImmediately = useCallback(
    async (bet: BetEntry) => {
      if (!bet || !signer || !config) return;

      // reset state
      setTxLoading(true);
      setHashes(undefined);
      setErrors(undefined);

      // open modal
      setIsModalOpen(true);

      // settle bets
      const { txs, errors } = await placeBets([bet], signer, config, false);

      // set errors
      setErrors(errors);

      // set hashes
      setHashes(txs);

      // stop loading
      setTxLoading(false);
    },
    [config, signer, placeBet]
  );

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const value = useMemo(
    () => ({
      txLoading,
      hashes,
      bets,
      errors,
      addBet,
      removeBet,
      clearBets,
      placeBetsInBetSlip,
      placeBetImmediately
    }),
    [
      txLoading,
      hashes,
      bets,
      errors,
      addBet,
      removeBet,
      clearBets,
      placeBetsInBetSlip,
      placeBetImmediately
    ]
  );

  return (
    <BetSlipContext.Provider value={value}>
      {children}
      <BetSlipTxModal isOpen={isModalOpen} onClose={closeModal} />
    </BetSlipContext.Provider>
  );
};
