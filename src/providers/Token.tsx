import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { TokenContextType } from "../types/context";
import { Token } from "../types/tokens";
import { useConfig } from "./Config";
import { TokenModal } from "../components/Modals";
import utils from "../utils";

export const TokenContext = createContext<TokenContextType>({
  tokensLoading: false,
  changeToken: () => {},
  openModal: () => {}
});

export const useTokenContext = () => useContext(TokenContext);

export const TokenContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const config = useConfig();
  const [currentToken, setCurrentToken] = useState<Token>();
  const [availableTokens, setAvailableTokens] = useState<Array<Token>>();
  const [tokensLoading, setTokensLoading] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  // load tokens
  useEffect(() => {
    if (!config) return setTokensLoading(true);

    const tokens: Array<Token> = config.tokens.map(t => ({
      address: t.address,
      symbol: t.symbol,
      decimals: t.decimals.toString(),
      src: utils.images.getImageFromSymbol(t.symbol),
      name: t.name
    }));

    if (!tokens.length) return setTokensLoading(false);

    setAvailableTokens(tokens);
    setCurrentToken(tokens[0]);

    setTokensLoading(false);
  }, [config]);

  const filteredTokens = useMemo(() => {
    if (!availableTokens || !availableTokens.length || !currentToken) return;

    return availableTokens.filter(
      t => t.address.toLowerCase() !== currentToken.address.toLowerCase()
    );
  }, [availableTokens, currentToken, setAvailableTokens, setCurrentToken]);

  const changeToken = useCallback(
    (to: Token) => {
      if (!filteredTokens || !filteredTokens.length) return;

      const newToken = filteredTokens.find(
        t => JSON.stringify(t) === JSON.stringify(to)
      );
      if (!newToken) return;

      setCurrentToken(newToken);
    },
    [filteredTokens]
  );

  const openModal = useCallback(() => setTokenModalOpen(true), []);
  const closeModal = useCallback(() => setTokenModalOpen(false), []);

  const value = useMemo<TokenContextType>(
    () => ({
      currentToken,
      availableTokens,
      tokensLoading,
      changeToken,
      openModal
    }),
    [
      currentToken,
      setCurrentToken,
      availableTokens,
      setAvailableTokens,
      tokensLoading,
      setTokensLoading,
      changeToken,
      openModal
    ]
  );

  return (
    <TokenContext.Provider value={value}>
      {children}
      <TokenModal
        availableTokens={availableTokens}
        tokensLoading={tokensLoading}
        isOpen={tokenModalOpen}
        onClose={closeModal}
      />
    </TokenContext.Provider>
  );
};
