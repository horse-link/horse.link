import { ethers } from "ethers";
import moment from "moment";
import { BetId } from "../types/entities";

export const formatToFourDecimals = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  if (parsedAmount === 0) return "0.0000";
  if (parsedAmount < 0.0001) return "<0.0001";

  const roundedToFourDecimal = parsedAmount.toFixed(4);
  return roundedToFourDecimal;
};

export const formatToTwoDecimals = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  const roundedToTwoDecimals = parsedAmount.toFixed(2);
  return roundedToTwoDecimals;
};

// add a comma every 3 digits
export const formatNumberWithCommas = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  const formatToFourDecimal = parsedAmount.toFixed(6);
  const roundedToFourDecimal = +formatToFourDecimal;
  const convertToFourDecimalsWithCommas = roundedToFourDecimal.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 4,
      minimumFractionDigits: 4
    }
  );
  return convertToFourDecimalsWithCommas;
};

export const formatBetId = (betId: BetId) => {
  const segments = betId.split("_");
  return +segments[2];
};

export const shortenAddress = (address: string) =>
  `${address.slice(0, 5)}...${address.slice(address.length - 5)}`;

export const shortenHash = (hash: string) => {
  const start = hash.substring(0, 15);
  const end = hash.substring(hash.length - 15, hash.length);
  return `${start}...${end}`;
};

// Derived from EthersJS version for Bytes32
export const formatBytes16String = (text: string) => {
  // Get the bytes
  const bytes = ethers.utils.toUtf8Bytes(text);

  // Check we have room for null-termination
  if (bytes.length > 15)
    throw new Error("bytes16 string must be less than 16 bytes");

  // Zero-pad (implicitly null-terminates)
  return ethers.utils.hexlify(
    ethers.utils.concat([bytes, ethers.constants.HashZero]).slice(0, 16)
  );
};

// Derived from EthersJS version for Bytes32
export const parseBytes16String = (bytes: ethers.BytesLike) => {
  const data = ethers.utils.arrayify(bytes);

  // Must be 16 bytes with a null-termination
  if (data.length !== 16)
    throw new Error("invalid bytes16 - not 16 bytes long");
  if (data[15] !== 0)
    throw new Error("invalid bytes16 string - no null terminator");

  // Find the null termination
  const nullTermination = data.indexOf(0);

  // Determine the string value
  return ethers.utils.toUtf8String(data.slice(0, nullTermination));
};

export const formatFirstLetterCapitalised = (string: string) =>
  `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;

export const formatTimeToMinutesAndSeconds = (time: string) => {
  // get total seconds difference between given time and now
  const totalSeconds = moment(time).diff(moment(), "seconds");
  // get the minutes difference (loses precision)
  const minuteDifference =
    totalSeconds < 0
      ? Math.ceil(totalSeconds / 60)
      : Math.floor(totalSeconds / 60);
  // get the remainder for the leftover seconds to regain precision
  const secondsDifference = totalSeconds % 60;

  const formattedMinutes =
    totalSeconds < 0 && minuteDifference == 0
      ? "-" + minuteDifference
      : minuteDifference;
  const formattedSeconds =
    totalSeconds < 0 ? secondsDifference * -1 : secondsDifference;

  return `${formattedMinutes}m ${formattedSeconds}s`;
};
