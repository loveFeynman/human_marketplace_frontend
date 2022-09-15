import PropTypes from "prop-types";
import TopSeller from "@components/top-seller/layout-02";
// import { IDType, ImageType } from "@utils/types";

const BidsTabContent = ({ bids }) => {
    const sortedBids = bids.sort((bid1, bid2) => bid2.price - bid1.price);
    return (
        <div>
            {sortedBids?.map((bid) => (
                <TopSeller
                    key={bid.bidder}
                    name={bid.bidder}
                    eth={bid.price}
                    // path={bid.user.slug}
                    // time={bid.bidAt}
                    // image={{ src: bid.user.image.src, width: 44, height: 44 }}
                />
            ))}
        </div>
    );
};

BidsTabContent.propTypes = {
    // bids: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         id: IDType.isRequired,
    //         user: PropTypes.shape({
    //             name: PropTypes.string.isRequired,
    //             slug: PropTypes.string.isRequired,
    //             image: ImageType.isRequired,
    //         }),
    //         amount: PropTypes.string.isRequired,
    //         bidAt: PropTypes.string,
    //     })
    // ),
    bids: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool,
            bidder: PropTypes.string,
            collection: PropTypes.string,
            price: PropTypes.number,
            token_id: PropTypes.string,
        })
    ),
};

export default BidsTabContent;
