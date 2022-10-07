import useMarkets from "../../hooks/useMarkets";
import MarketView from "./Market_View";

const MarketLogic = () => {
  const { marketAddresses } = useMarkets();
  return (
    <MarketView
      marketAddressList={marketAddresses}
      onClickMarket={() => ({})}
    />
  );
};

export default MarketLogic;
