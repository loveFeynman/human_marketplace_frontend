import { useState, useEffect } from "react";
import axios from "axios";
import { backendBaseUrl, subQueryUrl } from "@constant";
import { getReducedAddress } from "@utils/index";
import { getImageFromHash } from "@utils/ipfs";

export const UseHistory = (token_id, collection_address) => {
    const [history, setHistory] = useState([]);
    useEffect(() => {
        (async () => {
            // const { data } = await axios.get(
            //     `${backendBaseUrl}/api/sale_history/get_sale_history`,
            //     {
            //         params: {
            //             token_id,
            //         },
            //     }
            // );
            const query = `query {
                executeSellingEvents(filter: {tokenId: {equalTo: "${token_id}"}, collection: {equalTo: "${collection_address}" }}, orderBy: BLOCK_HEIGHT_DESC) {
                    nodes {
                        action
                        price
                        time
                        seller
                        buyer
                    }
                  }
            }`;
            const {
                data: {
                    data: {
                        executeSellingEvents: { nodes },
                    },
                },
            } = await axios.post(subQueryUrl, { query });
            const avatars = await Promise.all(
                nodes.map(async (element) => {
                    try {
                        const userInfo = await axios.get(
                            `${backendBaseUrl}/api/get_user_info`,
                            {
                                params: {
                                    wallet: element.buyer,
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
                nodes.map((_data, index) => {
                    _data.logo = avatars[index].logo
                        ? getImageFromHash(avatars[index].logo)
                        : "/images/client/client-2.png";
                    _data.name =
                        avatars[index].first_name ||
                        getReducedAddress(_data.buyer);
                    _data.slug = `/profile/${_data.buyer}`;
                    return _data;
                })
            );
        })();
    }, [token_id]);
    return history;
};
