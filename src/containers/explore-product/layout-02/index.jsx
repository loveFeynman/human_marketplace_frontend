import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { motion } from "framer-motion";
import SectionTitle from "@components/section-title/layout-02";
import FilterButtons from "@components/filter-buttons";
import NftItem from "@components/nft-item";
// import { flatDeep } from "@utils/methods";
import { SectionTitleType, ProductType } from "@utils/types";
import { useAppSelector } from "@app/hooks";
import { useContract } from "@hooks";
import { MarketplaceContract, ChainConfig } from "@constant";

const ExploreProductArea = ({ className, space, data }) => {
    const filters = [
        "ai nft",
        "language processing",
        "syntetic media",
        "lowest",
        "highest",
    ];
    const { runQuery } = useContract();
    const [products, setProducts] = useState([]);
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const collections = useAppSelector((state) => state.collections);
    // console.log("marketplace: ", marketplaceNfts);
    useEffect(() => {
        let marketNfts = [];
        console.log("here");
        Object.keys(marketplaceNfts || {}).forEach((key) => {
            const crrNfts = marketplaceNfts[key];
            marketNfts = [...marketNfts, ...crrNfts];
        });
        setProducts(marketNfts);
    }, []);
    console.log("marketNfts: ", products, marketplaceNfts);
    const getDataForShow = (item) => {
        const collection = collections[item.collection];
        const tokenIdNumber = item.token_id.split(".").pop();
        const _data = {
            token_address: item.collection,
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
            expires_at: Math.floor(Number(item.expires_at) / 1000000),
            funds_recipient: item.funds_recipient,
            bids: {
                max_bid: item.max_bid,
                max_bidder: item.max_bidder,
            },
        };
        return _data;
    };
    const filterHandler = async (filterKey) => {
        console.log("filterKey: ", filterKey);
        switch (filterKey) {
            case "all": {
                let marketNfts = [];
                Object.keys(marketplaceNfts || {}).forEach((key) => {
                    const crrNfts = marketplaceNfts[key];
                    marketNfts = [...marketNfts, ...crrNfts];
                });
                setProducts(marketNfts);
                break;
            }
            case "ai nft": {
                const queryData = await runQuery(MarketplaceContract, {
                    asks_sorted_by_content_type: {
                        content_type: "ai_nft",
                        limit: 20,
                    },
                });

                let marketNfts = queryData.asks.map((item) => {
                    return getDataForShow(item);
                });
                setProducts(marketNfts);
                break;
            }
            case "language processing": {
                const queryData = await runQuery(MarketplaceContract, {
                    asks_sorted_by_content_type: {
                        content_type: "language_processing",
                        limit: 20,
                    },
                });

                let marketNfts = queryData.asks.map((item) => {
                    return getDataForShow(item);
                });
                setProducts(marketNfts);
                break;
            }
            case "syntetic media": {
                const queryData = await runQuery(MarketplaceContract, {
                    asks_sorted_by_content_type: {
                        content_type: "syntetic_media",
                        limit: 20,
                    },
                });

                let marketNfts = queryData.asks.map((item) => {
                    return getDataForShow(item);
                });
                setProducts(marketNfts);
                break;
            }
            case "highest": {
                const queryData = await runQuery(MarketplaceContract, {
                    asks_sorted_by_bid_count: {
                        limit: 20,
                    },
                });

                let marketNfts = queryData.asks.map((item) => {
                    return getDataForShow(item);
                });
                setProducts(marketNfts);
                break;
            }
            case "lowest": {
                const queryData = await runQuery(MarketplaceContract, {
                    reverse_asks_sorted_by_bid_count: {
                        limit: 20,
                    },
                });

                let marketNfts = queryData.asks.map((item) => {
                    return getDataForShow(item);
                });
                setProducts(marketNfts);
                break;
            }
        }
        // const prods = data?.products ? [...data.products] : [];
        // if (filterKey === "all") {
        //     setProducts(data?.products);
        //     return;
        // }
        // const filterProds = prods.filter((prod) =>
        //     prod.categories.includes(filterKey)
        // );
        // setProducts(filterProds);
    };
    return (
        <div
            className={clsx(
                "rn-product-area masonary-wrapper-activation",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row align-items-center mb--60">
                    <div className="col-lg-4">
                        <SectionTitle
                            className="mb--0"
                            title="Explore Product"
                        />
                    </div>
                    <div className="col-lg-8">
                        <FilterButtons
                            buttons={filters}
                            filterHandler={filterHandler}
                        />
                    </div>
                </div>
                <div className="col-lg-12">
                    <motion.div layout className="isotope-list item-5">
                        {products?.slice(0, 10)?.map((prod, index) => (
                            <motion.div
                                key={index}
                                className={clsx("grid-item")}
                                layout
                            >
                                <NftItem overlay item={prod} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

ExploreProductArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1, 2]),
    data: PropTypes.shape({
        section_title: SectionTitleType,
        products: PropTypes.arrayOf(ProductType),
        placeBid: PropTypes.bool,
    }),
};

ExploreProductArea.defaultProps = {
    space: 1,
};

export default ExploreProductArea;
