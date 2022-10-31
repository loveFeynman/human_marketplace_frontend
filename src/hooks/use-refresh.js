import { useContext } from "react";
import { RefreshContext } from "@context";

const useRefresh = () => {
    const { value, refreshAll, second } = useContext(RefreshContext);
    return { normal: value, refresh: refreshAll, second };
};

export default useRefresh;
