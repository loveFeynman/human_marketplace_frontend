import axios from "axios";
import { backendBaseUrl } from "@constant";

export const saveSaleHistory = (data) => {
    axios
        .post(`${backendBaseUrl}/api/sale_history/put_sale_history`, data)
        .catch((err) => {
            return false;
        });
};
