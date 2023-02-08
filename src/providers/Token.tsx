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

export const TokenContext = createContext<TokenContextType>({
  tokensLoading: false,
  changeToken: () => {}
});

export const useTokenContext = () => useContext(TokenContext);

export const TokenContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const config = useConfig();
  const [currentToken, setCurrentToken] = useState<Token>();
  const [availableTokens, setAvailableTokens] = useState<Array<Token>>();
  const [tokensLoading, setTokensLoading] = useState(false);

  // load tokens
  useEffect(() => {
    if (!config) return setTokensLoading(true);

    const tokens: Array<Token> = config.tokens.map(t => ({
      address: t.address,
      symbol: t.symbol,
      decimals: t.decimals.toString()
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

  const value = useMemo<TokenContextType>(
    () => ({
      currentToken,
      availableTokens,
      tokensLoading,
      changeToken
    }),
    [
      currentToken,
      setCurrentToken,
      availableTokens,
      setAvailableTokens,
      tokensLoading,
      setTokensLoading,
      changeToken
    ]
  );

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};
