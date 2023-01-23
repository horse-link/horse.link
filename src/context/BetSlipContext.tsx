import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState
} from "react";
import { BetSlipContextType, BetSlipEntry } from "../types/context";
import { useMarketContract } from "../hooks/contracts";
import { useSigner } from "wagmi";
import { BetSlipSuccessModal } from "../components/Modals";

export const BetSlipContext = createContext<BetSlipContextType>({
  txLoading: false,
  hashes: undefined,
  bets: undefined,
  addBet: () => {},
  removeBet: () => {},
  clearBets: () => {},
  placeBets: async () => []
});

export const useBetSlipContext = () => useContext(BetSlipContext);

export const BetSlipContextProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const { data: signer } = useSigner();
  const { placeBet } = useMarketContract();

  const [bets, setBets] = useState<BetSlipEntry[]>();
  const [txLoading, setTxLoading] = useState(false);
  const [hashes, setHashes] = useState<string[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const removeBet = useCallback(
    (id: number) => {
      // if there are no bets do nothing
      if (!bets?.length) return;

      const confirmation = confirm("Are you sure you want to remove this bet?");
      if (!confirmation) return;

      // create a new reference to bets and filter it
      const newBets = [...bets].filter(bet => bet.id !== id);

      // if the new bets has no length, set undefined
      if (!newBets.length) return setBets(undefined);

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

  const clearBets = useCallback(() => setBets(undefined), [bets]);

  const placeBets = useCallback(async () => {
    // if there are no bets, or signer, do nothing
    if (!bets?.length || !signer) return;

    setTxLoading(true);
    setHashes(undefined);
    try {
      const hashes = await Promise.all(
        bets.map(bet => placeBet(bet.market, bet.back, bet.wager, signer))
      );

      setHashes(hashes);
      setIsModalOpen(true);
    } catch (e: any) {
      console.error(e);
    } finally {
      setTxLoading(false);
      return;
    }
  }, [bets, signer, placeBet]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setHashes(undefined);
    clearBets();
  }, [setIsModalOpen, clearBets, setHashes]);

  const value = {
    hashes,
    txLoading,
    bets,
    addBet,
    removeBet,
    clearBets,
    placeBets
  };

  return (
    <BetSlipContext.Provider value={value}>
      {children}
      <BetSlipSuccessModal
        isOpen={isModalOpen}
        onClose={closeModal}
        hashes={hashes}
      />
    </BetSlipContext.Provider>
  );
};
