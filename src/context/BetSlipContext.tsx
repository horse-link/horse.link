import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { BetSlipContextType, BetSlipEntry } from "../types/context";
import { useMarketContract } from "../hooks/contracts";
import { useSigner } from "wagmi";
import { BetSlipModal } from "../components/Modals";
import { ethers } from "ethers";
import utils from "../utils";
import { useConfig } from "../providers/Config";

const LOCAL_STORAGE_KEY = "horse.link-bet-slip";

export const BetSlipContext = createContext<BetSlipContextType>({
  txLoading: false,
  hashes: undefined,
  bets: undefined,
  error: undefined,
  addBet: () => {},
  removeBet: () => {},
  clearBets: () => {},
  placeBets: () => {},
  openModal: () => {}
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
  const [error, setError] = useState<string>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // write bet slip to local storage if bets exist
  useEffect(() => {
    if (bets && bets.length)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bets));
  }, [bets]);

  // load bets on page load
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw || raw === "undefined") return;
    setBets(JSON.parse(raw));
  }, []);

  const addBet = useCallback(
    (bet: Omit<BetSlipEntry, "id">) => {
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
    setError(undefined);
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

  const placeBets = useCallback(() => {
    // if there are no bets, or signer, do nothing
    if (!bets?.length || !signer || !config) return;

    setTxLoading(true);
    setHashes(undefined);

    const ERROR_VALUE = "error";

    Promise.all(
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
          signer
        );
      })
    )
      .then(hashes => {
        const filteredHashes = hashes.filter(hash => hash !== ERROR_VALUE);
        if (!filteredHashes.length) return setTxLoading(false);

        setHashes(filteredHashes);
        clearBets();

        setTxLoading(false);
      })
      .catch(e => {
        const err = (e as any).reason as string;
        switch (true) {
          case err.includes("date"):
            setError("One or more bets have an invalid date");
            break;
          default:
            setError(err);
            break;
        }

        setTxLoading(false);
      });
  }, [config, bets, signer, placeBet]);

  const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setHashes(undefined);
      setError(undefined);
    }, 300);
  }, [setIsModalOpen]);

  const value = useMemo(
    () => ({
      txLoading,
      hashes,
      bets,
      error,
      addBet,
      removeBet,
      clearBets,
      placeBets,
      openModal
    }),
    [
      txLoading,
      hashes,
      bets,
      error,
      addBet,
      removeBet,
      clearBets,
      placeBets,
      openModal
    ]
  );

  return (
    <BetSlipContext.Provider value={value}>
      {children}
      <BetSlipModal isOpen={isModalOpen} onClose={closeModal} />
    </BetSlipContext.Provider>
  );
};
