/* eslint-disable react/prop-types */
import { useReducer, useRef, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import SectionTitle from "@components/section-title";
import ProductFilter from "@components/product-filter";
import NftItem from "@components/nft-item";
import Pagination from "@components/pagination";
import FilterButton from "@ui/filter-button";
import { slideToggle } from "@utils/methods";
// import { SectionTitleType, NftType } from "@utils/types";

function reducer(state, action) {
    switch (action.type) {
        case "FILTER_TOGGLE":
            return { ...state, filterToggle: !state.filterToggle };
        case "SET_INPUTS":
            return { ...state, inputs: { ...state.inputs, ...action.payload } };
        case "SET_PRODUCTS":
            return { ...state, products: action.payload };
        default:
            return state;
    }
}

const COUNT_PER_PAGE = 10;

const ExploreProductArea = ({ className, space, data, hiddenExpired }) => {
    // const itemsToFilter = [...data.products];
    const [currentPage, setCurrentPage] = useState(1);
    const [state, dispatch] = useReducer(reducer, {
        filterToggle: false,
        products: data.products || [],
        inputs: { price: [0, 100] },
    });
    const filterRef = useRef(null);
    const filterHandler = () => {
        dispatch({ type: "FILTER_TOGGLE" });
        if (!filterRef.current) return;
        slideToggle(filterRef.current);
    };

    const getNftPrice = (priceAmount) => Number(priceAmount) / 1e6;

    const priceRange = useMemo(() => {
        let maxPrice = 0;
        state.products?.nft.forEach((nft) => {
            const nftPrice = getNftPrice(nft.price?.amount || 0);
            maxPrice = nftPrice > maxPrice ? nftPrice : maxPrice;
        });
        return maxPrice;
    }, [state.products?.nft]);

    const displayNfts = useMemo(() => {
        const { price, sale_type } = state.inputs || {};
        const filteredNfts = [];
        state.products?.nft.forEach((nft) => {
            let filtered = true;
            if (hiddenExpired) {
                const expiresAt = nft.expires_at;
                const expired = Date.now() - Number(expiresAt) > 0;
                filtered = filtered && (!expiresAt || !expired);
            }
            const nftPrice = getNftPrice(nft.price?.amount || 0);
            // nftPrice = Number.isNaN(nftPrice) ? 0 : nftPrice / 1e6;
            filtered =
                filtered &&
                nftPrice >= (price[0] * priceRange) / 100 &&
                nftPrice <= (price[1] * priceRange) / 100;
            // console.log("filtered1: ", filtered, nftPrice);
            if (sale_type === "fixed-price") {
                filtered = filtered && nft.sale_type === "fixed_price";
                // console.log("filtered2: ", filtered);
            } else if (sale_type === "auction") {
                filtered = filtered && nft.sale_type === "auction";
                // console.log("filtered3: ", filtered);
            }
            // console.log("filtered4: ", filtered);
            if (filtered) {
                filteredNfts.push(nft);
            }
        });
        return filteredNfts;
    }, [hiddenExpired, priceRange, state.inputs, state.products?.nft]);
    const numberOfPages = Math.ceil(
        (displayNfts?.length || 0) / COUNT_PER_PAGE
    );

    const paginationHandler = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const selectHandler = ({ value }, name) => {
        dispatch({ type: "SET_INPUTS", payload: { [name]: value } });
    };

    const priceHandler = (value) => {
        dispatch({ type: "SET_INPUTS", payload: { price: value } });
    };

    // const sortHandler = ({ value }) => {
    //     const sortedProducts = state.products.sort((a, b) => {
    //         if (value === "most-liked") {
    //             return a.likeCount < b.likeCount ? 1 : -1;
    //         }
    //         return a.likeCount > b.likeCount ? 1 : -1;
    //     });
    //     dispatch({ type: "SET_PRODUCTS", payload: sortedProducts });
    // };

    // !must removed in the future;
    useEffect(() => {
        dispatch({ type: "SET_PRODUCTS", payload: data.products });
    }, [data.products]);

    // const filterMethods = (item, filterKey, value) => {
    return (
        <div
            className={clsx(
                "rn-product-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row mb--50 align-items-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        {data?.section_title && (
                            <SectionTitle
                                className="mb--0"
                                {...data.section_title}
                            />
                        )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt_mobile--15">
                        <FilterButton
                            open={state.filterToggle}
                            onClick={filterHandler}
                        />
                    </div>
                </div>

                <ProductFilter
                    ref={filterRef}
                    selectHandler={selectHandler}
                    // sortHandler={sortHandler}
                    priceHandler={priceHandler}
                    inputs={{ ...state.inputs, maxPrice: priceRange }}
                />
                <div className="row g-5">
                    {displayNfts?.length > 0 ? (
                        <>
                            {displayNfts
                                .slice(
                                    (currentPage - 1) * COUNT_PER_PAGE,
                                    (currentPage - 1) * COUNT_PER_PAGE +
                                        COUNT_PER_PAGE
                                )
                                .map((prod) => (
                                    <div
                                        key={prod.token_id}
                                        className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                                    >
                                        <NftItem overlay item={prod} />
                                    </div>
                                ))}
                        </>
                    ) : (
                        <p>No item to show</p>
                    )}
                </div>
                <div className="row">
                    <div
                        className="col-lg-12"
                        // data-sal="slide-up"
                        // data-sal-delay="950"
                        // data-sal-duration="800"
                    >
                        <Pagination
                            currentPage={currentPage}
                            numberOfPages={numberOfPages}
                            onClick={paginationHandler}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

ExploreProductArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1, 2]),
    hiddenExpired: PropTypes.bool,
    // data: PropTypes.arrayOf({
    //     section_title: SectionTitleType,
    //     products: PropTypes.shape({
    //         id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    //             .isRequired,
    //         nft: PropTypes.arrayOf(NftType),
    //         auction_date: PropTypes.string,
    //     }),
    //     placeBid: PropTypes.bool,
    // }),
};

ExploreProductArea.defaultProps = {
    space: 1,
};

export default ExploreProductArea;
