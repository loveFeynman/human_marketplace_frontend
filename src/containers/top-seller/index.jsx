import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import SectionTitle from "@components/section-title/layout-02";
import TopSeller from "@components/top-seller/layout-01";
import NiceSelect from "@ui/nice-select";
import { getTopSellers } from "./hooks";
// import { slugify } from "@utils/methods";

const TopSellerArea = ({ className, space, id }) => {
    const [current, setCurrent] = useState("1");
    const [sellers, setSellers] = useState([]);
    const changeHandler = (item) => {
        setCurrent(item.value);
    };

    const filterHandler = useCallback(async () => {
        const data = await getTopSellers(current);
        data.sort((a, b) => Number(b.sum.price) - Number(a.sum.price));
        setSellers(data);
        // setSellers(filterdSellers);
    }, [current]);

    useEffect(() => {
        filterHandler();
    }, [filterHandler]);
    return (
        <div
            className={clsx(
                "rn-top-top-seller-area nice-selector-transparent",
                space === 1 && "rn-section-gapTop",
                space === 2 && "rn-section-gapBottom",
                space === 3 && "pt--50",
                className
            )}
            id={id}
        >
            <div className="container">
                <div className="row  mb--30">
                    <div className="col-12 justify-sm-center d-flex">
                        <SectionTitle title="Top Seller in" />
                        <NiceSelect
                            options={[
                                { value: "1", text: "1 day" },
                                { value: "7", text: "7 Day's" },
                                { value: "15", text: "15 Day's" },
                                { value: "30", text: "30 Day's" },
                            ]}
                            defaultCurrent={0}
                            name="sellerSort"
                            onChange={changeHandler}
                        />
                    </div>
                </div>
                <div className="row justify-sm-center g-5 top-seller-list-wrapper">
                    {sellers.map((seller) => (
                        <div
                            key={`${seller.logo}-${seller.keys[0]}`}
                            className="col-5 col-lg-3 col-md-4 col-sm-6 top-seller-list"
                        >
                            <TopSeller
                                name={seller.name}
                                total_sale={seller.sum.price}
                                slug={`/profile/${seller.keys[0]}`}
                                image={{ src: seller.logo }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

TopSellerArea.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    space: PropTypes.oneOf([1, 2, 3]),
};

TopSellerArea.defaultProps = {
    space: 1,
};

export default TopSellerArea;
