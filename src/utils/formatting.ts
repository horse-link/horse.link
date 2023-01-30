import dayjs from "dayjs";
import { ethers } from "ethers";
import { MeetInfo } from "../types/meets";
import { BetId } from "../types/subgraph";

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

export const formatTimeToHMS = (time: string) => {
  const now = dayjs();
  const date = dayjs(time);

  const isNegative = now > date;
  const prefix = isNegative ? "-" : "";

  const hours = date.diff(now, "hours");
  const minutes = date.diff(now.add(hours, "hours"), "minutes");
  const seconds = date.diff(
    now.add(hours, "hours").add(minutes, "minutes"),
    "seconds"
  );

  return `${prefix}${Math.abs(hours)}h ${Math.abs(minutes)}m ${Math.abs(
    seconds
  )}s`;
};
export const formatTrackCondition = (meetRaces: MeetInfo) => {
  if (!meetRaces.trackCondition) return;

  const LookupMap: Map<string, string> = new Map([
    ["GOOD", "GOOD"],
    ["GOOD3", "GOOD (3)"],
    ["GOOD4", "GOOD (4)"],
    ["FIRM1", "FIRM (1)"],
    ["FIRM2", "FIRM (2)"],
    ["SOFT5", "SOFT (5)"],
    ["SOFT6", "SOFT (6)"],
    ["SOFT7", "SOFT (7)"],
    ["HVY8", "HEAVY (8)"],
    ["HVY9", "HEAVY (9)"],
    ["HVY10", "HEAVY (10)"],
    ["SYNTHETIC", "Synthetic"],
    ["UNKNOWN", "Unknown"]
  ]);

  return LookupMap.get(meetRaces.trackCondition.toUpperCase());
};
