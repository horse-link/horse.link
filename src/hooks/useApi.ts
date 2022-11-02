import { useMemo } from "react";
import Api from "../apis/Api";

// export memoised api so it does not reconstruct on every render
const useApi = () => useMemo(() => Api, [Api]);

export default useApi;
