import axios from "axios";
import { backendBaseUrl } from "@constant";
import { getReducedAddress } from "@utils/index";
import { getImageFromHash } from "@utils/ipfs";

export const getTopSellers = async (days) => {
    try {
        const { data } = await axios.get(
            `${backendBaseUrl}/api/sale_history/top_seller`,
            {
                params: {
                    days,
                },
            }
        );
        const avatars = await Promise.all(
            data.map(async (element) => {
                try {
                    const userInfo = await axios.get(
                        `${backendBaseUrl}/api/get_user_info`,
                        {
                            params: {
                                wallet: element.from_a,
                            },
                        }
                    );
                    return userInfo.data;
                } catch (err) {
                    return {};
                }
            })
        );
        return data.map((_data, index) => {
            _data.logo = avatars[index].logo
                ? getImageFromHash(avatars[index].logo)
                : "/images/client/client-2.png";
            _data.name =
                avatars[index].first_name || getReducedAddress(_data.from_a);
            return _data;
        });
    } catch (error) {
        return [];
    }
};
