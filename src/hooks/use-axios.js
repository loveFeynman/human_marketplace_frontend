import { useCallback } from "react";
import axios from "axios";
import { backendBaseUrl } from "@constant";

function useAxios() {
    const saveSaleHistory = (data) => {
        axios
            .post(`${backendBaseUrl}/api/sale_history/put_sale_history`, data)
            .catch((err) => {
                console.log("save sale history error: ", err);
            });
    };
    return { saveSaleHistory };
}

export default useAxios;
