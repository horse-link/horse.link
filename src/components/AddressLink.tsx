import { Address } from "wagmi";
import constants from "../constants";
import utils from "../utils";

type Props = {
  address: Address;
  isTruncated?: boolean;
};

export const AddressLink: React.FC<Props> = ({ address, isTruncated }) => (
  <a
    href={`${constants.env.SCANNER_URL}/address/${address}`}
    target="_blank"
    rel="noreferrer noopener"
    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
  >
    {isTruncated ? utils.formatting.shortenAddress(address) : address}
  </a>
);
