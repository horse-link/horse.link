import { useEffect, useState } from "react";
import api from "../../apis/Api";

const useMarketAddressesFromAPI = () => {
  const [marketAddresses, setMarketAddresses] = useState<string[]>([]);
  useEffect(() => {
    const load = async () => {
      const marketAddresses = await api.getMarketAddresses();
      setMarketAddresses(marketAddresses);
    };
    load();
  }, []);

  return { marketAddresses: marketAddresses as unknown as string[] };
};

const useMarkets = () => {
  const { marketAddresses } = useMarketAddressesFromAPI();
  return { marketAddresses };
};

export default useMarkets;
