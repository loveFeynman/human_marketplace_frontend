import axios from "axios";
import { backendBaseUrl, subQueryUrl } from "@constant";
import { useCallback } from "react";

function useAxios() {
    const fetchAllUsers = useCallback(async () => {
        try {
            const users = await axios.get(
                `${backendBaseUrl}/api/get_all_users`
            );
            return users.data;
        } catch (err) {
            return [];
        }
    });
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
    const getNewestItem = useCallback(async () => {
        try {
            // const { data } = await axios.get(
            //     `${backendBaseUrl}/api/nfts/get_new_nft`
            // );
            const query = `query {
                mintEvents(filter: {random: {equalTo: 0}} orderBy: TIME_DESC, first: 5) {
                    nodes {
                    minter
                    owner
                    time
                    tokenId
                    collection
                    }
                }
            }
            `;
            const {
                data: {
                    data: {
                        mintEvents: { nodes },
                    },
                },
            } = await axios.post(subQueryUrl, { query });
            return nodes;
        } catch (err) {
            return [];
        }
    }, []);
    const getCreatedNfts = useCallback(async (owner) => {
        try {
            const query = `query {
                mintEvents(orderBy: TIME_DESC, filter: {owner: {equalTo: "${owner}"}}) {
                nodes {
                  minter
                  owner
                  time
                  tokenId
                  collection
                  random
                }
              }
            }`;

            const {
                data: {
                    data: {
                        mintEvents: { nodes },
                    },
                },
            } = await axios.post(subQueryUrl, { query });
            return nodes;
        } catch (err) {}
    });
    const getHistoricalData = useCallback(async (skip = 0, limit = 10) => {
        try {
            const query = `query {
                executeSellingEvents(orderBy: BLOCK_HEIGHT_DESC, first: ${limit}, offset: ${skip} ) {
                  nodes {
                    action
                    collection
                    tokenId
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

            return nodes;
        } catch (err) {
            console.log("axiosError: ", err);
            return [];
        }
    }, []);
    const fetchFollowInfo = useCallback(async (address) => {
        try {
            const { data } = await axios.get(
                `${backendBaseUrl}/api/follow/get_follow_info`,
                {
                    params: {
                        address,
                    },
                }
            );
            return data;
        } catch (err) {
            return {};
        }
    }, []);
    const handleFollow = useCallback(async (from, to) => {
        try {
            await axios.post(`${backendBaseUrl}/api/follow/register_follow`, {
                from,
                to,
            });
            return true;
        } catch (err) {
            return false;
        }
    });
    return {
        fetchAllUsers,
        fetchUserInfo,
        getNewestItem,
        getHistoricalData,
        fetchFollowInfo,
        handleFollow,
        getCreatedNfts,
    };
}

export default useAxios;
