import axios from "axios";
import { backendBaseUrl } from "@constant";

export const saveSaleHistory = (data) => {
    axios
        .post(`${backendBaseUrl}/api/sale_history/put_sale_history`, data)
        .catch((err) => {
            return false;
        });
};

export const fetchUserInfo = async (address) => {
    try {
        const userInfo = await axios.get(
            `${backendBaseUrl}/api/get_user_info`,
            {
                params: {
                    wallet: address,
                },
            }
        );
        return userInfo.data;
    } catch (err) {
        return {};
    }
};
