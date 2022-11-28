import { useEffect, useState } from "react";
import api from "../../apis/Api";

const useVaultAddresesFromAPI = () => {
  const [vaultAddresses, setVaultAddresses] = useState<string[]>([]);
  useEffect(() => {
    const load = async () => {
      const vaultAddresses = await api.getVaultAddresses();
      setVaultAddresses(vaultAddresses);
    };
    load();
  }, []);

  return { vaultAddresses: vaultAddresses as unknown as string[] };
};

const useVaults = () => {
  const { vaultAddresses } = useVaultAddresesFromAPI();
  return { vaultAddresses };
};

export default useVaults;
