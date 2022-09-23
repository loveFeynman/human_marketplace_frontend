import axios from "axios";
import { ChainConfig, arbitraryKey, backendBaseUrl } from "@constant";

export const getUserInfo = async (address) => {
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
        if (err.response.status === 404) {
            try {
                const hash = await window.keplr.signArbitrary(
                    ChainConfig.chainId,
                    address,
                    arbitraryKey
                );
                await axios.post(`${backendBaseUrl}/api/register_user_info`, {
                    hash: hash.signature,
                    wallet: address,
                });
                return {
                    wallet: address,
                    hash,
                };
            } catch (_err) {
                return false;
            }
        }
        return false;
    }
};
