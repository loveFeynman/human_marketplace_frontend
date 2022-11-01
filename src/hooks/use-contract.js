import { useCallback } from "react";
import { toast } from "react-toastify";
import btoa from "btoa";
import { useWallet } from "@noahsaso/cosmodal";
import {
    CosmWasmClient,
    SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { coins } from "@cosmjs/proto-signing";
import { ChainConfig, MarketplaceContract } from "@constant";
import { toMicroAmount } from "@utils/coins";
import { useAppSelector } from "@app/hooks";
// import useAxios from "./use-axios";
import useRefresh from "./use-refresh";
// import { CustomWalletContext } from "@context";

const getQueryClient = async (config) => {
    const { rpcEndpoint } = config;
    const client = await CosmWasmClient.connect(rpcEndpoint);
    return client;
};

function useContract() {
    const { offlineSigner, signingCosmWasmClient, address } = useWallet(
        ChainConfig.chainId
    );
    const { refresh } = useRefresh();
    // const { connectedWallet, offlineSigner, signingClient } =
    //     useContext(CustomWalletContext);
    const collections = useAppSelector((state) => state.collections);
    const runQuery = useCallback(
        async (contractAddress, queryMsg) => {
            try {
                if (signingCosmWasmClient) {
                    const result =
                        await signingCosmWasmClient.queryContractSmart(
                            contractAddress,
                            queryMsg
                        );
                    return result;
                }
                const client = await getQueryClient(ChainConfig);
                if (client) {
                    const result = await client.queryContractSmart(
                        contractAddress,
                        queryMsg
                    );
                    return result;
                }
                return null;
            } catch (e) {
                return null;
            }
        },
        [signingCosmWasmClient]
    );

    const runExecute = useCallback(
        async (contractAddress, executeMsg, option) => {
            if (!offlineSigner) {
                throw new Error("No account selected");
            }

            const executeMemo = option?.memo || "";
            const executeFunds = option?.funds || "";
            const executeDenom = option?.denom || "";

            const cwClient = await SigningCosmWasmClient.connectWithSigner(
                ChainConfig.rpcEndpoint,
                offlineSigner,
                {
                    gasPrice: GasPrice.fromString(
                        `${ChainConfig.gasPrice}${ChainConfig.microDenom}`
                    ),
                }
            );
            const coinAmount = executeFunds
                ? toMicroAmount(executeFunds, ChainConfig.coinDecimals)
                : undefined;
            return cwClient.execute(
                // connectedWallet.address,
                address,
                contractAddress,
                executeMsg,
                "auto",
                executeMemo,
                executeFunds
                    ? coins(coinAmount, executeDenom || ChainConfig.microDenom)
                    : undefined
            );
        },
        [address, offlineSigner]
    );

    const sellNft = useCallback(
        async (item, nftPrice, extraOption) => {
            const targetCollection = collections[item.token_address];
            const regExp = /^(\d+(\.\d+)?)$/;
            const price = +nftPrice;
            if (!targetCollection) {
                toast.error("Collection not found!");
                throw new Error();
            }
            if (!price) {
                toast.error("Please input price!");
                throw new Error();
            }
            if (!(price > 0 && regExp.test(nftPrice))) {
                toast.error("Invalid Price!");
                throw new Error();
            }
            if (!extraOption?.expire || extraOption.expire <= 0) {
                toast.error("Invalid Expire Date!");
                throw new Error();
            }
            const marketplaceContract = MarketplaceContract;
            const message = {
                send_nft: {
                    contract: marketplaceContract,
                    token_id: item.token_id,
                    msg: btoa(
                        JSON.stringify({
                            // list_price: {
                            //     denom: ChainConfig.microDenom,
                            //     amount: `${price * 1e6}`,
                            // },
                            // image_url: item.image_url,
                            sale_type: extraOption?.isAuction
                                ? "auction"
                                : "fixed_price",
                            collection: item.token_address,
                            token_id: item.token_id,
                            price: {
                                denom: ChainConfig.microDenom,
                                amount: `${price * 1e6}`,
                            },
                            funds_recipient: address,
                            expires: Math.ceil(extraOption.expire),
                        })
                    ),
                },
            };
            try {
                await runExecute(item.token_address, message);
                toast.success("Success!");
                refresh();
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
                toast.error("Fail!");
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [address, collections, runExecute]
    );

    const withdrawNft = useCallback(
        async (item) => {
            // const expiresAt = item.expires_at
            //     ? new Date(item.expires_at)
            //     : null;
            // if (expiresAt && Number(new Date()) - Number(expiresAt) < 0) {
            //     toast.error("You can't withdraw before expire date.");
            //     throw new Error();
            // }
            // const message = {
            //     withdraw_nft: {
            //         offering_id: `${item.offering_id}`,
            //         address: item.token_address,
            //     },
            // };
            const message = {
                remove_ask: {
                    collection: item.token_address,
                    token_id: item.token_id,
                },
            };
            try {
                await runExecute(MarketplaceContract, message);
                toast.success("Success!");
                refresh();
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("withdraw error", item, message, err);
                toast.error("Fail!");
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [runExecute]
    );

    const setBid = useCallback(
        async (item, price) => {
            const expiresAt = item.expires_at
                ? new Date(item.expires_at)
                : null;
            if (expiresAt && Number(new Date()) - Number(expiresAt) > 0) {
                toast.error("You can't bid after expire date.");
                throw new Error();
            }
            const regExp = /^(\d+(\.\d+)?)$/;
            if (!regExp.test(price?.amount)) {
                toast.error("Invalid Price!");
                throw new Error();
            }
            let crrBid = Number(item.bids?.max_bid);
            crrBid = Number.isNaN(crrBid) ? 0 : crrBid;
            let newBid = Number(price.amount);
            newBid = Number.isNaN(newBid) ? 0 : newBid * 1e6;
            if (newBid <= crrBid) {
                toast.error("Your bid should be greater than existing bid!");
                throw new Error();
            }

            const message = {
                set_bid: {
                    collection: item.token_address,
                    token_id: item.token_id,
                },
            };
            try {
                await runExecute(MarketplaceContract, message, {
                    funds: `${price.amount}`,
                    denom: price.denom,
                });

                toast.success("Success!");
                refresh();
            } catch (err) {
                const errMsg = err.message;
                // eslint-disable-next-line no-console
                console.error(err, errMsg, typeof errMsg);
                toast.error(
                    `Transaction failed. Please check your inputs and try it again.`
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [runExecute]
    );

    const buyNft = useCallback(
        async (item) => {
            const price = item?.price || {};

            // const message = {
            //     buy: {
            //         offering_id: `${item.offering_id}`,
            //         address: item.token_address,
            //     },
            // };
            try {
                // await runExecute(MarketplaceContract, message, {
                //     funds: `${price.amount / 1e6}`,
                //     denom: price.denom,
                // });
                await setBid(item, { ...price, amount: price.amount / 1e6 });
                refresh();
                // toast.success("Success!");
            } catch (err) {
                const errMsg = err.message;
                // eslint-disable-next-line no-console
                console.error(err, errMsg, typeof errMsg);
                toast.error(`Fail! ${errMsg}`);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setBid]
    );

    const acceptBid = useCallback(
        async (item) => {
            const expiresAt = item.expires_at
                ? new Date(item.expires_at)
                : null;
            if (expiresAt && Number(new Date()) - Number(expiresAt) < 0) {
                toast.error("Auction is not ended yet.");
                throw new Error();
            }
            const message = {
                accept_bid: {
                    collection: item.token_address,
                    token_id: item.token_id,
                },
            };
            try {
                await runExecute(MarketplaceContract, message);
                toast.success("Success!");
            } catch (err) {
                const errMsg = err.message;
                // eslint-disable-next-line no-console
                console.error(err, errMsg, typeof errMsg);
                toast.error(`Fail! ${errMsg}`);
            }
        },
        [runExecute]
    );

    const getCollectionInfo = useCallback(
        async (collectionAddress) => {
            const data = await runQuery(collectionAddress, {
                get_collection_state: {},
            });
            return data;
        },
        [runQuery]
    );
    return {
        runQuery,
        runExecute,
        sellNft,
        withdrawNft,
        buyNft,
        setBid,
        acceptBid,
        getCollectionInfo,
    };
}

export default useContract;
