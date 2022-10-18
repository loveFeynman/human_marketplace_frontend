import PropTypes from "prop-types";
import TopSeller from "@components/top-seller/layout-02";
import { pinataUrl } from "@constant";
// import { IDType, ImageType } from "@utils/types";

const BidsTabContent = ({ bids }) => {
    const sortedBids = bids.sort((bid1, bid2) => bid2.price - bid1.price);
    const getStandardTime = (time) => {
        const interval = Date.now() / 1000 - Number(time) / 1000;
        if (interval < 3600) return `${(interval / 60).toFixed(0)} mins`;
        if (interval < 3600 * 24) {
            return `${(interval / 3600).toFixed(0)} hours`;
        }
        return `${(interval / 3600 / 24).toFixed(0)} days`;
    };
    return (
        <div>
            {(!sortedBids || sortedBids?.length === 0) && (
                <div className="pt--20">No bids placed yet</div>
            )}
            {sortedBids?.map((bid) => (
                <TopSeller
                    key={bid.bidder}
                    name={bid.name}
                    eth={bid.price.toString()}
                    // path={bid.user.slug}
                    // time={bid.bidAt}
                    // image={{ src: bid.user.image.src, width: 44, height: 44 }}
                    path={bid.slug}
                    time={`${getStandardTime(bid.time)} ago`}
                    image={{
                        src: bid.logo
                            ? `${pinataUrl}/${bid.logo}`
                            : "/images/client/client-3.png",
                        width: 44,
                        height: 44,
                    }}
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
