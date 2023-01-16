import utils from "../../utils";
import { Config, MarketInfo } from "../../types/config";
import Skeleton from "react-loading-skeleton";
import { ethers } from "ethers";

type Props = {
  config: Config;
  market: MarketInfo;
};

export const MarketRow: React.FC<Props> = ({ config, market }) => {
  const vault = utils.config.getVault(market.vaultAddress, config);

  return (
    <tr key={market.address}>
      <td className="pl-5 pr-2 py-4 whitespace-nowrap">
        {vault?.name || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        $
        {`${utils.formatting.formatToFourDecimals(
          ethers.utils.formatUnits(market.totalInPlay, vault?.asset.decimals)
        )} ${vault?.asset.symbol}` || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {market.address || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {market.vaultAddress || <Skeleton />}
      </td>
    </tr>
  );
};
