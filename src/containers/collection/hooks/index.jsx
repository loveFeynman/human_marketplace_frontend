/* eslint-disable */
import { useState, useEffect } from "react";
import axios from "axios";
import { backendBaseUrl, subQueryUrl } from "@constant";
import { useContract } from "@hooks";

export const GetTopCollections = () => {
    const { runQuery } = useContract();
    const [collections, setCollections] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                // const { data } = await axios.get(
                //     `${backendBaseUrl}/api/sale_history/top_collection`
                // );
                // const query = JSON.stringify({
                //     query: `query {
                //         collectionEvents(orderBy: AMOUNT_DESC, first:4) {
                //         nodes {
                //             id
                //             amount
                //         }
                //         }
                //     }`,
                //     variables: {},
                // });
                const query = `query {
                            collectionEvents(orderBy: AMOUNT_DESC, first:4) {
                            nodes {
                                id
                                amount
                            }
                            }
                        }`;
                const {
                    data: {
                        data: {
                            collectionEvents: { nodes },
                        },
                    },
                } = await axios.post(subQueryUrl, {
                    query,
                });
                const _collections = await Promise.all(
                    nodes.map(async (_data) => {
                        try {
                            const collectionState = await runQuery(_data.id, {
                                get_collection_state: {},
                            });
                            const totalItem = Number.isNaN(
                                Number(collectionState.mint_info?.total_supply)
                            )
                                ? 0
                                : Number(
                                      collectionState.mint_info?.total_supply
                                  );
                            return {
                                title:
                                    collectionState.collection_info.title || "",
                                id: _data.id,
                                // slug: `/marketplace?nftAddress=${_data.collection}`,
                                slug: `/explore/collections/${_data.collection}`,
                                total_item: totalItem,
                                tradingVolume: _data.amount,
                                image: {
                                    src:
                                        collectionState.collection_info
                                            ?.background_url ||
                                        "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_301.png",
                                    // src: "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_301.png",
                                },
                                thumbnails: [
                                    {
                                        src: "/images/collection/collection-sm-01.jpg",
                                    },
                                    {
                                        src: "/images/collection/collection-sm-02.jpg",
                                    },
                                    {
                                        src: "/images/collection/collection-sm-03.jpg",
                                    },
                                ],
                                profile_image: {
                                    src:
                                        collectionState.collection_info
                                            ?.logo_url ||
                                        "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_303.png",
                                    // src: "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_303.png",
                                },
                            };
                        } catch (err) {
                            return {
                                title: "",
                                id: _data.collection,
                                // slug: `/marketplace?nftAddress=${_data.collection}`,
                                slug: `/explore/collections/${_data.collection}`,
                                total_item: 0,
                                image: {
                                    src: "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_301.png",
                                    // src: "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_301.png",
                                },
                                thumbnails: [
                                    {
                                        src: "/images/collection/collection-sm-01.jpg",
                                    },
                                    {
                                        src: "/images/collection/collection-sm-02.jpg",
                                    },
                                    {
                                        src: "/images/collection/collection-sm-03.jpg",
                                    },
                                ],
                                profile_image: {
                                    src: "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_303.png",
                                    // src: "https://secretsteampunks.mypinata.cloud/ipfs/QmZH3FPdSeJo17MNX7poDN8aTuNcKCC4qfaADhRJLCS1aj/SteamPunk_Robot_303.png",
                                },
                            };
                        }
                    })
                );
                setCollections(_collections);
            } catch (err) {
                console.log("err: ", err);
            }
        })();
    }, [runQuery]);
    return collections;
};
