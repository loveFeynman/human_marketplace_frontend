import PropTypes from "prop-types";
import clsx from "clsx";
import { useState, useEffect } from "react";
import SectionTitle from "@components/section-title/layout-01";
import { SectionTitleType, ProductType } from "@utils/types";
import { useContract } from "@hooks";
import NftItem from "@components/nft-item";
import { MarketplaceContract } from "@constant";
import { useAppSelector } from "@app/hooks";
import NftItemSkeleton from "@components/nft-item/skeleton";

const LiveExploreArea = ({ className, space }) => {
    const [displayNfts, setDisplayNfts] = useState(null);
    const { runQuery } = useContract();
    const collections = useAppSelector((state) => state.collections);
    useEffect(() => {
        (async () => {
            const contractData = await runQuery(MarketplaceContract, {
                asks_sorted_by_expiration: {
                    limit: 10,
                },
            });
            const dispData =
                contractData &&
                contractData.asks.map((_contractData) => ({
                    bids: {
                        max_bid: _contractData.max_bid,
                        max_bidder: _contractData.max_bidder,
                    },
                    token_address: _contractData.collection,
                    collection:
                        collections[_contractData.collection]?.collection_info
                            ?.title,
                    expires_at: Number(_contractData.expires_at.slice(0, 13)),
                    funds_recipient: _contractData.funds_recipient,
                    image_url: _contractData.img_url,
                    // image_url: "/image",
                    seller: _contractData.seller,
                    price: {
                        denom: "uheart",
                        amount: Number(_contractData.price),
                    },
                    sale_type: _contractData.sale_type,
                    token_id: _contractData.token_id,
                    token_url: _contractData.img_url,
                    // image_url: "/image",
                }));
            setDisplayNfts(dispData || []);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div
            className={clsx(
                "rn-live-bidding-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row mb--50">
                    <div className="col-lg-12">
                        <SectionTitle title="Live Bidding" />
                    </div>
                </div>
                <div className="row g-5">
                    {!displayNfts &&
                        [...new Array(5)].map((item, index) => (
                            <div
                                className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                            >
                                <NftItemSkeleton />
                            </div>
                        ))}
                    {displayNfts &&
                        displayNfts.slice(0, 5).map((prod) => (
                            <div
                                key={prod.id || prod.token_id}
                                // data-sal="slide-up"
                                // data-sal-delay="150"
                                // data-sal-duration="800"
                                className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                            >
                                <NftItem overlay item={prod} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

LiveExploreArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1, 2]),
    data: PropTypes.shape({
        section_title: SectionTitleType,
        products: PropTypes.arrayOf(ProductType).isRequired,
        placeBid: PropTypes.bool,
    }),
};

LiveExploreArea.defaultProps = {
    space: 1,
};

export default LiveExploreArea;
