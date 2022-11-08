import PropTypes from "prop-types";
import { useState, useEffect } from "react";
// import Image from "next/image";
import Button from "@ui/button";
import { useWalletManager } from "@noahsaso/cosmodal";
import { checkKeplr } from "src/context/WalletProvider";
import { HeadingType, TextType, ButtonType, ImageType } from "@utils/types";
import { useContract } from "@hooks";
import NftItem from "@components/nft-item";
// import Product from "@components/product/layout-01";
import { MarketplaceContract } from "@constant";
import { useAppSelector } from "@app/hooks";
import NftItemSkeleton from "@components/nft-item/skeleton";

const HeroArea = ({ data }) => {
    const { connect, connectedWallet } = useWalletManager();
    const [displayNfts, setDisplayNfts] = useState(null);
    const { runQuery } = useContract();
    const collections = useAppSelector((state) => state.collections);
    useEffect(() => {
        (async () => {
            const contractData = await runQuery(MarketplaceContract, {
                asks_sorted_by_bid_count: {},
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
                            .title,
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
        <div className="slider-style-5 rn-section-gapTop">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6 order-2 order-lg-1 mt_md--30 mt_sm--30 pr--90">
                        {data?.headings[0]?.content && (
                            <h2
                                className="title"
                                // data-sal-delay="200"
                                // data-sal="slide-up"
                                // data-sal-duration="800"
                            >
                                {data.headings[0].content}
                            </h2>
                        )}
                        {data?.texts?.map((text) => (
                            <p
                                className="slide-disc"
                                // data-sal-delay="300"
                                // data-sal="slide-up"
                                // data-sal-duration="800"
                                key={text.id}
                            >
                                {text.content}
                            </p>
                        ))}
                        <div className="button-group">
                            {connectedWallet ? (
                                <Button path="/create-nft" color="primary-alta">
                                    Create
                                </Button>
                            ) : (
                                <Button
                                    onClick={async () => {
                                        connect();
                                        await checkKeplr();
                                    }}
                                >
                                    Get Started
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6 order-1 order-lg-2">
                        <div className="row g-5">
                            {!displayNfts &&
                                [...new Array(2)].map((item, index) => (
                                    <div
                                        className="col-lg-6 col-md-6"
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={index}
                                    >
                                        <NftItemSkeleton />
                                    </div>
                                ))}
                            {displayNfts &&
                                displayNfts.slice(0, 2).map((prod) => (
                                    <div
                                        className="col-lg-6 col-md-6"
                                        key={prod.id || prod.token_id}
                                    >
                                        <NftItem overlay item={prod} />
                                    </div>
                                ))}
                        </div>
                        {/* {data?.images?.[0]?.src && (
                            <div className="slider-thumbnail">
                                <Image
                                    src={data.images[0].src}
                                    alt={data.images[0]?.alt || "Slider Images"}
                                    width={585}
                                    height={593}
                                />
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

HeroArea.propTypes = {
    data: PropTypes.shape({
        headings: PropTypes.arrayOf(HeadingType),
        texts: PropTypes.arrayOf(TextType),
        buttons: PropTypes.arrayOf(ButtonType),
        images: PropTypes.arrayOf(ImageType),
    }),
};

export default HeroArea;
