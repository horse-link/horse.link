export const shortenAddress = (address: string) => {
  try {
    return `${address.toString().substring(0, 6)}...${address
      .toString()
      .substring(36)}`;
  } catch (e) {
    console.log(e);
  }
};
