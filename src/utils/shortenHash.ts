export const truncateAddress = (address: string | undefined) => {
  const firstDigits = address?.substring(0, 15);
  const lastDigits = address?.substring(address.length - 15, address.length);
  return `${firstDigits}...${lastDigits}`;
};
