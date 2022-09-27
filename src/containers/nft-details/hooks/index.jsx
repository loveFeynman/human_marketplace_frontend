import { useState, useEffect } from "react";
import axios from "axios";
import { backendBaseUrl } from "@constant";
import { getReducedAddress } from "@utils/index";
import { getImageFromHash } from "@utils/ipfs";

export const UseHistory = (token_id) => {
    const [history, setHistory] = useState([]);
    useEffect(() => {
        (async () => {
            const { data } = await axios.get(
                `${backendBaseUrl}/api/sale_history/get_sale_history`,
                {
                    params: {
                        token_id,
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
                                    wallet: element.to_a,
                                },
                            }
                        );
                        return userInfo.data;
                    } catch (err) {
                        return {};
                    }
                })
            );
            setHistory(
                data.map((_data, index) => {
                    _data.logo = avatars[index].logo
                        ? getImageFromHash(avatars[index].logo)
                        : "/images/client/client-2.png";
                    _data.name =
                        avatars[index].first_name ||
                        getReducedAddress(_data.from_a);
                    _data.slug = `/profile/${_data.to_a}`;
                    return _data;
                })
            );
        })();
    }, [token_id]);
    return history;
};
