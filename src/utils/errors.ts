import { ethers } from "ethers";

enum ContractError {
  BackInvalidDate = "back: Invalid date",
  BackInvalidSignature = "back: Invalid signature",
  BackOracleAlreadySet = "back: Oracle result already set for this market",
  BackPayoutDateNotReached = "payout: Payout date not reached",
  BetAlreadySettled = "Bet has already settled",
  OracleCheckResultNotSet = "checkResult: Invalid propositionId",
  OracleGetResultNotSet = "getResult: Invalid propositionId",
  OracleSetResultAlreadySet = "setResult: Result already set",
  OracleSetResultInvalidPropositionId = "setResult: Invalid propositionId",
  OracleSetResultInvalidSignature = "setResult: Invalid signature",
  OracleSetScratchedResultAlreadySet = "setScratchedResult: Result already set",
  OracleSetScratchedResultInvalidPropositionId = "setScratchedResult: Invalid propositionId",
  OracleSetScratchedResultInvalidSignature = "setScratchedResult: Invalid signature",
  VaultTransferLockedTimeNotPassed = "transfer: Locked time not passed",
  VaultWithdrawLockedTimeNotPassed = "withdraw: Locked time not passed"
}

const contractErrorLookup: Record<ContractError, string> = {
  [ContractError.BackInvalidDate]: "Betting has closed on this race.",
  [ContractError.BackInvalidSignature]:
    "We weren't able to verify your bet. Please refresh the page and try again. If the issue persists, please contact us.",
  [ContractError.BackOracleAlreadySet]:
    "Someone else has already registered the result for this race. Please try again.",
  [ContractError.BackPayoutDateNotReached]:
    "This race is not paying out yet. Please wait.",
  [ContractError.BetAlreadySettled]: "No worries! The bet has already settled.",
  [ContractError.OracleCheckResultNotSet]:
    "The result for this race has not been registered yet.",
  [ContractError.OracleGetResultNotSet]:
    "The result for this race has not been registered yet.",
  [ContractError.OracleSetResultAlreadySet]:
    "The result has already been set for this race.",
  [ContractError.OracleSetResultInvalidPropositionId]:
    "Something went wrong while registering the result for this race. Please refresh the page and try again. If the issue persists, please contact us.",
  [ContractError.OracleSetResultInvalidSignature]:
    "We weren't able to verify your transaction to set the result for this race. Please refresh the page and try again. If the issue persists, please contact us.",
  [ContractError.OracleSetScratchedResultAlreadySet]:
    "Someone else already registered the scratched runner. Please try again.",
  [ContractError.OracleSetScratchedResultInvalidPropositionId]:
    "Something went wrong while registering a scratched runner. Please refresh the page and try again. If the issue persists, please contact us.",
  [ContractError.OracleSetScratchedResultInvalidSignature]:
    "We weren't able to verify your transaction to register a scratched runner. Please refresh the page and try again. If the issue persists, please contact us.",
  [ContractError.VaultTransferLockedTimeNotPassed]:
    "You can't redeem your vault shares yet. You must wait until the locked period has elapsed.",
  [ContractError.VaultWithdrawLockedTimeNotPassed]:
    "You can't trade your vault shares yet. You must wait until the locked period has elapsed."
};

const DEFAULT_BLOCKCHAIN_ERROR =
  "Something went wrong while processing your transaction. Please refresh the page and try again. If the issue persists, please contact us.";
const DEFAULT_ERROR_MESSAGE =
  "Something went wrong. Please refresh the page and try again. If the issue persists, please contact us.";

const ethersErrorLookup: Record<ethers.errors, string> = {
  [ethers.errors.ACTION_REJECTED]:
    "It looks like you rejected the transaction. Please try again.",
  [ethers.errors.NETWORK_ERROR]:
    "We're having trouble connecting to the network. Please check your internet connection and try again.",
  [ethers.errors.INSUFFICIENT_FUNDS]:
    "You don't have enough 'gas' to send this transaction. You can get some more through the faucet.",
  [ethers.errors.UNPREDICTABLE_GAS_LIMIT]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.CALL_EXCEPTION]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.SERVER_ERROR]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.TIMEOUT]:
    "We're having trouble connecting to the network. Please check your internet connection and try again.",
  [ethers.errors.UNKNOWN_ERROR]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.NOT_IMPLEMENTED]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.UNSUPPORTED_OPERATION]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.BUFFER_OVERRUN]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.NUMERIC_FAULT]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.MISSING_NEW]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.INVALID_ARGUMENT]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.MISSING_ARGUMENT]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.UNEXPECTED_ARGUMENT]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.NONCE_EXPIRED]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.REPLACEMENT_UNDERPRICED]: DEFAULT_BLOCKCHAIN_ERROR,
  [ethers.errors.TRANSACTION_REPLACED]: DEFAULT_BLOCKCHAIN_ERROR
};

export const getMeaningfulMessage = (error: any) => {
  console.error(error);
  const stringified = JSON.stringify(error.message).toLowerCase();
  const contractError = Object.keys(contractErrorLookup).find(key =>
    stringified.includes(key.toLowerCase())
  );
  if (contractError) {
    return contractErrorLookup[contractError as ContractError];
  }
  if (error?.code && ethersErrorLookup[error?.code as ethers.errors]) {
    return ethersErrorLookup[error.code as ethers.errors];
  }
  return DEFAULT_ERROR_MESSAGE;
};
