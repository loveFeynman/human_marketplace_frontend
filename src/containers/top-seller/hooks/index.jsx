import axios from "axios";
import { backendBaseUrl, subQueryUrl } from "@constant";
import { getReducedAddress } from "@utils/index";
import { getImageFromHash } from "@utils/ipfs";

export const getTopSellers = async (days) => {
    try {
        // const { data } = await axios.get(
        //     `${backendBaseUrl}/api/sale_history/top_seller`,
        //     {
        //         params: {
        //             days,
        //         },
        //     }
        // );
        const query = `query {
            executeSellingEvents(filter: {time: {greaterThan: "${
                Number(days) * 24 * 3600
            }"} } ) {
              groupedAggregates ( groupBy: [SELLER] ) {
                keys
                sum {
                  price
                }
              }
              totalCount
            }
          }`;
        const {
            data: {
                data: {
                    executeSellingEvents: { groupedAggregates },
                },
            },
        } = await axios.post(subQueryUrl, { query });
        const avatars = await Promise.all(
            groupedAggregates.map(async (element) => {
                try {
                    const userInfo = await axios.get(
                        `${backendBaseUrl}/api/get_user_info`,
                        {
                            params: {
                                wallet: element.keys[0],
                            },
                        }
                    );
                    return userInfo.data;
                } catch (err) {
                    return {};
                }
            })
        );
        return groupedAggregates.map((_data, index) => {
            _data.logo = avatars[index].logo
                ? getImageFromHash(avatars[index].logo)
                : "/images/client/client-2.png";
            _data.name =
                avatars[index].first_name || getReducedAddress(_data.from_a);
            return _data;
        });
        // return [];
    } catch (error) {
        return [];
    }
};
