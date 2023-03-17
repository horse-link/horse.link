import { CRYPTO_ICONS, SVG_ICONS } from "../icons";

export const getCryptoIcon = (symbol: string) =>
  CRYPTO_ICONS[symbol.toUpperCase()];

export const getConnectorIcon = (name: string) => {
  const firstWordOfName = name.split(" ")[0].toLowerCase();
  const matchingKey = Object.keys(SVG_ICONS).find(key =>
    key.toLowerCase().includes(firstWordOfName)
  );
  if (!matchingKey) return;

  return SVG_ICONS[matchingKey];
};
