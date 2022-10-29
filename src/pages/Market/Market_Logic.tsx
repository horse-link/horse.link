import useMarkets from "../../hooks/market/useMarkets";
import MarketView from "./Market_View";

const getMockAddresses = () => {
  return Array.from({ length: 5 }, () => "");
};

const MarketLogic = () => {
  const { marketAddresses } = useMarkets();
  return (
    <MarketView
      marketAddressList={
        marketAddresses.length > 0 ? marketAddresses : getMockAddresses()
      }
      onClickMarket={() => ({})}
    />
  );
};

export default MarketLogic;
