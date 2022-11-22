import useMarketStatistics from "../../hooks/data/useMarketStatistics";
import useMarkets from "../../hooks/market/useMarkets";
import MarketView from "./Market_View";

const getMockAddresses = () => {
  return Array.from({ length: 5 }, () => "");
};

const MarketLogic = () => {
  const { marketAddresses } = useMarkets();
  const { totalBets, totalVolume, largestBet } = useMarketStatistics();

  return (
    <MarketView
      marketAddressList={
        marketAddresses.length > 0 ? marketAddresses : getMockAddresses()
      }
      onClickMarket={() => ({})}
      stats={{
        totalBets,
        totalVolume,
        largestBet
      }}
    />
  );
};

export default MarketLogic;
