import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import Breadcrumb from "@components/breadcrumb";
import ProductDetailsArea from "@containers/nft-details";
import ProductArea from "@containers/nft-details-area";
import usePickNft from "src/hooks/use-pick-nft";
import { useContract, useAxios, useRefresh } from "@hooks";
import { ChainConfig, MarketplaceContract } from "@constant";
import { getReducedAddress } from "@utils/index";
import { useAppSelector } from "@app/hooks";
import { useWalletManager } from "@noahsaso/cosmodal";
// demo data

const LIMIT_BIDS = 20;

const NftDetail = () => {
    const { asPath } = useRouter();
    // eslint-disable-next-line max-len
    // const { token_id, collection } = router.query;   //  this line doesn't work when the token_id contains the specail chars.
    const { token_id, collection } = useMemo(() => {
        let targetPath = asPath.split("/");
        targetPath = targetPath[targetPath.length - 1];
        const params = targetPath.split("?");
        return {
            token_id: params[0],
            collection: params[1].split("=")[1],
        };
    }, [asPath]);
    const { runQuery } = useContract();
    const { nftInfo: selectedNft } = usePickNft(token_id, collection) || {};
    const collections = useAppSelector((state) => state.collections);
    const myNfts = useAppSelector((state) => state.myNfts);
    const totalMarketplaceNfts = useAppSelector(
        (state) => state.marketplaceNfts
    );
    const [bids, setBids] = useState([]);
    const [recentView, setRecentView] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const { fetchUserInfo, registerRecentView, fetchRecentView } = useAxios();
    const { connectedWallet } = useWalletManager();
    const { second: value } = useRefresh();
    const fetchBids = async (startBidder) => {
        const msg = {
            bids: {
                collection: selectedNft.token_address,
                token_id: selectedNft.token_id,
                start_after: startBidder,
                limit: LIMIT_BIDS,
            },
        };
        const queryResults = await runQuery(MarketplaceContract, msg);
        const fetchedBids = queryResults?.bids || [];
        const bidersInfo = await Promise.all(
            fetchedBids.map(async (bid) => {
                const info = await fetchUserInfo(bid.bidder);
                return info;
            })
        );
        setBids(
            fetchedBids.map((bid, index) => {
                const _bids = {
                    price: Number(bid.price) / 1e6,
                    name:
                        bidersInfo[index].first_name ||
                        getReducedAddress(bid.bidder),
                    logo: bidersInfo[index].logo,
                    bidder: bid.bidder,
                    slug: `/profile/${bid.bidder}`,
                    time: bid?.time?.slice(0, 13),
                };
                return _bids;
            })
        );
        // setBids((prev) =>
        //     prev.concat(
        //         fetchedBids.map((bid) => ({
        //             ...bid,
        //             price: Number(bid.price) / 1e6,
        //         }))
        //     )
        // );
        if (fetchedBids.length === LIMIT_BIDS) {
            fetchBids(fetchedBids[fetchedBids.length - 1].bidder);
        }
    };

    useEffect(() => {
        if (connectedWallet?.address) {
            registerRecentView({
                tokenId: token_id,
                collection,
                address: connectedWallet.address,
            });
            (async () => {
                const data = await fetchRecentView(connectedWallet.address);
                const result = [];
                (data || []).forEach(async (viewItem) => {
                    const existingNftInfo = (
                        totalMarketplaceNfts[viewItem.collection] || []
                    )
                        .concat(myNfts[viewItem.collection] || [])
                        .filter((item) => item.token_id === viewItem.token_id);
                    if (existingNftInfo.length) {
                        result.push(existingNftInfo[0]);
                    } else {
                        const nftData = await runQuery(viewItem.collection, {
                            all_nft_info: {
                                token_id: viewItem.token_id,
                            },
                        });
                        result.push({
                            image_url: nftData?.info.extension.image_url,
                            token_address: viewItem.collection,
                            token_id: viewItem.token_id,
                            token_url: nftData?.info.token_uri,
                            collection:
                                collections[viewItem.collection]
                                    ?.collection_info?.title || "",
                            owner: nftData?.access.owner,
                            creator: nftData?.info.extension.minter,
                            created_at: nftData?.info.created_time,
                        });
                    }
                });
                setRecentView(result);
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token_id, collection, connectedWallet?.address]);

    useEffect(() => {
        fetchBids();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        runQuery,
        selectedNft.token_address,
        selectedNft.token_id,
        refresh,
        value,
    ]);

    const refreshData = async () => {
        setRefresh((prev) => prev + 1);
    };

    const nftTitle = selectedNft.token_id || "NFT Detail";

    useEffect(() => {
        const getDataForShow = (item) => {
            const collectionInfo = collections[item.collection] || {};
            const tokenIdNumber = item.token_id.split(".").pop();
            const _data = {
                token_address: item.collection,
                token_id: item.token_id,
                collection: collectionInfo.collection_info?.title,
                image_url:
                    item.img_url ||
                    `https://secretsteampunks.mypinata.cloud/ipfs/QmdkjgT5CYivvFkvSvUdFF7b4QaeBikBaAbfthTVgD8FdP/SteamPunk_Human_${tokenIdNumber}.png`,
                token_url: `${collectionInfo.mint_info?.base_token_uri}${tokenIdNumber}.png`,
                seller: item.seller,
                price: {
                    denom: ChainConfig.microDenom,
                    amount: Number(item.price) || 0,
                },
                sale_type: item.sale_type,
                expires_at: Math.floor(Number(item.expires_at) / 1000000),
                funds_recipient: item.funds_recipient,
                bids: {
                    max_bid: item.max_bid,
                    max_bidder: item.max_bidder,
                },
            };
            return _data;
        };
        (async () => {
            const result = (totalMarketplaceNfts[collection] || []).concat(
                myNfts[collection] || []
            );
            const existingTokenIds = result.map((item) => item.token_id);
            const crrContentType = selectedNft.content_type || "";
            if (crrContentType) {
                const queryData = await runQuery(MarketplaceContract, {
                    asks_sorted_by_content_type: {
                        content_type: "language_processing",
                        limit: 5,
                    },
                });
                queryData?.asks?.forEach((item) => {
                    if (!existingTokenIds.includes(item.token_id)) {
                        result.push(getDataForShow(item));
                    }
                });
            }
            setRelatedProducts(result);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalMarketplaceNfts, collection, selectedNft, refresh]);

    return (
        <Wrapper>
            <SEO pageTitle={nftTitle} />
            <Header />
            <main id="main-content">
                <Breadcrumb pageTitle={nftTitle} currentPage={nftTitle} />
                <ProductDetailsArea
                    product={selectedNft || {}}
                    bids={bids}
                    refreshData={refreshData}
                />
                {/* <ProductArea
                    data={{
                        section_title: { title: "Recent View" },
                        products: recentViewProducts,
                    }}
                /> */}
                <ProductArea
                    data={{
                        section_title: { title: "Related Item" },
                        products: (relatedProducts || [])
                            .filter((item) => item.token_id !== token_id)
                            .slice(0, 5),
                    }}
                />
                {connectedWallet?.address && (
                    <ProductArea
                        data={{
                            section_title: { title: "Recent View" },
                            products: recentView,
                        }}
                    />
                )}
            </main>
            <Footer />
        </Wrapper>
    );
};

export default NftDetail;
