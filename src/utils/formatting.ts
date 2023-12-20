import dayjs from "dayjs";
import { ethers } from "ethers";
import { MeetInfo } from "../types/meets";
import { BetId, Deposit, Withdraw } from "../types/subgraph";
import { Chain } from "wagmi";
import { VaultTransaction } from "../types/vaults";

export const formatToFourDecimals = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  if (parsedAmount === 0) return "0.0000";
  if (parsedAmount < 0.0001) return "<0.0001";

  const roundedToFourDecimal = parsedAmount.toFixed(4);
  return roundedToFourDecimal;
};

// returns four decimals without special formatting
export const formatToFourDecimalsRaw = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  // parsedAmount === 0
  if (!parsedAmount) return "0.0000";

  return parsedAmount.toFixed(4);
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

/**
 * @deprecated
 */
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

// Deprecated
export const formatTimeToHMS = (time: string, shortForm?: boolean) => {
  const now = dayjs();

  // time is less than 5 mins
  return formatTimeToHMSFromNow(now, time, shortForm);
};

export const formatTimeToHMSFromNow = (
  now: dayjs.Dayjs,
  time: string,
  shortForm?: boolean
) => {
  const date = dayjs(time);

  const isNegative = now > date;
  const prefix = isNegative ? "-" : "";

  const hours = date.diff(now, "hours");
  const minutes = date.diff(now.add(hours, "hours"), "minutes");
  const seconds = date.diff(
    now.add(hours, "hours").add(minutes, "minutes"),
    "seconds"
  );

  // return longform H M S
  if (!shortForm)
    return `${prefix}${Math.abs(hours)}h ${Math.abs(minutes)}m ${Math.abs(
      seconds
    )}s`;

  // if time > 2 hours
  if (Math.abs(hours) > 2) {
    const shortformHours = minutes > 30 ? hours + 1 : hours;
    return `${prefix}${Math.abs(shortformHours)}h`;
  }

  // if time is between 1 and 2 hours
  if (Math.abs(hours) >= 1)
    return `${prefix}${Math.abs(hours)}h ${Math.abs(minutes)}m`;

  // if time is less than 1 hour but over 5 minutes
  if (Math.abs(hours) < 1 && minutes >= 5)
    return `${prefix}${Math.abs(minutes)}m`;

  // time is less than 5 mins
  return `${prefix}${Math.abs(minutes)}m ${Math.abs(seconds)}s`;
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

export const formatOrdinals = (n: number) => {
  const pr = new Intl.PluralRules("en-US", { type: "ordinal" });

  const suffixes = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"]
  ]);
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
};

export const formatChain = (chain: Chain): Chain => ({
  ...chain,
  // take out spaces and capitals
  name: chain.name.split(" ")[0].toLowerCase()
});

export const formatVaultTransactionIntoDeposit = ({
  id,
  vaultAddress,
  userAddress,
  amount,
  timestamp
}: VaultTransaction): Partial<Deposit> => ({
  id,
  vault: vaultAddress,
  sender: userAddress,
  assets: amount,
  createdAt: timestamp
});

export const formatVaultTransactionIntoWithdraw = ({
  id,
  vaultAddress,
  userAddress,
  amount,
  timestamp
}: VaultTransaction): Partial<Withdraw> => ({
  id,
  vault: vaultAddress,
  sender: userAddress,
  assets: amount,
  createdAt: timestamp
});
