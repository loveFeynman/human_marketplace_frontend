import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Product from "@components/product/layout-01";
import SectionTitle from "@components/section-title/layout-02";
import Anchor from "@ui/anchor";
import { ProductType, SectionTitleType } from "@utils/types";
import { useAxios, useContract } from "@hooks";

// Demo Data
import productData from "../../../data/products.json";

const ProductArea = ({ space, className }) => {
    const { getNewestItem } = useAxios();
    const { runQuery } = useContract();
    const data = productData
        .sort(
            (a, b) =>
                Number(new Date(b.published_at)) -
                Number(new Date(a.published_at))
        )
        .slice(0, 5);
    const [displayNfts, setDisplayNfts] = useState([]);
    useEffect(() => {
        (async () => {
            const newNfts = await getNewestItem();
            console.log("newNfts: ", newNfts);
            const nftData = await runQuery(
                "human1xt4ahzz2x8hpkc0tk6ekte9x6crw4w6u0r67cyt3kz9syh24pd7sx2rhv4",
                {
                    all_nft_info: {
                        token_id: "Human.119",
                    },
                }
            );
            console.log("nftData: ", nftData);
            // const newNftInfo = await Promise.all(
            //     newNfts.map(async (nft) => {
            //         try {
            //             const nftData = await runQuery(nft.collection, {
            //                 all_nft_info: {
            //                     token_id: nft.token_id,
            //                 },
            //             });
            //             console.log("queryInfor: ", nft, nftData);
            //             return null;
            //         } catch (err) {
            //             console.log("queryError: ", err);
            //             return null;
            //         }

            //         // const selectedNftData = {
            //         //     ...marketplaceNft,
            //         //     image_url: nftData?.info.extension.image_url,
            //         //     token_address: collection,
            //         //     token_id: tokenId,
            //         //     token_url: nftData?.info.token_uri,
            //         //     collection: collections[collection]?.collection_info.title,
            //         // };
            //     })
            // );
        })();
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
                            <Anchor className="btn-transparent" path="/product">
                                VIEW ALL
                                <i className="feather feather-arrow-right" />
                            </Anchor>
                        </div>
                    </div>
                </div>
                {data && (
                    <div className="row g-5">
                        {data.map((prod) => (
                            <div
                                key={prod.id}
                                // data-sal="slide-up"
                                // data-sal-delay="150"
                                // data-sal-duration="800"
                                className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                            >
                                <Product
                                    title={prod.title}
                                    slug={prod.slug}
                                    latestBid={prod.latestBid}
                                    price={prod.price}
                                    likeCount={prod.likeCount}
                                    image={prod.images?.[0]}
                                    authors={prod.authors}
                                    bitCount={prod.bitCount}
                                />
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