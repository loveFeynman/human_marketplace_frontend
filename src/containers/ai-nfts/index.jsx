import PropTypes from "prop-types";
import clsx from "clsx";
import AiProduct from "@components/product/ai-product";
import { SectionTitleType, ProductType } from "@utils/types";

// eslint-disable-next-line no-unused-vars
const AiNftsArea = ({ data, className, space, gap }) => (
    <div
        className={clsx(
            "rn-live-bidding-area",
            space === 1 && "rn-section-gapTop",
            className
        )}
    >
        <div className="container">
            {data?.products && (
                <div className={clsx("row", `g-4`)}>
                    {data.products.map((prod) => (
                        <div
                            key={prod.id}
                            className="col-3 col-lg-4 col-md-4 col-sm-4 col-12"
                        >
                            <AiProduct
                                overlay
                                placeBid={!!data.placeBid}
                                title={prod.title}
                                slug="executor/ai-nft-1"
                                auction_date={prod.auction_date}
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

AiNftsArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1, 2]),
    data: PropTypes.shape({
        section_title: SectionTitleType,
        products: PropTypes.arrayOf(ProductType).isRequired,
        placeBid: PropTypes.bool,
    }),
    gap: PropTypes.number,
};

AiNftsArea.defaultProps = {
    space: 1,
};

export default AiNftsArea;
