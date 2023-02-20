import { Address } from "wagmi";
import constants from "../constants";
import utils from "../utils";
import classNames from "classnames";

type Props = {
  address: Address;
  isTruncated?: boolean;
  className?: string;
};

export const AddressLink: React.FC<Props> = ({
  address,
  isTruncated,
  className
}) => (
  <a
    href={`${constants.env.SCANNER_URL}/address/${address}`}
    target="_blank"
    rel="noreferrer noopener"
    className={classNames({
      hyperlink: !className,
      [className!]: !!className
    })}
  >
    {isTruncated ? utils.formatting.shortenAddress(address) : address}
  </a>
);
