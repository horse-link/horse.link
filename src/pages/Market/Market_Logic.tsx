import useMarkets from "../../hooks/useMarkets";
import MarketView from "./Market_View";

const getMockAddresses = () => {
  return Array.from({ length: 5 }, () => "");
};

const MarketLogic = () => {
  const { marketAddresses } = useMarkets();
  return (
    <MarketView
      marketAddressList={marketAddresses || getMockAddresses()}
      onClickMarket={() => ({})}
    />
  );
};

export default MarketLogic;
