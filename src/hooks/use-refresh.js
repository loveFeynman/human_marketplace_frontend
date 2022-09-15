import { useContext } from "react";
import { RefreshContext } from "@context";

const useRefresh = () => {
    const { value, refreshAll } = useContext(RefreshContext);
    return { normal: value, refresh: refreshAll };
};

export default useRefresh;
