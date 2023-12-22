import { CRYPTO_ICONS, SVG_ICONS } from "../icons";

export const getCryptoIcon = (symbol: string): string => {
  // temporary workaround to get the right token symbol
  if (symbol.toLowerCase().includes("hl")) {
    return "/images/horse.webp";
  }
  return CRYPTO_ICONS[symbol.toUpperCase()] ?? CRYPTO_ICONS.DEFAULT;
};

export const getConnectorIcon = (name: string) => {
  const firstWordOfName = name.split(" ")[0].toLowerCase();
  const matchingKey = Object.keys(SVG_ICONS).find(key =>
    key.toLowerCase().includes(firstWordOfName)
  );
  if (!matchingKey) return;

  return SVG_ICONS[matchingKey];
};
