import { CRYPTO_ICONS, SVG_ICONS } from "../icons";

export const getCryptoIcon = (symbol: string) =>
  CRYPTO_ICONS[symbol.toUpperCase()];

export const getConnectorIcon = (name: string) => {
  const matchingKey = Object.keys(SVG_ICONS).find(key =>
    key.toLowerCase().includes(name.toLowerCase())
  );
  if (!matchingKey) return;

  return SVG_ICONS[matchingKey];
};
