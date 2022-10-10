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

const ExploreProductArea = ({ className, space, data }) => {
    const filters = [
        "ai nft",
        "language processing",
        "syntetic media",
        "lowest",
        "highest",
    ];
    const [products, setProducts] = useState([]);
    const marketplaceNfts = useAppSelector((state) => state.marketplaceNfts);
    // console.log("marketplace: ", marketplaceNfts);
    useEffect(() => {
        let marketNfts = [];
        Object.keys(marketplaceNfts || {}).forEach((key) => {
            const crrNfts = marketplaceNfts[key];
            marketNfts = [...marketNfts, ...crrNfts];
        });
        setProducts(marketNfts);
    }, [marketplaceNfts]);

    const filterHandler = (filterKey) => {
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
