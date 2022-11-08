import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import NftItem from "@components/nft-item";
import SectionTitle from "@components/section-title/layout-02";
import Anchor from "@ui/anchor";
import { ProductType, SectionTitleType } from "@utils/types";
import { useAxios, useContract } from "@hooks";
import { useAppSelector } from "@app/hooks";

// Demo Data
import NftItemSkeleton from "@components/nft-item/skeleton";
import productData from "../../../data/products.json";

const ProductArea = ({ space, className }) => {
    const { getNewestItem } = useAxios();
    const { runQuery } = useContract();
    const collections = useAppSelector((state) => state.collections);
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    const data = productData
        .sort(
            (a, b) =>
                Number(new Date(b.published_at)) -
                Number(new Date(a.published_at))
        )
        .slice(0, 5);
    const [displayNfts, setDisplayNfts] = useState(null);
    useEffect(() => {
        (async () => {
            const newNfts = await getNewestItem();
            const newNftInfo = await Promise.all(
                newNfts?.map(async (nft) => {
                    try {
                        const nftData = await runQuery(nft.collection, {
                            all_nft_info: {
                                token_id: nft.tokenId,
                            },
                        });
                        const marketplaceNft =
                            marketplaceNfts[nft.collection]?.filter(
                                (item) => item.token_id === nft.tokenId
                            )[0] || {};
                        return {
                            ...marketplaceNft,
                            image_url:
                                nftData?.info.extension.image_url.startsWith(
                                    "http"
                                )
                                    ? nftData?.info.extension.image_url
                                    : "/images/bg/bg-image-9.png",
                            token_address: nft.collection,
                            token_id: nft.tokenId,
                            token_url: nftData?.info.token_uri,
                            collection:
                                collections[nft.collection]?.collection_info
                                    .title,
                            owner: nftData?.access.owner,
                        };
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.log("queryError: ", err);
                        return nft;
                    }

                    // const selectedNftData = {
                    //     ...marketplaceNft,
                    //     image_url: nftData?.info.extension.image_url,
                    //     token_address: collection,
                    //     token_id: tokenId,
                    //     token_url: nftData?.info.token_uri,
                    //     collection: collections[collection]?.collection_info.title,
                    // };
                })
            );
            setDisplayNfts(newNftInfo || []);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getNewestItem, runQuery]);
    return (
        <div
            className={clsx(
                "rn-new-items",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row mb--50 align-items-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <SectionTitle title="Newest Items" className="mb-0" />
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt_mobile--15">
                        <div
                            className="view-more-btn text-start text-sm-end"
                            // data-sal-delay="150"
                            // data-sal="slide-up"
                            // data-sal-duration="800"
                        >
                            <Anchor
                                className="btn-transparent"
                                path="/explore/collections"
                            >
                                VIEW ALL
                                <i className="feather feather-arrow-right" />
                            </Anchor>
                        </div>
                    </div>
                </div>
                {data && (
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
                            displayNfts.map((prod) => (
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
                )}
            </div>
        </div>
    );
};

ProductArea.propTypes = {
    space: PropTypes.oneOf([1, 2]),
    className: PropTypes.string,
    data: PropTypes.shape({
        section_title: SectionTitleType,
        products: PropTypes.arrayOf(ProductType).isRequired,
    }),
};

ProductArea.defaultProps = {
    space: 1,
};

export default ProductArea;
