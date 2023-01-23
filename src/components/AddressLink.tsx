import { Address } from "wagmi";
import constants from "../constants";

export const AddressLink = (props: { address: Address }) => (
  <a
    href={`${constants.env.SCANNER_URL}/address/${props.address}`}
    target="_blank"
    rel="noreferrer noopener"
    className="text-blue-600"
  >
    {props.address}
  </a>
);
