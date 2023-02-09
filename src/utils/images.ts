import * as Icons from "../icons";

export const getImageFromSymbol = (symbol: string) => {
  if (!Object.keys(Icons).includes(symbol)) return;

  const icons = Object.entries(Icons).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key as string]: value as string
    }),
    {} as Record<string, string>
  );

  return icons[symbol.toUpperCase()];
};
