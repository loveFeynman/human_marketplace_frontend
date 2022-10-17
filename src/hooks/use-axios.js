import axios from "axios";
import { backendBaseUrl } from "@constant";
import { useCallback } from "react";

function useAxios() {
    const saveSaleHistory = (data) => {
        axios
            .post(`${backendBaseUrl}/api/sale_history/put_sale_history`, data)
            .catch((err) => false);
    };
    const fetchUserInfo = useCallback(async (address) => {
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
    }, []);
    const saveMintHistory = (data) => {
        axios
            .post(`${backendBaseUrl}/api/nfts/register_nft`, data)
            .catch((err) => false);
    };
    const getNewestItem = useCallback(async () => {
        try {
            const { data } = await axios.get(
                `${backendBaseUrl}/api/nfts/get_new_nft`
            );
            return data;
        } catch (err) {
            return {};
        }
    }, []);
    const getHistoricalData = useCallback(async (skip = 0, limit = 10) => {
        try {
            const { data } = await axios.get(
                `${backendBaseUrl}/api/sale_history/get_historical_data`,
                {
                    params: {
                        skip,
                        limit,
                    },
                }
            );
            return data;
        } catch (err) {
            return [];
        }
    }, []);
    return {
        saveSaleHistory,
        fetchUserInfo,
        saveMintHistory,
        getNewestItem,
        getHistoricalData,
    };
}

export default useAxios;
