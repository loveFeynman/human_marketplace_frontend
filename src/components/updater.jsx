import { useCallback, useEffect } from "react";
import { useWallet } from "@noahsaso/cosmodal";

import { useRefresh, useContract, useAxios } from "@hooks";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
    setCollectionAddresses,
    setCollectionInfo,
} from "@app/collectionsSlice";
import {
    ChainConfig,
    CollectionCreatorContract,
    MarketplaceContract,
} from "@constant";
import { setMarketplaceNfts } from "@app/marketplaceNftsSlice";
// import { CustomWalletContext } from "@context";
import { setBalance } from "@app/balanceSlice";
import { clearMyNfs, setMyNfts } from "@app/myNftsSlice";
import { setIsAdmin } from "@app/adminSlice";
import { setUsers } from "@app/usersSlice";

const MAX_ITEMS = 10;

const Updater = () => {
    const { normal } = useRefresh();
    const { runQuery } = useContract();
    // const { connectedWallet, signingClient } = useContext(CustomWalletContext);
    const { signingCosmWasmClient, address } = useWallet(ChainConfig.chainId);
    const dispatch = useAppDispatch();
    const collections = useAppSelector((state) => state.collections);
    const { fetchAllUsers } = useAxios();

    useEffect(() => {
        (async () => {
            if (address) {
                const stateInfo = await runQuery(CollectionCreatorContract, {
                    get_state_info: {},
                });
                dispatch(setIsAdmin(address === stateInfo?.admin));
            } else {
                dispatch(setIsAdmin(false));
            }
        })();
    }, [address, dispatch, runQuery]);

    const fetchMarketplaceNfts = useCallback(async () => {
        Object.keys(collections).forEach(async (key) => {
            const result = [];
            const fetchNfts = async (startId) => {
                const queryResult = await runQuery(MarketplaceContract, {
                    asks: {
                        collection: key,
                        include_inactive: true,
                        start_after: startId,
                        limit: MAX_ITEMS,
                    },
                });
                const fetchedNfts = queryResult?.asks;
                if (fetchedNfts?.length) {
                    fetchedNfts.forEach((item) => {
                        const nftAddress = item.collection;
                        const collection = collections[nftAddress];
                        const tokenIdNumber = item.token_id.split(".").pop();
                        result.push({
                            token_address: nftAddress,
                            token_id: item.token_id,
                            collection: collection.collection_info?.title,
                            image_url:
                                item.img_url ||
                                `https://secretsteampunks.mypinata.cloud/ipfs/QmdkjgT5CYivvFkvSvUdFF7b4QaeBikBaAbfthTVgD8FdP/SteamPunk_Human_${tokenIdNumber}.png`,
                            token_url: `${collection.mint_info?.base_token_uri}${tokenIdNumber}.png`,
                            seller: item.seller,
                            price: {
                                denom: ChainConfig.microDenom,
                                amount: Number(item.price) || 0,
                            },
                            sale_type: item.sale_type,
                            expires_at: Math.floor(
                                Number(item.expires_at) / 1000000
                            ),
                            funds_recipient: item.funds_recipient,
                            bids: {
                                max_bid: item.max_bid,
                                max_bidder: item.max_bidder,
                            },
                        });
                    });
                    if (fetchedNfts.length === MAX_ITEMS) {
                        await fetchNfts(fetchedNfts[MAX_ITEMS - 1].token_id);
                    }
                }
            };
            await fetchNfts();

            dispatch(setMarketplaceNfts([key, result]));
            // const queries = [];
            // const contractAddress = [];
            // const collection = collections[key];
            // const collectionInfo = await runQuery(MarketplaceContract, {
            //     get_collection_info: {
            //         address: key,
            //     },
            // });
            // for (
            //     let i = 0;
            //     i < Math.ceil((collectionInfo?.num_offerings || 0) / MAX_ITEMS);
            //     i++
            // ) {
            //     queries.push(
            //         runQuery(MarketplaceContract, {
            //             get_offers: {
            //                 page_num: i + 1,
            //                 page_count: MAX_ITEMS,
            //                 address: key,
            //             },
            //         })
            //     );
            //     contractAddress.push(key);
            // }
            // await Promise.all(queries).then((queryResults) => {
            //     queryResults.forEach((queryResult, index) => {
            //         const nftList = queryResult.map((item) => {
            //             const nftAddress = item.contract;
            //             const collection = collections[nftAddress];
            //             const tokenIdNumber = item.token_id.split(".").pop();
            //             const listPrice = item.list_price || {};
            //             return {
            //                 token_address: nftAddress,
            //                 token_id: item.token_id,
            //                 collection: collection.collection_info?.title,
            //                 image_url: item.image_url,
            //                 token_url: `${collection.mint_info?.base_token_uri}
            // ${tokenIdNumber}.png`,
            //                 seller: item.seller,
            //                 price: {
            //                     denom: listPrice.denom,
            //                     amount: Number(listPrice.amount) || 0,
            //                 },
            //                 offering_id: item.id,
            //             };
            //         });
            //         dispatch(
            //             setMarketplaceNfts([contractAddress[index], nftList])
            //         );
            //     });
            // });
        });
    }, [collections, dispatch, runQuery]);

    const fetchMyNfts = useCallback(async () => {
        if (!address) {
            dispatch(clearMyNfs());
            return;
        }
        Object.keys(collections).forEach(async (key) => {
            const collection = collections[key];
            const queryResult = await runQuery(key, {
                tokens: {
                    owner: address,
                    start_after: undefined,
                    limit: 100,
                },
            });
            const nftList =
                queryResult?.tokens?.map((item) => {
                    const newItem = {
                        token_address: key,
                        token_id: item.token_id,
                        collection: collection.collection_info?.title || "",
                        image_url: item.nft_info?.extension?.image_url,
                        token_url: item.nft_info?.token_uri,
                        owner: address,
                    };
                    return newItem;
                }) || [];
            dispatch(setMyNfts([key, nftList]));
        });
    }, [address, collections, dispatch, runQuery]);

    const fetchCollectionInfo = useCallback(async () => {
        const collectionCreatorStateInfo = await runQuery(
            CollectionCreatorContract,
            {
                get_state_info: {},
            }
        );
        const queries = [];
        for (
            let i = 0;
            i <
            Math.ceil(
                (collectionCreatorStateInfo?.collection_count || 0) / MAX_ITEMS
            );
            i++
        ) {
            const ids = [];
            for (let j = 0; j < MAX_ITEMS; j++) {
                ids.push(`${MAX_ITEMS * i + j + 1}`);
            }
            queries.push(
                runQuery(CollectionCreatorContract, {
                    get_collections: {
                        id: ids,
                    },
                })
            );
        }
        Promise.all(queries).then((queryResults) => {
            const randomMints = [];
            const userDefinedMints = [];
            queryResults.forEach((result) => {
                result?.forEach((collection) => {
                    if (collection.is_rand) {
                        randomMints.push(collection);
                    } else {
                        userDefinedMints.push(collection);
                    }
                });
            });
            dispatch(
                setCollectionAddresses({
                    random: randomMints,
                    userDefined: userDefinedMints,
                })
            );

            randomMints.forEach(async (collection) => {
                const nftAddress = collection.address;
                try {
                    const collectionInfo = await runQuery(nftAddress, {
                        get_collection_state: {},
                    });
                    dispatch(
                        setCollectionInfo([
                            nftAddress,
                            { ...collectionInfo, nftAddress },
                        ])
                    );
                } catch (e) {
                    // console.error(nftAddress, e)
                }
            });
            userDefinedMints.forEach(async (collection) => {
                const nftAddress = collection.address;
                try {
                    const collectionInfo = await runQuery(nftAddress, {
                        get_collection_state: {},
                    });
                    dispatch(
                        setCollectionInfo([
                            nftAddress,
                            {
                                ...collectionInfo,
                                nftAddress,
                                userDefined: true,
                            },
                        ])
                    );
                } catch (e) {
                    // console.error(nftAddress, e)
                }
            });
        });
    }, [dispatch, runQuery]);

    const fetchBalance = useCallback(async () => {
        if (!signingCosmWasmClient) return;
        const balance = await signingCosmWasmClient.getBalance(
            // connectedWallet.address,
            address,
            ChainConfig.microDenom
        );
        dispatch(
            setBalance({
                denom: balance.denom,
                amount: Number.isNaN(balance.amount)
                    ? 0
                    : Number(balance.amount) / 1e6,
            })
        );
    }, [address, dispatch, signingCosmWasmClient]);

    useEffect(() => {
        fetchMarketplaceNfts();
        fetchCollectionInfo();
        fetchBalance();
        fetchMyNfts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [normal]);

    useEffect(() => {
        dispatch(clearMyNfs());
        fetchMyNfts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    useEffect(() => {
        (async () => {
            const fetchedUsers = await fetchAllUsers();
            dispatch(setUsers(fetchedUsers || []));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default Updater;
